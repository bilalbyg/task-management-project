// Business logics
const { insert, list, modify, remove } = require("../services/Sections");
const httpStatus = require("http-status");

const create = (req, res) => {
  req.body.user_id = req.user;
  insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const index = (req, res) => {
  if(!req?.params?.projectId) return res.status(httpStatus.BAD_REQUEST).send({ message : "Project ID required"})
  list({ projectId : req.params.projectId })
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const update = (req, res) => {
  console.log(req.params.id);
  if (!req.params.id) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "ID value required" });
  }
  modify(req.body, req.params.id)
    .then((updatedProject) => {
      res.status(httpStatus.OK).send(updatedProject);
    })
    .catch((e) =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Update error" })
    );
};

const deleteSection = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "ID value required",
    });
  }
  remove(req.params?.id)
    .then((deletedProject) => {
      if(!deletedProject){
        return res.stats(httpStatus.NOT_FOUND).send({
          message : "Project not found"
        })
      }
      res.status(httpStatus.OK).send({
        message: "Delete succeed",
      });
    })
    .catch((e) =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Delete error" })
    );
};

module.exports = {
  create,
  index,
  update,
  deleteSection,
};

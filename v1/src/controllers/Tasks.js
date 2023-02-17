// Business logics
const { insert, list, modify, remove, findOne } = require("../services/Tasks");
const httpStatus = require("http-status");

const create = (req, res) => {
  req.body.user_id = req.user;
  insert(req.body)
    .then(response => {  // refactor (response) --> response
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
  if (!req.params?.id) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "ID value required" });
  }
  modify(req.body, req.params?.id)
    .then((updatedDoc) => {
      console.log(updatedDoc);
      res.status(httpStatus.OK).send(updatedDoc);
    })
    .catch((e) =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send(
          e
          //{ error: "Update error : controller " }
        ) 
    );
};

const deleteTask = (req, res) => {
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

const makeComment = (req, res) => {
  findOne({ _id : req.params.id}).then(mainTask => {
    if(!mainTask) return res.status(httpStatus.NOT_FOUND).send({ message : "There is no task"})
    const comment = {
      ...req.body, 
      commented_at : new Date(),
      user_id : req.user
    }
    mainTask.comments.push(comment);
    mainTask.save().then(updatedDoc => {
      return res.status(httpStatus.OK).send(updatedDoc)
    }).catch({ message : "Comment error"})
  }).catch({ message : "Comment error"});
  return ;
}

const deleteComment = (req, res) => {
  findOne({ _id : req.params.id}).then(mainTask => {
    if(!mainTask) return res.status(httpStatus.NOT_FOUND).send({ message : "There is no task"})

    mainTask.comments = mainTask.comments.filter( (c) => c._id?.toString() !== req.params.commentId)
    mainTask.save().then(updatedDoc => {
      return res.status(httpStatus.OK).send(updatedDoc)
    }).catch({ message : "Comment error"})
  }).catch({ message : "Comment error"});
  return ;
}




module.exports = {
  create,
  index,
  update,
  deleteTask,
  makeComment,
  deleteComment 
};

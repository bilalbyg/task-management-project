// Business logics
const { insert, list, loginUser, modify, remove } = require("../services/Users");
const httpStatus = require("http-status");
const projectService = require("../services/Projects");
const uuid = require("uuid");
const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} = require("../scripts/utils/helper");
const eventEmitter = require("../scripts/events/eventEmitter");
const path = require("path");

const create = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const index = (req, res) => {
  list()
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const login = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  loginUser(req.body)
    .then((user) => {
      // unique email will add to register
      if (!user)
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "User not found" });
      user = {
        ...user.toObject(),
        tokens: {
          access_token: generateAccessToken(user),
          refresh_token: generateRefreshToken(user),
        },
      };
      //delete user.password;
      res.status(httpStatus.OK).send(user);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const projectList = (req, res) => {
  // this function is moved to Project Controller file, because for "SOLID" principles
  projectService
    .list({ user_id: req.user?._id })
    .then((projects) => {
      res.status(httpStatus.OK).send(projects);
    })
    .catch((e) => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Unexpected error" });
    });
};

const resetPassword = (req, res) => {
  const new_password = uuid.v4()?.split("-")[0] || new Date().getTime();
  modify({ email: req.body.email }, { password: passwordToHash(new_password) })
    .then((updatedUser) => {
      if (!updatedUser)
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ error: "User not found" });
      eventEmitter.emit("send_email", {
        to: updatedUser.email,
        subject: "Password Reset",
        html: `Your password reseted. Your new password : ${new_password}`,
      });
      res
        .status(httpStatus.OK)
        .send({
          message:
            "Password reset email sent your email address. Check your mailbox.",
        });
    })
    .catch(() =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Password reset error" })
    );
};

const update = (req, res) => {
  modify({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      res.status(httpStatus.OK).send(updatedUser);
    })
    .catch(() =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "User update error" })
    );
};

const changePassword = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  // change password conditions
  modify({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      res.status(httpStatus.OK).send(updatedUser);
    })
    .catch(() =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "User update error" })
    );
};

const deleteUser = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "ID value required",
    });
  }
  remove(req.params?.id)
    .then((deletedUser) => {
      if(!deletedUser){
        return res.stats(httpStatus.NOT_FOUND).send({
          message : "User not found"
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

const updateProfileImage = (req, res) => {
  // Image Control
  if(!req?.files?.profile_image){
    return res.status(httpStatus.BAD_REQUEST).send({ error : "Profile Image Error"})
  }

  // Upload Process
  const extension = path.extname(req.files.profile_image.name);
  const fileName = `${req?.user._id}${extension}`
  const folderPath = path.join(__dirname, "../", "uploads/users", fileName);

  req.files.profile_image.mv(folderPath, function(err) {
    if(err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error : err});
    modify({ _id : req.user._id }, { profile_image : fileName }).then(updatedUser => {
      res.status(httpStatus.OK).send(updatedUser);
    }).catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error : "Upload succeed but unexpected error"}))
  });
  console.log(req.files);
}

module.exports = {
  create,
  index,
  login,
  projectList,
  resetPassword,
  update,
  deleteUser,
  changePassword,
  updateProfileImage
};

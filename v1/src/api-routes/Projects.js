// validation middleware
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");


// validation schemas
const schemas = require("../validations/Projects");
const express = require("express");

const { create, index, update,  deleteProject } = require("../controllers/Projects");
const router = express.Router();

router.route("/").get(authenticate, index);
router.route("/").post(authenticate,validate(schemas.createValidation), create);
router.route("/:id").delete(authenticate, deleteProject);
router.route("/:id").patch(authenticate,validate(schemas.updateValidation), update);



module.exports = router;

// validation middleware
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");


// validation schemas
const schemas = require("../validations/Sections");
const express = require("express");

const { create, index, update, deleteSection } = require("../controllers/Sections");
// const { create, index, update,  deleteSection } = require("../controllers/Sections");
const router = express.Router();

router.route("/:projectId").get(authenticate, index);
router.route("/").post(authenticate,validate(schemas.createValidation), create);
router.route("/:id").delete(authenticate, deleteSection);
router.route("/:id").patch(authenticate,validate(schemas.updateValidation), update);



module.exports = router;

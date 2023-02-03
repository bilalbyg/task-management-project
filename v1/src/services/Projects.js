const Project = require("../models/ProjectModel");

const insert = (projectData) => {
  const project = new Project(projectData);
  console.log(projectData);
  return project.save();
};

const list = () => {
  return Project.find({});
}

module.exports = {
  insert, list
};
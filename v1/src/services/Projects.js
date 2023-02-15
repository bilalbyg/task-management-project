const Project = require("../models/ProjectModel");

const insert = (projectData) => {
  const project = new Project(projectData);
  console.log(projectData);
  return project.save();
};

const list = (where) => {
  return Project.find(where || {}).populate({
    path : "user_id",
    select : "full_name email"
  });
}

const modify = (data, id) => {
  return Project.findByIdAndUpdate(id, data, { new : true}); 
}

const remove = (id) => {
  return Project.findByIdAndDelete(id); 
}

module.exports = {
  insert, list, modify, remove
};
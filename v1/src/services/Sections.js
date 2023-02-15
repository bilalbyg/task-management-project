const Section = require("../models/SectionModel");

const insert = (sectionData) => {
  return new Section(sectionData).save();
};

const list = (where) => {
  return Section.find(where || {}).populate({
    path : "user_id",
    select : "full_name email profile_image"
  }).populate({
    path : "project_id",
    select : "name"
  });
};

const modify = (where, updateData) => {
  // This block's goal is learning. JOI did this for us.
  // const updateData = Object.keys(data).reduce((obj, key) => {
  //   if (key !== "password") obj[key] = data[key];
  //   return obj;
  // }, {});
  return Section.findOneAndUpdate(where, updateData, { new: true });
};

const remove = (id) => {
  return Section.findByIdAndDelete(id);
};

module.exports = {
  insert,
  list,
  modify,
  remove,
};

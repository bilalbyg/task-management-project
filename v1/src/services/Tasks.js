const Task = require("../models/TaskModel");

const insert = (data) => {
  return new Task(data).save();
};

const list = (where) => {
  return Task.find(where || {}).populate({
    path : "user_id",
    select : "full_name email profile_image"
  })
};

const modify = (data, id) => {
  return Task.findByIdAndUpdate(id, data, { new: true }); // diğer servisler findOne kalmış düzeltilecek
};

const remove = (id) => {
  return Task.findByIdAndDelete(id);
};

const findOne = (where) => {
  return Task.findOne(where);
}

module.exports = {
  insert,
  list,
  modify,
  remove,
  findOne
};

const User = require("../models/UserModel");

const insert = (userData) => {
  const user = new User(userData);
  console.log(userData);
  return user.save();
};

const list = () => {
  return User.find({});
}

const loginUser = (loginData) => {
  return User.findOne(loginData);
}

module.exports = {
  insert, list, loginUser
};
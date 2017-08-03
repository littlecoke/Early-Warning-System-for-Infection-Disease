const db = require('../config/db');
const userModel = '../schema/user_info.js'; // a string for path not a module
const alarmDB = db.alarmDB;
const User = alarmDB.import(userModel);

const getUserById = async (id) => {
  const userInfo = await User.findOne({
    where: {
      id: id
    }
  });
  return userInfo;
};

module.exports = {
  getUserById
};
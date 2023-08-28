const { StatusCodes } = require("http-status-codes");
const { response } = require("../utils/response");
const { User } = require("../models/User.model");

const userList = async (req, res) => {
  try {
    const userData = await User.find();
    return response(res, StatusCodes.CREATED, true, { userData }, "success");
  } catch (error) {
    console.log(
      "🚀 ~ file: auth.controller.js:153 ~ refreshToken ~ error:",
      error
    );
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Something went wrong"
    );
  }
};

module.exports = { userList };

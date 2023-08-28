const { StatusCodes } = require("http-status-codes");
const { response } = require("../utils/response");
const {
  generateHashPassword,
  comparePassword,
} = require("../utils/passwordManager");
const { User } = require("../models/User.model");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyJwtToken,
} = require("../utils/tokenManager");
const config = require("../config/config");

const registration = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Please provide required data"
      );
    }

    const userData = await User.findOne({ email: email });

    if (userData) {
      return response(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        false,
        {},
        "User already exist"
      );
    }

    const hashPass = await generateHashPassword(password);

    await User.create({ fullName, email, password: hashPass });
    return response(res, StatusCodes.CREATED, true, {}, "New user created");
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Something went wrong"
    );
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Please provide required data"
      );
    }

    const userData = await User.findOne({ email: email });

    if (!userData) {
      return response(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        false,
        {},
        "User does not exist"
      );
    }

    const hashPass = await comparePassword(password, userData?.password);

    if (!hashPass) {
      return response(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        false,
        {},
        "Invalid password"
      );
    }

    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);

    res.cookie("jwt_token", refreshToken, {
      httpOnly: true,
      maxAge: 604800000,
    });

    return response(
      res,
      StatusCodes.CREATED,
      true,
      { accessToken },
      "Login success"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Something went wrong"
    );
  }
};

const refreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    console.log(
      "🚀 ~ file: auth.controller.js:125 ~ refreshToken ~ cookies:",
      cookies
    );

    if (!cookies?.jwt_token) {
      return response(res, StatusCodes.UNAUTHORIZED, false, {}, "Unauthorized");
    }

    const token = cookies.jwt_token;

    const tokenInfo = verifyJwtToken(token, config.refreshTokenSecretKey);

    if (!tokenInfo) {
      return response(res, StatusCodes.FORBIDDEN, false, {}, "Forbidden");
    }

    const userData = await User.findOne({ email: tokenInfo?.email });

    if (!userData) {
      return response(
        res,
        StatusCodes.UNAUTHORIZED,
        false,
        {},
        "You are not authorized"
      );
    }

    const accessToken = generateAccessToken(userData);

    return response(res, StatusCodes.CREATED, true, { accessToken }, "success");
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Something went wrong"
    );
  }
};

const logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    console.log(
      "🚀 ~ file: auth.controller.js:125 ~ refreshToken ~ cookies:",
      cookies
    );
    res.clearCookie("jwt_token", { httpOnly: true });

    console.log(req.cookies);

    return response(res, StatusCodes.CREATED, true, {}, "Logout success");
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

module.exports = { registration, login, refreshToken, logout };

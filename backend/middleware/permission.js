const { StatusCodes } = require("http-status-codes");
const { verifyJwtToken } = require("../utils/tokenManager");
const config = require("../config/config");
const { response } = require("../utils/response");

const isLoggedIn = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return response(res, StatusCodes.UNAUTHORIZED, false, {}, "Unauthorized");
    }

    const token = authorization.split(" ")[1];

    const tokenInfo = await verifyJwtToken(token, config.accessTokenSecretKey);

    if (!tokenInfo) {
      return response(
        res,
        StatusCodes.FORBIDDEN,
        false,
        {},
        "Ypu are not allowed"
      );
    }

    req.user = tokenInfo;
    next();
  } catch (error) {
    return response(
      res,
      StatusCodes.UNAUTHORIZED,
      false,
      {},
      "You are not allowed"
    );
  }
};

module.exports = { isLoggedIn };

const jwt = require("jsonwebtoken");
const config = require("../config/config");

const generateAccessToken = (userData) => {
  const token = jwt.sign(
    { _id: userData?._id, email: userData?.email, role: userData?.role },
    config.accessTokenSecretKey,
    { expiresIn: "1min" }
  );

  return token;
};

const generateRefreshToken = (userData) => {
  const token = jwt.sign(
    { _id: userData?._id, email: userData?.email, role: userData?.role },
    config.refreshTokenSecretKey,
    { expiresIn: "2min" }
  );
  return token;
};

const verifyJwtToken = (token, secretKey) => {
  try {
    const decoded = jwt.verify(token, secretKey);

    return decoded;
  } catch (error) {
    return false;
  }
};

module.exports = { generateAccessToken, generateRefreshToken, verifyJwtToken };

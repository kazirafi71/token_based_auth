const {
  registration,
  login,
  refreshToken,
  logout,
} = require("../controllers/auth.controller");

const router = require("express").Router();

router.post("/auth/registration", registration);

router.post("/auth/login", login);

router.get("/auth/refreshToken", refreshToken);

router.post("/auth/logout", logout);

module.exports = router;

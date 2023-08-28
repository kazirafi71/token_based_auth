const { userList } = require("../controllers/user.controller");
const { isLoggedIn } = require("../middleware/permission");

const router = require("express").Router();

router.get("/user/user-list", isLoggedIn, userList);

module.exports = router;

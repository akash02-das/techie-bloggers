const router = require("express").Router();

const {
  signupGetController,
  signupPostController,
  loginGetController,
  loginPostController,
  logoutController,
} = require("../controllers/authController");

router.get("/signup", signupGetController);
router.get("/signup", signupPostController);
router.get("/login", loginGetController);
router.get("/login", loginPostController);
router.get("/logout", logoutController);

module.exports = router;

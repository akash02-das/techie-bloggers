const router = require("express").Router();
const signupValidator = require("../validations/auth/signupValidator");
const loginValidator = require("../validations/auth/loginValidator");

const {
  signupGetController,
  signupPostController,
  loginGetController,
  loginPostController,
  logoutController,
  changePasswordGetController,
  changePasswordPostController,
} = require("../controllers/authController");

const {
  isAuthenticated,
  isUnAuthenticated,
} = require("../middleware/authMiddleware");

router.get("/signup", isUnAuthenticated, signupGetController);
router.post(
  "/signup",
  isUnAuthenticated,
  signupValidator,
  signupPostController
);
router.get("/login", isUnAuthenticated, loginGetController);
router.post("/login", isUnAuthenticated, loginValidator, loginPostController);

router.get("/change-password", isAuthenticated, changePasswordGetController);
router.post("/change-password", isAuthenticated, changePasswordPostController);

router.get("/logout", logoutController);

module.exports = router;

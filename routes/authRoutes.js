const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const {
  signupGetController,
  signupPostController,
  loginGetController,
  loginPostController,
  logoutController,
} = require("../controllers/authController");

const signupValidator = [
  body("username")
    .isLength({ min: 2, max: 15 })
    .withMessage("Username must be between 2 to 15 characters")
    .custom(async (username) => {
      let user = await User.findOne({ username });
      if (user) {
        return Promise.reject("Username already is used");
      }
    })
    .trim(),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .custom(async (email) => {
      let email = await User.findOne({ email });
      if (email) {
        return Promise.reject("Email already is used");
      }
    })
    .normalizeEmail(),

  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be greater than 5 characters"),

  body("confirmPassword").custom((confirmPassword, { req }) => {
    if (confirmPassword !== req.body.password) {
      throw new Error("Password does not match");
    }
  }),
];

router.get("/signup", signupValidator, signupGetController);
router.post("/signup", signupPostController);
router.get("/login", loginGetController);
router.post("/login", loginPostController);
router.get("/logout", logoutController);

module.exports = router;

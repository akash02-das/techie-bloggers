const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const User = require("../models/User");
const errorFormatter = require("../utils/validationErrorFormatter");

exports.signupGetController = (request, response, next) => {
  response.render("pages/auth/signup", { title: "Create a new account" });
};

exports.signupPostController = async (request, response, next) => {
  let errors = validationResult(request).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return console.log(errors.mapped());
  }

  let { username, email, password } = request.body;

  try {
    let hashedPassword = await bcrypt.hash(password, 11);

    let user = new User({
      username,
      email,
      password: hashedPassword,
    });

    let createdUser = await user.save();
    console.log("User created successfully", createdUser);
    response.render("pages/auth/signup", { title: "Create a new account" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.loginGetController = (request, response, next) => {
  response.render("pages/auth/login", { title: "Login to your account" });
};

exports.loginPostController = async (request, response, next) => {
  let { email, password } = request.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return response.json({ message: "Invalid Credential" });
    }

    let match = await bcrypt.compare(password, user.password);
    if (!match) {
      return response.json({ message: "Invalid Credential" });
    }

    console.log("Successfully Logged In", user);
    response.render("pages/auth/login", { title: "Login to your account" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.logoutController = (request, response, next) => {};

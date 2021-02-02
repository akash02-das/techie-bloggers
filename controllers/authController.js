const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const User = require("../models/User");
const errorFormatter = require("../utils/validationErrorFormatter");

exports.signupGetController = (request, response, next) => {
  response.render("pages/auth/signup", {
    title: "Create a new account",
    error: {},
    value: {},
  });
};

exports.signupPostController = async (request, response, next) => {
  let { username, email, password } = request.body;

  let errors = validationResult(request).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return response.render("pages/auth/signup", {
      title: "Create a new account",
      error: errors.mapped(),
      value: { username, email, password },
    });
  }

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
  console.log(request.session.isLoggedIn, request.session.user);

  response.render("pages/auth/login", {
    title: "Login to your account",
    error: {},
  });
};

exports.loginPostController = async (request, response, next) => {
  let { email, password } = request.body;

  let errors = validationResult(request).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return response.render("pages/auth/login", {
      title: "Login to your account",
      error: errors.mapped(),
    });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return response.json({ message: "Invalid Credential" });
    }

    let match = await bcrypt.compare(password, user.password);
    if (!match) {
      return response.json({ message: "Invalid Credential" });
    }

    request.session.isLoggedIn = true;
    request.session.user = user;
    request.session.save((error) => {
      if (error) {
        console.log(error);
        return next(error);
      }
      response.redirect("/dashboard");
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.logoutController = (request, response, next) => {
  request.session.destroy((error) => {
    if (error) {
      console.log(error);
      return next(error);
    }
    return response.redirect("/auth/login");
  });
};

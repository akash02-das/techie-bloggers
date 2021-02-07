const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const User = require("../models/User");
const errorFormatter = require("../utils/validationErrorFormatter");
const Flash = require("../utils/Flash");

exports.signupGetController = (request, response, next) => {
  response.render("pages/auth/signup", {
    title: "Create a new account",
    error: {},
    value: {},
    flashMessage: Flash.getMessage(request),
  });
};

exports.signupPostController = async (request, response, next) => {
  let { username, email, password } = request.body;

  let errors = validationResult(request).formatWith(errorFormatter);

  if (!errors.isEmpty()) {
    request.flash("fail", "Please check your form");

    return response.render("pages/auth/signup", {
      title: "Create a new account",
      error: errors.mapped(),
      value: { username, email, password },
      flashMessage: Flash.getMessage(request),
    });
  }

  try {
    let hashedPassword = await bcrypt.hash(password, 11);

    let user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    request.flash("success", "User created successfully");
    response.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
};

exports.loginGetController = (request, response, next) => {
  response.render("pages/auth/login", {
    title: "Login to your account",
    error: {},
    flashMessage: Flash.getMessage(request),
  });
};

exports.loginPostController = async (request, response, next) => {
  let { email, password } = request.body;

  let errors = validationResult(request).formatWith(errorFormatter);

  if (!errors.isEmpty()) {
    request.flash("fail", "Please check your form");

    return response.render("pages/auth/login", {
      title: "Login to your account",
      error: errors.mapped(),
      flashMessage: Flash.getMessage(request),
    });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      request.flash("fail", "Please provide valid credentials");

      return response.render("pages/auth/login", {
        title: "Login to your account",
        error: {},
        flashMessage: Flash.getMessage(request),
      });
    }

    let match = await bcrypt.compare(password, user.password);
    if (!match) {
      request.flash("fail", "Please provide valid credentials");

      return response.render("pages/auth/login", {
        title: "Login to your account",
        error: {},
        flashMessage: Flash.getMessage(request),
      });
    }

    request.session.isLoggedIn = true;
    request.session.user = user;
    request.session.save((error) => {
      if (error) {
        console.log(error);
        return next(error);
      }
      request.flash("success", "Successfully logged in");

      response.redirect("/dashboard");
    });
  } catch (error) {
    next(error);
  }
};

exports.logoutController = (request, response, next) => {
  request.session.destroy((error) => {
    if (error) {
      return next(error);
    }
    request.flash("success", "Successfully logout");

    response.redirect("/auth/login");
  });
};

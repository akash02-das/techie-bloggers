const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const User = require("../models/User");
const errorFormatter = require("../utils/validationErrorFormatter");
const Flash = require("../utils/Flash");

exports.signupGetController = (req, res, next) => {
  res.render("pages/auth/signup", {
    title: "Create a new account",
    error: {},
    value: {},
    flashMessage: Flash.getMessage(req),
  });
};

exports.signupPostController = async (req, res, next) => {
  let { username, email, password } = req.body;

  let errors = validationResult(req).formatWith(errorFormatter);

  if (!errors.isEmpty()) {
    req.flash("fail", "Please check your form");

    return res.render("pages/auth/signup", {
      title: "Create a new account",
      error: errors.mapped(),
      value: { username, email, password },
      flashMessage: Flash.getMessage(req),
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
    req.flash("success", "User created successfully");
    res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
};

exports.loginGetController = (req, res, next) => {
  res.render("pages/auth/login", {
    title: "Login to your account",
    error: {},
    flashMessage: Flash.getMessage(req),
  });
};

exports.loginPostController = async (req, res, next) => {
  let { email, password } = req.body;

  let errors = validationResult(req).formatWith(errorFormatter);

  if (!errors.isEmpty()) {
    req.flash("fail", "Please check your form");

    return res.render("pages/auth/login", {
      title: "Login to your account",
      error: errors.mapped(),
      flashMessage: Flash.getMessage(req),
    });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      req.flash("fail", "Please provide valid credentials");

      return res.render("pages/auth/login", {
        title: "Login to your account",
        error: {},
        flashMessage: Flash.getMessage(req),
      });
    }

    let match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash("fail", "Please provide valid credentials");

      return res.render("pages/auth/login", {
        title: "Login to your account",
        error: {},
        flashMessage: Flash.getMessage(req),
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((error) => {
      if (error) {
        console.log(error);
        return next(error);
      }
      req.flash("success", "Successfully logged in");

      res.redirect("/dashboard");
    });
  } catch (error) {
    next(error);
  }
};

exports.logoutController = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/auth/login");
  });
};

exports.changePasswordGetController = async (req, res, next) => {
  res.render("pages/auth/changePassword", {
    title: "Change my password",
    flashMessage: Flash.getMessage(req),
  });
};

exports.changePasswordPostController = async (req, res, next) => {
  let { oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    req.flash("fail", "Password does not match");
    return res.redirect("/auth/change-password");
  }

  try {
    let match = await bcrypt.compare(oldPassword, req.user.password);
    if (!match) {
      req.flash("fail", "Invalid old password");
      return res.redirect("/auth/change-password");
    }

    let hash = await bcrypt.hash(newPassword, 11);
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { password: hash } }
    );

    req.flash("success", "Password updated successfully");
    return res.redirect("/auth/change-password");
  } catch (error) {
    next(error);
  }
};

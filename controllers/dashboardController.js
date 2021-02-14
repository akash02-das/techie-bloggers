const { validationResult } = require("express-validator");
const Flash = require("../utils/Flash");
const Profile = require("../models/Profile");
const errorFormatter = require("../utils/validationErrorFormatter");

exports.dashboardGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (profile) {
      return res.render("pages/dashboard/dashboard", {
        title: "My dashboard",
        flashMessage: Flash.getMessage(req),
      });
    }

    res.redirect("/dashboard/create-profile");
  } catch (error) {
    next(error);
  }
};

exports.createProfileGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (profile) {
      return res.redirect("/dashboard/edit-profile");
    }

    res.render("pages/dashboard/create-profile", {
      title: "Create your profile",
      flashMessage: Flash.getMessage(req),
    });
  } catch (error) {
    next(error);
  }
};

exports.createProfilePostController = (req, res, next) => {
  let errors = validationResult(req).formatWith(errorFormatter);
  console.log(errors.mapped());

  res.render("pages/dashboard/create-profile", {
    title: "Create your profile",
    flashMessage: Flash.getMessage(req),
  });
};

exports.editProfileGetController = (req, res, next) => {
  next();
};

exports.editProfilePostController = (req, res, next) => {
  next();
};

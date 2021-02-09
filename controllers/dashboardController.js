const Flash = require("../utils/Flash");
const Profile = require("../models/Profile");

exports.dashboardGetController = async (request, response, next) => {
  try {
    let profile = await Profile.findOne({ user: request.user._id });
    if (profile) {
      return response.render("pages/dashboard/dashboard", {
        title: "My dashboard",
        flashMessage: Flash.getMessage(request),
      });
    }

    response.redirect("/dashboard/create-profile");
  } catch (error) {
    next(error);
  }
};

exports.createProfileGetController = async (request, response, next) => {
  try {
    let profile = await Profile.findOne({ user: request.user._id });
    if (profile) {
      return response.redirect("/dashboard/edit-profile");
    }

    response.render("pages/dashboard/create-profile", {
      title: "Create your profile",
      flashMessage: Flash.getMessage(request),
    });
  } catch (error) {
    next(error);
  }
};

exports.createProfilePostController = (request, response, next) => {
  next();
};

exports.editProfileGetController = (request, response, next) => {
  next();
};

exports.editProfilePostController = (request, response, next) => {
  next();
};

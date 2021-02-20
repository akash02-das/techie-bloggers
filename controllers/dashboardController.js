const { validationResult } = require("express-validator");
const Flash = require("../utils/Flash");
const User = require("../models/User");
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
      error: {},
    });
  } catch (error) {
    next(error);
  }
};

exports.createProfilePostController = async (req, res, next) => {
  let errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.render("pages/dashboard/create-profile", {
      title: "Create your profile",
      flashMessage: Flash.getMessage(req),
      error: errors.mapped(),
    });
  }

  let {
    name,
    title,
    bio,
    website,
    facebook,
    twitter,
    linkedIn,
    github,
  } = req.body;

  try {
    let profile = new Profile({
      user: req.user._id,
      name,
      title,
      bio,
      profilePics: req.user.profilePics,
      links: {
        website: website || "",
        facebook: facebook || "",
        twitter: twitter || "",
        linkedIn: linkedIn || "",
        github: github || "",
      },
      posts: [],
      bookmarks: [],
    });

    let createdProfile = await profile.save();

    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { profile: createdProfile._id } }
    );

    req.flash("success", "Profile created successfully");
    res.redirect("/dashboard");
  } catch (error) {
    next(error);
  }

  res.render("pages/dashboard/create-profile", {
    title: "Create your profile",
    flashMessage: Flash.getMessage(req),
    error: {},
  });
};

exports.editProfileGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.redirect("/dashboard/create-profile");
    }

    res.render("pages/dashboard/edit-profile", {
      title: "Edit your profile",
      error: {},
      flashMessage: Flash.getMessage(req),
      profile,
    });
  } catch (error) {
    next(error);
  }
};

exports.editProfilePostController = async (req, res, next) => {
  let {
    name,
    title,
    bio,
    website,
    facebook,
    twitter,
    linkedIn,
    github,
  } = req.body;

  let errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.render("pages/dashboard/edit-profile", {
      title: "Edit your profile",
      flashMessage: Flash.getMessage(req),
      error: errors.mapped(),
      profile: {
        name,
        title,
        bio,
        links: {
          website,
          facebook,
          twitter,
          linkedIn,
          github,
        },
      },
    });
  }

  try {
    let profile = {
      name,
      title,
      bio,
      links: {
        website: website || "",
        facebook: facebook || "",
        twitter: twitter || "",
        linkedIn: linkedIn || "",
        github: github || "",
      },
    };

    let updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profile },
      { new: true }
    );

    req.flash("success", "Profile updated successfully");
    res.render("pages/dashboard/edit-profile", {
      title: "Edit your profile",
      error: {},
      flashMessage: Flash.getMessage(req),
      profile: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

exports.bookmarksGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id }).populate({
      path: "bookmarks",
      model: "Post",
      select: "title thumbnail",
    });

    res.render("pages/dashboard/bookmarks", {
      title: "My bookmarks",
      flashMessage: Flash.getMessage(req),
      posts: profile.bookmarks,
    });
  } catch (error) {
    next(error);
  }
};

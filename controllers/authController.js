const User = require("../models/User");

exports.signupGetController = (request, response, next) => {
  response.render("pages/auth/signup", { title: "Create a new account" });
};

exports.signupPostController = async (request, response, next) => {
  let { username, email, password } = request.body;

  let user = new User({
    username,
    email,
    password,
  });

  try {
    let createdUser = await user.save();
    console.log("User created successfully", createdUser);
    response.render("pages/auth/signup", { title: "Create a new account" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.loginGetController = (request, response, next) => {};

exports.loginPostController = (request, response, next) => {};

exports.logoutController = (request, response, next) => {};

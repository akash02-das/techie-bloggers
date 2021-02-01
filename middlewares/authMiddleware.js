const User = require("../models/User");

exports.bindUserWithRequest = () => {
  return (request, response, next) => {
    if (!request.session.isLoggedIn) {
      return next();
    }

    try {
      let user = User.findById(request.session.user._id);
      request.user = user;
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
};
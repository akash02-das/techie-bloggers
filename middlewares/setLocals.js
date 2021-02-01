const { request, response } = require("express");

module.exports = () => {
  return (request, response, next) => {
    response.locals.user = request.user;
    response.locals.isLoggedIn = request.session.isLoggedIn;

    next();
  };
};

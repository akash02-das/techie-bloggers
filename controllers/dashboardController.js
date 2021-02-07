const Flash = require("../utils/Flash");

exports.dashboardGetController = (request, response, next) => {
  response.render("pages/dashboard/dashboard", {
    title: "My dashboard",
    flashMessage: Flash.getMessage(request),
  });
};

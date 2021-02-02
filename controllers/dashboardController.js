exports.dashboardGetController = (request, response, next) => {
  response.render("pages/dashboard/dashboard", { title: "My dashboard" });
};

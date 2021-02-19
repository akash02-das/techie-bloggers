const Flash = require("../utils/Flash");

exports.authorProfileGetController = async (req, res, next) => {
  res.render("pages/explorer/author", {
    title: "Author page",
    flashMessage: Flash.getMessage(req),
  });
};

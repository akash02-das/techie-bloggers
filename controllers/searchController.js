const Post = require("../models/Post");
const Flash = require("../utils/Flash");

exports.searchResultGetController = async (req, res, next) => {
  let term = req.query.term;
  let currentPage = req.query.page;
  let itemPerPage = 10;

  try {
    let posts = await Post.find({ $text: { $search: term } })
      .skip(itemPerPage * currentPage - itemPerPage)
      .limit(itemPerPage);

    let totalPost = await Post.countDocuments({
      $text: { $search: term },
    });

    let totalPage = totalPost / itemPerPage;

    res.render("pages/explorer/search", {
      title: `Results for - ${term}`,
      flashMessage: Flash.getMessage(req),
      searchTerm: term,
      currentPage,
      itemPerPage,
      totalPage,
    });
  } catch (error) {
    next(error);
  }
};

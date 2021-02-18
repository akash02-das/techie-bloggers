const moment = require("moment");
const Flash = require("../utils/Flash");
const Post = require("../models/Post");

const Profile = require("../models/Profile");

function genDate(days) {
  let date = moment().subtract(days, "days");
  return date.toDate();
}

function generateFilterObj(filter) {
  let filterObj = {};
  let order = 1;

  switch (filter) {
    case "week": {
      filterObj = {
        createdAt: {
          $gt: genDate(7),
        },
      };
      order = -1;
      break;
    }
    case "month": {
      filterObj = {
        createdAt: {
          $gt: genDate(30),
        },
      };
      order = -1;
      break;
    }
    case "all": {
      order = -1;
      break;
    }
  }
  return {
    filterObj,
    order,
  };
}

exports.explorerGetController = async (req, res, next) => {
  let filter = req.query.filter || "latest";
  let { filterObj, order } = generateFilterObj(filter.toLowerCase());

  let currentPage = parseInt(req.query.page) || 1;
  let itemPerPage = 10;

  try {
    let posts = await Post.find(filterObj)
      .populate("author", "username")
      .sort(order === 1 ? "-createdAt" : "createdAt")
      .skip(itemPerPage * currentPage - itemPerPage)
      .limit(itemPerPage);

    let totalPost = await Post.countDocuments();
    let totalPage = totalPost / itemPerPage;

    let bookmarks = [];
    if (req.user) {
      let profile = await Profile.findOne({ user: req.user._id });
      if (profile) {
        bookmarks = profile.bookmarks;
      }
    }

    res.render("pages/explorer/explorer", {
      title: "Explore all posts",
      flashMessage: Flash.getMessage(req),
      filter,
      posts,
      itemPerPage,
      currentPage,
      totalPage,
      bookmarks,
    });
  } catch (error) {
    next(error);
  }
};

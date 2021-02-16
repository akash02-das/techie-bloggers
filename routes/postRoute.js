const router = require("express").Router();
const { isAuthenticated } = require("../middleware/authMiddleware");
const postValidator = require("../validations/dashboard/post/postValidator");
const upload = require("../middleware/uploadMiddleware");

const {
  createPostGetController,
  createPostPostController,
  editPostGetController,
  editPostPostController,
} = require("../controllers/postController");

router.get("/create", isAuthenticated, createPostGetController);
router.post(
  "/create",
  isAuthenticated,
  upload.single("post-thumbnail"),
  postValidator,
  createPostPostController
);

router.get("/edit/:postId", isAuthenticated, editPostGetController);
router.post(
  "/edit/:postId",
  isAuthenticated,
  upload.single("post-thumbnail"),
  postValidator,
  editPostPostController
);

module.exports = router;

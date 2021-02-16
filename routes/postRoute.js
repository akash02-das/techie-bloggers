const router = require("express").Router();
const { isAuthenticated } = require("../middleware/authMiddleware");
const postValidator = require("../validations/dashboard/post/postValidator");
const upload = require("../middleware/uploadMiddleware");

const {
  createPostGetController,
  createPostPostController,
} = require("../controllers/postController");

router.get("/create", createPostGetController);

router.post(
  "/create",
  isAuthenticated,
  upload.single("post-thumbnail"),
  postValidator,
  createPostPostController
);

module.exports = router;

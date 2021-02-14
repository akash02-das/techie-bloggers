const router = require("express").Router();
const { isUnAuthenticated } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const {
  uploadProfilePics,
  removeProfilePics,
} = require("../controllers/uploadController");

router.post(
  "/profilePics",
  isUnAuthenticated,
  upload.single("profilePics"),
  uploadProfilePics
);

router.delete("/profilePics", isUnAuthenticated, removeProfilePics);

module.exports = router;

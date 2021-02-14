const User = require("../models/User");
const Profile = require("../models/Profile");

exports.uploadProfilePics = async (req, res, next) => {
  if (req.file) {
    try {
      let profile = await Profile.findOne({ user: req.user._id });
      let profilePics = `/uploads/${req.file.filename}`;

      if (profile) {
        await Profile.findOneAndUpdate(
          { user: req.user._id },
          { $set: { profilePics } }
        );
      }

      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { profilePics } }
      );

      res.status(200).json({ profilePics });
    } catch (error) {
      console.log(error);
      res.status(500).json({ profilePics: req.user.profilePics });
    }
  } else {
    res.status(500).json({ profilePics: req.user.profilePics });
  }
};

exports.removeProfilePics = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can not remove profile pics",
    });
  }
};

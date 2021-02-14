const User = require("../models/User");
const Profile = require("../models/Profile");

exports.uploadProfilePics = async (request, response, next) => {
  if (request.file) {
    try {
      let profile = await Profile.findOne({ user: request.user._id });
      let profilePics = `/uploads/${request.file.filename}`;

      if (profile) {
        await Profile.findOneAndUpdate(
          { user: request.user._id },
          { $set: { profilePics } }
        );
      }

      await User.findOneAndUpdate(
        { _id: request.user._id },
        { $set: { profilePics } }
      );

      response.status(200).json({ profilePics });
    } catch (e) {
      response.status(500).json({ profilePics: request.user.profilePics });
    }
  } else {
    response.status(500).json({ profilePics: request.user.profilePics });
  }
};

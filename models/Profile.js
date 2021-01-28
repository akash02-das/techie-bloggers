// user, title, bio, profilePic, links: {fb, tw}, posts, bookmarks

const { Schema, model } = require("mongoose");

const profileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    profilePic: String,
    links: {
      website: String,
      facebook: String,
      twitter: String,
      linkedIn: String,
      github: String,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Profile = model("Profile", profileSchema);

module.exports = Profile;

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true, maxLength: 30 },
  username: { type: String, required: true, maxLength: 30 },
  email: { type: String, required: true, unique: true, maxLength: 30 },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  googlePicture: { type: String, default: "" },
  coverPicture: { type: String, default: "" },
  bio: { type: String, maxLength: 200, default: "" },
  dateOfBirth: { type: String, default: "" },
  place: { type: String, default: "" },
  bookmark: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Posts" }],
    default: [],
  },
  followers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    default: [],
  },
  following: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    default: [],
  },
  joinedDate: { type: Date, default: Date.now },
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true, maxLength: 30 },
  username: { type: String, required: true, maxLength: 30 },
  email: { type: String, required: true, unique: true, maxLength: 30 },
  password: { type: String, required: true },
  profilePicture: { type: String },
  googlePicture: { type: String },
  coverPicture: { type: String },
  bio: { type: String, maxLength: 200 },
  dateOfBirth: { type: String },
  place: { type: String },
  joinedDate: { type: Date, default: Date.now },
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;

const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    coverPicture: { type: String },
    bio: { type: String },
    dateOfBirth: { type: String },
    place: { type: String },
  },
  { timeStamps: true },
);

const Users = mongoose.model("Users", userSchema);

module.exports = Users;

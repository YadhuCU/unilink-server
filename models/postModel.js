const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  postText: { type: String },
  postImage: { type: String },
  postLikes: { type: [{ type: mongoose.Schema.Types.ObjectId }] },
  postComments: { type: [String] },
  postUser: { type: mongoose.Schema.Types.ObjectId, required: true },
  postDate: { type: Date, default: Date.now },
});

const Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;

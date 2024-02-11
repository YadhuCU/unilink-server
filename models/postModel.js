const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  postText: { type: String },
  postImage: { type: String },
  postLikes: { type: [{ type: mongoose.Schema.Types.ObjectId }] },
  postComments: {
    type: [
      {
        commentText: { type: String },
        commentAuthor: { type: mongoose.Schema.Types.ObjectId, required: true },
        commentLikes: { type: [mongoose.Schema.Types.ObjectId] },
      },
    ],
  },
  postUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postDate: { type: Date, default: Date.now },
});

const Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;

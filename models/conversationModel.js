const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: { type: [{ type: mongoose.Schema.ObjectId }], ref: "Users" },
    lastMessage: {
      message: { type: String },
      sender: { type: mongoose.Schema.ObjectId, ref: "Users" },
    },
  },
  { timestamps: true },
);

const Conversations = mongoose.model("Conversations", conversationSchema);

module.exports = Conversations;

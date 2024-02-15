const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.ObjectId, rel: "Conversations" },
    message: { type: String },
    sender: { type: mongoose.Schema.ObjectId, rel: "Users" },
  },
  { timestamps: true },
);

const Messages = mongoose.model("Messages", messageSchema);

module.exports = Messages;

const Messages = require("../models/messageModel");
const Conversations = require("../models/conversationModel");

// send message.
exports.addMessage = async (req, res) => {
  const { userId } = req.payload;
  const { receiverId, message } = req.body;

  try {
    let conversation = await Conversations.findOne({
      members: { $all: [userId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversations({
        members: [userId, receiverId],
        lastMessage: {
          sender: userId,
          message: message,
        },
      });

      await conversation.save();
    }

    const newMessage = new Messages({
      conversationId: conversation._id,
      message: message,
      sender: userId,
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          sender: userId,
          message: message,
        },
      }),
    ]);

    res.status(201).json(newMessage);
  } catch (err) {
    console.log("Error", err);
    res.status(500).json(err);
  }
};

// get all conversations.
exports.getAllConversations = async (req, res) => {
  const { userId } = req.payload;

  try {
    const allConversations = await Conversations.find({
      members: userId,
    }).populate({
      path: "members",
      select: "username name googlePicture profilePicture",
    });

    // need to fix the send the same user.
    allConversations.forEach((conversation) => {
      if (conversation.members[0]._id.toString() === userId) {
        conversation.members = [{ ...conversation.members[1] }];
      } else {
        conversation.members = [{ ...conversation.members[0] }];
      }
    });

    res.status(200).json(allConversations);
  } catch (err) {
    console.log("Error", err);
    res.status(500).json(err);
  }
};

// get user messages.
exports.getUserMessage = async (req, res) => {
  const { userId } = req.payload;
  const { otherUserId } = req.params;

  try {
    const conversation = await Conversations.findOne({
      members: { $all: [userId, otherUserId] },
    });

    const allMessages = await Messages.find({
      conversationId: conversation?._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(allMessages);
  } catch (err) {
    console.log("Error", err);
    res.status(500).json(err);
  }
};

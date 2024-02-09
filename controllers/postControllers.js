const Posts = require("../models/postModel");

exports.createPost = async (req, res) => {
  const { userId } = req.payload;
  const { postBody } = req.body;
  const postImage = req.file?.filename;

  try {
    const newPost = new Posts({
      postBody,
      postImage,
      postUser: userId,
    });

    newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

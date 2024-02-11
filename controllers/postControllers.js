const Posts = require("../models/postModel");

// create post.
exports.createPost = async (req, res) => {
  const { userId } = req.payload;
  const { postText } = req.body;
  const postImage = req.file?.filename;

  try {
    const newPost = new Posts({
      postText,
      postImage,
      postUser: userId,
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};

// get all post.
exports.getAllPosts = async (req, res) => {
  try {
    const allPosts = await Posts.find();
    res.status(200).json(allPosts.reverse());
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};

// get post
exports.getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const allPosts = await Posts.findOne({ _id: id });
    res.status(200).json(allPosts);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};

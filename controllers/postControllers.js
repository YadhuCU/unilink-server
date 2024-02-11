const Posts = require("../models/postModel");
const Users = require("../models/userModel");

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
    // const allPosts = await Posts.find();
    const allPosts = await Posts.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "postUser",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          postText: 1,
          postImage: 1,
          postLikes: 1,
          postComments: 1,
          postDate: 1,
          user: {
            _id: "$user._id",
            username: "$user.username",
            name: "$user.name",
            profilePicture: "$user.profilePicture",
            googlePicture: "$user.googlePicture",
          },
        },
      },
    ]);

    console.log("Users Posts", allPosts);

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

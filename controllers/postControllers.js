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
    // const allPosts = await Posts.findOne({ _id: id });

    const [post] = await Posts.aggregate([
      { $match: { $expr: { $eq: ["$_id", { $toObjectId: id }] } } },
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

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};

// add comment to post.
exports.addCommentToPost = async (req, res) => {
  const { userId } = req.payload;
  const { postId } = req.params;
  const { commentText } = req.body;

  try {
    const post = await Posts.findOne({ _id: postId });

    const user = await Users.findOne({ _id: userId });

    console.log("user", user);

    const comment = {
      commentText,
      commentAuthor: userId,
      commentAuthorName: user?.name,
      commentAuthorUsername: user?.username,
      commentAuthorProfilePicture: user?.profilePicture,
      commentAuthorGooglePicture: user?.googlePicture,
    };

    console.log("comment", comment);

    post.postComments.push(comment);

    await post.save();

    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};

// like and unlike the post
exports.likeOrUnlikePost = async (req, res) => {
  const { userId } = req.payload;
  const { postId } = req.params;

  console.log("userId", userId);
  console.log("postId", postId);

  try {
    const post = await Posts.findOne({ _id: postId });
    console.log("post", post);
    if (post.postLikes.includes(userId)) {
      // remove the id from the array.
      const newPostLikeArray = post.postLikes.filter(
        (item) => String(item) !== userId,
      );
      post.postLikes = newPostLikeArray;
    } else {
      // add the id to array.
      post.postLikes.push(userId);
    }

    await post.save();

    console.log("post", post);
    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};

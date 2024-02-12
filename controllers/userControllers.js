const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");
const JWT_SECRETE_KEY = process.env.JWT_SECRETE_KEY;
const { dateFormatter } = require("../utils/dateFormatter");
const { default: mongoose } = require("mongoose");
const Posts = require("../models/postModel");

// register
exports.register = async (req, res) => {
  const { name, username, email, password, googlePicture } = req.body;

  const existingUser = await Users.findOne({ email });

  try {
    if (existingUser) {
      res.status(406).json("User already exist please login.");
    } else {
      const newUser = new Users({
        name,
        username,
        email,
        password,
        googlePicture,
      });

      await newUser.save();

      res.status(201).json(newUser);
    }
  } catch (error) {
    console.log("register", error);

    res.status(500).json(error);
  }
};

// login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email });

  try {
    if (user) {
      if (user.password === password) {
        user.password = undefined;

        const token = jwt.sign({ userId: user._id }, JWT_SECRETE_KEY);

        const newUser = {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          password: user.password,
          profilePicture: user.profilePicture,
          googlePicture: user.googlePicture,
          coverPicture: user.coverPicture,
          bio: user.bio,
          dateOfBirth: user.dateOfBirth,
          place: user.place,
          bookmark: user.bookmark,
          followers: user.followers,
          following: user.following,
          joinedDate: dateFormatter(user.joinedDate),
        };

        res.status(201).json({ user: newUser, token });
      } else {
        res.status(401).json("Invalid Credentials.");
      }
    } else {
      res.status(404).json("User not found. please Register.");
    }
  } catch (error) {
    console.log("login", error);

    res.status(500).json(error);
  }
};

// get user
exports.getUser = async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await Users.findOne({ _id: uid });
    res
      .status(200)
      .json({ ...user, joinedDate: dateFormatter(user.joinedDate) });
  } catch (error) {
    console.log("getUser", error);
    res.status(500).json(error);
  }
};

// get all user
exports.getAllUser = async (req, res) => {
  const { search } = req.query;
  const { userId } = req.payload;
  const query = {
    name: { $regex: search, $options: "i" },
  };
  try {
    const allUsers = await Users.find(query);

    // excluding currentUser
    const users = allUsers.filter((item) => item._id != userId);

    res.status(200).json(users);
  } catch (error) {
    console.log("getAllUser", error);
    res.status(500).json(error);
  }
};

// get random user
exports.getRandomUser = async (req, res) => {
  const { userId } = req.payload;

  try {
    const users = await Users.find().limit(4);

    // excluding current User
    const randomUsers = users.filter((item) => item._id != userId);

    res.status(200).json(randomUsers);
  } catch (error) {
    console.log("getRandomUser", error);
    res.status(500).json(error);
  }
};

// add post to bookmark.
exports.toggleBookmark = async (req, res) => {
  const { userId } = req.payload;
  const { postId } = req.body;

  try {
    const user = await Users.findOne({ _id: userId });

    if (user) {
      const isBookmarked = user.bookmark.includes(postId);

      if (isBookmarked) {
        user.bookmark = user.bookmark.filter((item) => String(item) !== postId);
      } else {
        user.bookmark.push(postId);
      }

      user.markModified("bookmark");
      await user.save();

      res.status(200).json(user);
    } else {
      res.status(404).json("Unauthorized Entry.");
    }
  } catch (error) {
    console.log("toggleBookmark", error);
    res.status(500).json(error);
  }
};

// follow and unfollow.
exports.followUnfollowUser = async (req, res) => {
  const { userId } = req.payload;
  const { followed_uid } = req.params;
  console.log("userId", userId);
  console.log("followed_uid", followed_uid);

  // cUser - following++ > fUser - folllower++
  try {
    const currentUser = await Users.findOne({ _id: userId });
    const followedUser = await Users.findOne({ _id: followed_uid });
    console.log("currentUser", currentUser);
    console.log("followedUser", followedUser);

    const isFollowing = currentUser.following.includes(followed_uid);
    console.log("isFollowing", isFollowing);

    if (!currentUser || !followedUser)
      return res.status(404).json({ message: "User not found." });

    if (isFollowing) {
      // unfollow.
      // - remove fid from [following] of currentUser.
      // - remove cid from [followers] of followedUser.

      await Users.updateOne(
        { _id: userId },
        { $pull: { following: followed_uid } },
      );
      await Users.updateOne(
        { _id: followed_uid },
        { $pull: { followers: userId } },
      );
      res.status(200).json({ message: "Unfollowed" });
    } else {
      // follow
      // - add fid from [following] of currentUser.
      // - add cid from [followers] of followedUser.
      currentUser.following.push(followed_uid);
      followedUser.followers.push(userId);

      await currentUser.save();
      await followedUser.save();
      res.status(200).json({ message: "Following" });
    }
  } catch (error) {
    console.log("followUnfollowUser", error);
    res.status(500).json(error);
  }
};

// update profile.
exports.updateProfile = async (req, res) => {
  const { profilePicture, coverPicture } = req.files || {
    profilePicture: "",
    coverPicture: "",
  };
  const { id } = req.params;

  const {
    name,
    username,
    email,
    password,
    googlePicture,
    dateOfBirth,
    place,
    bookmark,
    followers,
    following,
    joinedDate,
  } = req.body;

  const pPicture = profilePicture
    ? profilePicture[0].filename
    : req.body.profilePicture;
  const cPicture = coverPicture
    ? coverPicture[0].filename
    : req.body.coverPicture;

  try {
    const updatedUser = await Users.findByIdAndUpdate(
      { _id: id },
      {
        name,
        username,
        email,
        password,
        profilePicture: pPicture,
        googlePicture,
        coverPicture: cPicture,
        dateOfBirth,
        place,
        bookmark,
        followers,
        following,
        joinedDate,
      },
      { new: true },
    );
    await updatedUser.save();
    res.status(200).json({
      ...updatedUser._doc,
      joinedDate: dateFormatter(updatedUser.joinedDate),
    });
  } catch (error) {
    console.log("udpateProfile", error);
    res.status(500).json(error);
  }
};

// get bookmarked posts.
exports.getBookmarkedPosts = async (req, res) => {
  const { id } = req.params;
  const mongooseId = new mongoose.Types.ObjectId(id);

  try {
    const bookmarkedPosts = await Users.aggregate([
      { $match: { $expr: { $eq: ["$_id", { $toObjectId: id }] } } },
      {
        $lookup: {
          from: "posts",
          localField: "bookmark",
          foreignField: "_id",
          as: "bookmarkedPosts",
        },
      },
      { $unwind: "$bookmarkedPosts" },
      {
        $lookup: {
          from: "users",
          localField: "bookmarkedPosts.postUser",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: "$bookmarkedPosts._id",
          postText: "$bookmarkedPosts.postText",
          postImage: "$bookmarkedPosts.postImage",
          postLikes: "$bookmarkedPosts.postLikes",
          postComments: "$bookmarkedPosts.postComments",
          postDate: "$bookmarkedPosts.postDate",
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

    res.status(200).json(bookmarkedPosts);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json(error);
  }
};

// get following users posts.
exports.getFollowingUsersPosts = async (req, res) => {
  const { userId } = req.payload;
  console.log("userId", userId);

  try {
    const id = new mongoose.Types.ObjectId(userId);
    // console.log("id", id)

    const user = await Users.findById(userId);
    console.log("user", user);
    const followingArray = user.following;
    console.log("followingArray", followingArray);

    // const posts = await Posts.find({
    //   $or: [{ postUser: userId }, { postUser: { $in: followingArray } }],
    // });
    const posts = await Posts.aggregate([
      {
        $match: {
          $or: [{ postUser: id }, { postUser: { $in: followingArray } }],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "postUser",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
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

    console.log("posts", posts);

    res.status(200).json(posts);
  } catch (error) {
    console.log("error getFollowingUsersPosts", error);
    res.status(500).json(error);
  }
};

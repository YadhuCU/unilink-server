const express = require("express");
const userController = require("../controllers/userControllers");
const postController = require("../controllers/postControllers");
const { jwtVerification } = require("../middlewares/jwtVerification");
const {
  multerPostMiddleware,
} = require("../middlewares/multerPostMiddleware.js");
const {
  multerUserMiddleware,
} = require("../middlewares/multerUserMiddleware.js");
const Users = require("../models/userModel.js");

const router = express.Router();

// USERS
// register user
router.post("/register", userController.register);
// loginn user.
router.post("/login", userController.login);
// get user
router.get("/user/:uid", jwtVerification, userController.getUser);
// add or remove bookmark.
router.patch(
  "/user/bookmark/toggle",
  jwtVerification,
  userController.toggleBookmark,
);
// get random users
router.get("/users/random", jwtVerification, userController.getRandomUser);
// get all users
router.get("/users/all", jwtVerification, userController.getAllUser);
// followUnfollow User.
router.put(
  "/users/follow-unfollow/:followed_uid",
  jwtVerification,
  userController.followUnfollowUser,
);
// update the profile.
router.put(
  "/users/profile/update/:id",
  jwtVerification,
  multerUserMiddleware.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ]),
  userController.updateProfile,
);
router.get(
  "/users/bookmark/:id",
  jwtVerification,
  userController.getBookmarkedPosts,
);
router.get(
  "/posts/following/post",
  jwtVerification,
  userController.getFollowingUsersPosts,
);
router.get("/posts/user/:userId", userController.getUserPosts);

//POSTS
// add post.
router.post(
  "/post/create",
  jwtVerification,
  multerPostMiddleware.single("postImage"),
  postController.createPost,
);
// get all posts.
router.get("/posts/all", jwtVerification, postController.getAllPosts);
// get Single post
router.get("/posts/:id", jwtVerification, postController.getPost);
// add comment to post
router.post(
  "/posts/comment/:postId",
  jwtVerification,
  postController.addCommentToPost,
);

exports.router = router;

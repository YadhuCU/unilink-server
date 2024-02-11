const express = require("express");
const userController = require("../controllers/userControllers");
const postController = require("../controllers/postControllers");
const { jwtVerification } = require("../middlewares/jwtVerification");
const {
  multerPostMiddleware,
} = require("../middlewares/multerPostMiddleware.js");

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
router.get("/posts/:id", jwtVerification, postController.getPost);

exports.router = router;

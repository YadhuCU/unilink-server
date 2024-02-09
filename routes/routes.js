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
router.get("/users/:uid", jwtVerification, userController.getUser);

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

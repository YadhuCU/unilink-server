const express = require("express");
const userController = require("../controllers/userControllers");
const postController = require("../controllers/postControllers");
const { jwtVerification } = require("../middlewares/jwtVerification");
const {
  multerPostMiddleware,
} = require("../middlewares/multerPostMiddleware.js");

const router = express.Router();

// register user
router.post("/register", userController.register);
// loginn user.
router.post("/login", userController.login);
// add post.
router.post(
  "/post/create",
  jwtVerification,
  multerPostMiddleware.single("postImage"),
  postController.createPost,
);

exports.router = router;

const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");
const JWT_SECRETE_KEY = process.env.JWT_SECRETE_KEY;

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

        res.status(201).json({ user, token });
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

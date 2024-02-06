const Users = require("../models/userModel");

// register
exports.register = (req, res) => {
  const body = req.body;

  console.log(body);

  res.status(201).json("Register Working...");
};

// login
exports.login = (req, res) => {
  res.status(200).json("Login working...");
};

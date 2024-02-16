require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT;
const { router } = require("./routes/routes");
const cors = require("cors");
require("./db/connection");
const { server, app } = require("./socket/socket");

app.use(cors());
app.use(express.json());
app.use((req, _, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
app.use(router);
app.use("/post-image", express.static("./uploads/post"));
app.use("/user-image", express.static("./uploads/user"));

app.get("/", (_, res) => {
  res.status(200).json("Working...");
});

server.listen(PORT, () => {
  console.log("Server is running at ", PORT);
});

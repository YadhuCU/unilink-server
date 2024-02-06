require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT;
const { router } = require("./routes/routes");
require("./db/connection");

const app = express();

app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
  res.status(200).json("Working...");
});

app.listen(PORT, () => {
  console.log("Server is running at ", PORT);
});

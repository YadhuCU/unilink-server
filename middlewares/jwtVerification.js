const jwt = require("jsonwebtoken");
const JWT_SECRETE_KEY = process.env.JWT_SECRETE_KEY;

exports.jwtVerification = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (token) {
    try {
      const { userId } = jwt.verify(token, JWT_SECRETE_KEY);
      req.payload = { userId };
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json("Unauthorized Entry.");
    }
  } else {
    res.status(401).json("Invalid token format.");
  }
};

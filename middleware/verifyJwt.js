const jwt = require("jsonwebtoken");
const config = require("../utils/auth.config");

verifyJwtToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Session expired or unauthorized. Please log in again!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyJwtToken;

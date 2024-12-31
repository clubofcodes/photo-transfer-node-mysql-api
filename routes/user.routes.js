const { verifySignUp } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  let router = require("express").Router();

  // Create a new user
  router.post("/auth/signup", [verifySignUp], controller.signup);

  // authenticate a user
  router.post("/auth/signin", controller.signin);

  app.use("/api", router);
};

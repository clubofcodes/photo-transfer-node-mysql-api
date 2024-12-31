const { verifyJwt, uploadFile } = require("../middleware");
const controller = require("../controllers/image.controller");

module.exports = (app) => {
  let router = require("express").Router();

  // upload a new image file
  router.post(
    "/upload",
    [verifyJwt, uploadFile.single("file")],
    controller.uploadImage
  );

  // authorized a user to get all images list
  router.get("/getImages", [verifyJwt], controller.getImageList);

  // download by public url from the "getImages" list
  router.get("/images/:name", controller.downloadImgByUrl);

  app.use("/api", router);
};

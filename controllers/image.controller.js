const fs = require("fs");
const db = require("../models");
const Image = db.images;
const server = require("../server");
const io = server.socketObj;

const uploadImage = async (req, res) => {
  try {
    if (req?.file == undefined) {
      return res.status(404).send({ message: `You must select a file.` });
    }

    Image.create({
      file_type: req.file.mimetype,
      file_name: req.file.originalname,
      file_data: fs.readFileSync(
        __basedir + "/assets/uploads/" + req.file.filename
      ),
    }).then((image) => {
      io.sockets.emit("image_uploaded", image?.dataValues ?? {});
      return res
        .status(201)
        .send({ message: `${image.file_name} has been uploaded.` });
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: `Error when trying upload images: ${error}` });
  }
};

const getImageList = (req, res) => {
  const directoryPath = __basedir + "/assets/uploads/";
  const baseUrl = `${
    process.env.BASE_URL || "http://localhost:8080/"
  }api/images/`;

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const downloadImgByUrl = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/assets/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

module.exports = {
  uploadImage,
  getImageList,
  downloadImgByUrl,
};

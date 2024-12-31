const multer = require("multer");
const maxSize = 2 * 1024 * 1024; // bytes: file size validation => 2mb.

const onlyImgValidation = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

var fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/assets/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `photo-transfer-${Date.now()}-${file.originalname}`);
  },
});

var uploadFile = multer({
  storage: fileStorage,
  fileFilter: onlyImgValidation,
  // limits: { fileSize: maxSize }, // file size limit validation, if required
});
module.exports = uploadFile;

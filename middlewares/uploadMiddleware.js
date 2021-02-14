const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "../public/uploads/",
  filename: (request, file, callback) => {
    callback(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (request, file, callback) => {
    const types = /jpeg|jpg|png|gif/;
    const extname = types.test(path.extname(file.originalname).toLowerCase());
    const mimetype = types.test(file.mimetype);

    if (extname && mimetype) {
      callback(null, true);
    } else {
      callback(new Error("Only support images file"));
    }
  },
});

module.exports = upload;

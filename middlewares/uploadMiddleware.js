const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "public/uploads");
  },
  filename: (request, file, callback) => {
    callback(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (request, file, callback) => {
    const types = /jpeg|jpg|png|gif/;
    const extName = types.test(path.extname(file.originalname).toLowerCase());
    const mimeType = types.test(file.mimetype);

    if (extName && mimeType) {
      callback(null, true);
    } else {
      callback(new Error("Only support images file"));
    }
  },
});

module.exports = upload;

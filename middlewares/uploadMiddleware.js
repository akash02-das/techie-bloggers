const { request } = require("express");
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

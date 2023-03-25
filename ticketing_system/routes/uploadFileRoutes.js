const express = require("express");
const router = express.Router();
const path = require("path");
const fileUpload = require("express-fileupload");
const filesPayloadExists = require("../middleware/filesPayloadExists");
const fileExtLimiter = require("../middleware/fileExtLimiter");
const fileSizeLimiter = require("../middleware/fileSizeLimiter");
const filesController = require("../controllers/filesController");

router.post(
  "/:id",
  fileUpload({
    createParentPath: true,
  }),
  filesPayloadExists,
  fileExtLimiter([".png", ".jpg", ".jpeg"]),
  fileSizeLimiter,
  filesController.uploadFiles
);

module.exports = router;

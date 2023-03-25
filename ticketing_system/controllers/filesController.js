const path = require("path");

const uploadFiles = (req, res) => {
  const folder = `../ticketfiles/${req.params.id.toString()}`;
  const files = req.files;
  console.log(folder);

  Object.keys(files).forEach((key) => {
    const filepath = path.join(__dirname, folder, files[key].name);
    files[key].mv(filepath, (err) => {
      if (err) return res.status(500).json({ status: "error", message: err });
    });
  });

  return res.json({
    status: "success",
    message: Object.keys(files).toString(),
  });
};

module.exports = { uploadFiles };

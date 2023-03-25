const mongoose = require("mongoose");

const departmentSchema = mongoose.Schema({
  departmentName: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
});

module.exports = mongoose.model("Department", departmentSchema);

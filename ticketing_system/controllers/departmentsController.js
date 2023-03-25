const Department = require("../models/Department");
const asyncHandler = require("express-async-handler");

const getAllDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find().lean();
  if (!departments?.length) {
    return res.status(400).json({ message: "No departments found" });
  }

  res.json(departments);
});

const createNewDepartment = asyncHandler(async (req, res) => {
  const { departmentName } = req.body;
  if (!departmentName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await Department.findOne({ departmentName }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate department name" });
  }

  const department = await Department.create({ departmentName });
  if (department) {
    return res.status(201).json({ message: "New Department created" });
  } else {
    return res.status(400).json({ message: "Invalid note data received" });
  }
});

const updateDepartment = asyncHandler(async (req, res) => {
  const { id, departmentName } = req.body;
  if (!id || !departmentName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const department = await Department.findById(id).exec();
  if (!department) {
    return res.status(400).json({ message: "Department not found" });
  }

  const duplicate = await Department.findOne({ departmentName }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate department name" });
  }

  department.departmentName = departmentName;
  const updatedDepartment = await department.save();

  res.json({ message: `${department.departmentName} updated` });
});

const deleteDepartment = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const department = await Department.findById(id).exec();
  if (!department) {
    return res.status(400).json({ message: "Department not found" });
  }

  const result = await department.deleteOne();
  const reply = `Username ${result.departmentName} with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllDepartments,
  createNewDepartment,
  updateDepartment,
  deleteDepartment,
};

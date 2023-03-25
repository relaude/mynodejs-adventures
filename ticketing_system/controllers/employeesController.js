const Employee = require("../models/Employee");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find().lean();

  if (!employees?.length) {
    return res.status(400).json({ message: "No employees found" });
  }

  res.json(employees);
});

const getEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const employee = await Employee.findById(id).lean().exec();
  if (!employee) {
    return res.status(400).json({ message: "Employee not found" });
  }

  res.json(employee);
});

const createEmployee = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, roles } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !Array.isArray(roles) ||
    !roles.length
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await Employee.findOne({ email }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate email" });
  }

  const hashedPwd = await bcrypt.hash(password, 10);
  const employeeObject = {
    firstName,
    lastName,
    email,
    password: hashedPwd,
    roles,
    active: true,
  };
  const employee = await Employee.create(employeeObject);

  if (employee) {
    res.status(201).json({
      message: `New employee ${employee.lastName}, ${employee.firstName} created`,
    });
  } else {
    res.status(400).json({ message: "Invalid employee data received" });
  }
});

const updateEmployee = asyncHandler(async (req, res) => {
  const { id, firstName, lastName, email, password, roles, active } = req.body;
  if (
    !id ||
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const employee = await Employee.findById(id).exec();
  if (!employee) {
    return res.status(400).json({ message: "Employee not found" });
  }

  const duplicate = await Employee.findOne({ email }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate email" });
  }

  employee.firstName = firstName;
  employee.lastName = lastName;
  employee.email = email;
  employee.roles = roles;
  employee.active = active;

  if (password) {
    employee.password = await bcrypt.hash(password, 10);
  }

  const updateEmployee = await employee.save();

  res.json({ message: `${employee.lastName}, ${employee.firstName} updated` });
});

const deleteEmployee = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Employee ID Required" });
  }

  const employee = await Employee.findById(id).exec();
  if (!employee) {
    return res.status(400).json({ message: "Employee not found" });
  }

  const result = await employee.deleteOne();
  const reply = `Employee ${employee.lastName}, ${employee.firstName} with ID ${employee._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};

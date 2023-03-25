const TicketMessage = require("../models/TicketMessage");
const asyncHandler = require("express-async-handler");

const getAllMessages = asyncHandler(async (req, res) => {
  const messages = await TicketMessage.find().lean();
  if (!messages?.length) {
    return res.status(400).json({ message: "No messages found" });
  }

  res.json(messages);
});

const getMessage = asyncHandler(async (req, res) => {
  const message = await TicketMessage.findById(req.params.id).lean();
  if (!message) {
    return res.status(400).json({ message: "Message not found" });
  }
  res.json(message);
});

const createMessage = asyncHandler(async (req, res) => {
  const { message, attachment } = req.body;
  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  const ticketMessage = await TicketMessage.create({
    message,
    attachment,
  });
  if (ticketMessage) {
    return res.status(201).json({ message: "New ticket message created" });
  } else {
    return res
      .status(400)
      .json({ message: "Invalid ticket message data received" });
  }
});

module.exports = { getAllMessages, getMessage, createMessage };

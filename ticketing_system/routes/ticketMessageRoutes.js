const express = require("express");
const router = express.Router();
const ticketMessagesController = require("../controllers/ticketMessagesController");

router
  .get("/", ticketMessagesController.getAllMessages)
  .post("/", ticketMessagesController.createMessage);

router.get("/:id", ticketMessagesController.getMessage);

module.exports = router;

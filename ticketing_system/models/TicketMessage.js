const mongoose = require("mongoose");

const ticketMessageSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    attachment: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TicketMessage", ticketMessageSchema);

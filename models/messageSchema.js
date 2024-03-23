const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  user: String,
  message: String,
  createdDate: {
    type: Date,
    default: () => {
      const now = new Date();
      return new Date(now.getTime() + 3 * 60 * 60 * 1000);
    },
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const messageSchema = new Schema({
  content: String,
  roomId: String,
  username: String,
  createdDate: {
    type: Date,
    default: () => {
      const now = new Date();
      return new Date(now.getTime() + (3 * 60 * 60 * 1000));
    }
  }
});

module.exports = mongoose.model("message", messageSchema);

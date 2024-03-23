const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdDate: {
    type: Date,
    default: () => {
      const now = new Date();
      return new Date(now.getTime() + 3 * 60 * 60 * 1000);
    },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

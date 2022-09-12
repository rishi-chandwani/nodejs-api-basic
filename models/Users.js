const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 8
  },
  firstname: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  mobile: {
    type: String,
    required: false
  }
}, { timestamps: true });

const instanceModel = mongoose.model("users", userSchema);

module.exports = instanceModel;
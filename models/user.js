/* eslint-disable */

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: { type: String, required: true },
  otp : {type:String} ,
  otpExpires : {type:Date}
});

module.exports = mongoose.model("User", userSchema);

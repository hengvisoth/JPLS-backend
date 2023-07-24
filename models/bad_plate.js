/* eslint-disable */

const mongoose = require("mongoose");

const bad_plateSchema = new mongoose.Schema({
  fullname: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  role: {
    type: String,
  },
  vehicle_type: {
    type: String,
  },
  gender: {
    type: String,
  },
  age: {
    type: Number,
  },
  plate_number: {
    type: String,
    required: true,
  },
  place_name: {
    type: String,
    required: true,
  },
  kana_text: {
    type: String,
    required: true,
  },
  classification_number: {
    type: String,
    required: true,
  },
  // organization_name: {
  //   type: String,
  // },
  // organization_name_khmer: {
  //   type: String,
  // },
  badStatus: {
    type: String,
    // required: true,
  },
});

module.exports = mongoose.model("BadPlate", bad_plateSchema);

/* eslint-disable */

const mongoose = require("mongoose");

const plate_logSchema = new mongoose.Schema({
  organization_name_khmer: {
    type: String,
  },
  plate_number: {
    type: String,
    unique: false,
  },
  organization_name: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    require: true,
  },
  reason: {
    type: String,
  },
  num_people: {
    type: Number
  },
  origin: {
    type: String,
  },
  temperature: {
    type: Number,
  },
  phone_number: {
    type: Number
  },
  nationality: {
    type: String
  },
  vehicle_type: {
    type: String
  },
  approved_by: {
    type: String
  } , 

  // Make Changes for JP
  classification_number: {
    type: String,
  },
  kana_text: {
    type: String,
  },
  place_name: {
    type: String,
  },
});

module.exports = mongoose.model("PlateLog", plate_logSchema);

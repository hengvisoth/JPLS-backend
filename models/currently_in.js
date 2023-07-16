const mongoose = require("mongoose");

const currentlyIn = new mongoose.Schema({
  plate_number: {
    type: String,
    unique: true,
  },
  organization_name: {
    type: String,
  },
  organization_name_khmer: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    required: true,
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
  }, 

  // Make changes for JP
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

module.exports = mongoose.model("CurrentlyIn", currentlyIn);

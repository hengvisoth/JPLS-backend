const mongoose = require("mongoose");

const known_plateSchema = new mongoose.Schema({
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
    unique: true,
  },
  organization_name: {
    type: String,
    required: true,
  },
  organization_name_khmer: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("KnownPlate", known_plateSchema);

/* eslint-disable */

const mongoose = require("mongoose");
const CommitLogSchema = new mongoose.Schema({
  plate_number: {
    type: String,
  },
  classification_number: {
    type: String,
  },
  kana_text: {
    type: String,
  },
  place_name: {
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
  status: {
    type: String,
  },
  vehicle_type: {
    type: String
  }
});

module.exports = mongoose.model("CommitLog", CommitLogSchema);

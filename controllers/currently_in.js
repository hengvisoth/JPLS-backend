/* eslint-disable */

const CurrentlyIn = require("../models/currently_in");
const PlateLog = require("../models/plate_log");
const { query_plates } = require("../utils/pagination");

const currently_in_get = async (req, res) => {
  try {
    const results = await query_plates(req.query, CurrentlyIn);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const currently_in_approve = async (req, res) => {
  try {
    const {
      plate_number,
      place_name, 
      kana_text , 
      classification_number,

      // organization_name,
      // organization_name_khmer,
      plate,
      change,
      temperature,
      reason,
      num_people,
      phone_number,
      origin,
      nationality,
      vehicle_type,
      approved_by,
    } = req.body;
    let updatedPlates = [];
    // selected plate to be changed
    let plate_currently_in = await CurrentlyIn.findOne({
      _id: plate._id,
    });
    if (plate_currently_in == null) {
      return res
        .status(404)
        .json({ message: "Cannot find plate in CurrentlyIn" });
    } else {
      let remove_plate_currently_in = false;
      if (change == true) {
        plate_currently_in.plate_number = plate_number;
        plate_currently_in.place_name = place_name;
        plate_currently_in.kana_text = kana_text;
        plate_currently_in.classification_number = classification_number;
        // plate_currently_in.organization_name = organization_name;
        // plate_currently_in.organization_name_khmer = organization_name_khmer;
        plate_currently_in.num_people = num_people;
        plate_currently_in.phone_number = phone_number;
        plate_currently_in.reason = reason;
        plate_currently_in.temperature = temperature;
        plate_currently_in.origin = origin;
        plate_currently_in.nationality = nationality;
        plate_currently_in.vehicle_type = vehicle_type;
        plate_currently_in.approved_by = approved_by;
        let correct_plate_currently_in = await CurrentlyIn.findOne({
          plate_number: plate_number,
        });
        if (correct_plate_currently_in != null) {
          // if plate about to be corrected already existed long ago in currently_in, delete it
          if (
            correct_plate_currently_in.time.getTime() <
            plate_currently_in.time.getTime()
          ) {
            await correct_plate_currently_in.remove();
          } else if (
            correct_plate_currently_in.time.getTime() >
            plate_currently_in.time.getTime()
          ) {
            // if plate already exists in currently_in and time of plate is ahead of current one
            // remove because plate already exists in currently_in
            remove_plate_currently_in = true;
          }
        }
      }
      if (remove_plate_currently_in) {
        await plate_currently_in.remove();
        updatedPlates.push(
          "Remove plate from Currently_in DB because plate already exists"
        );
      } else {
        plate_currently_in.approved = true;
        updatedPlates.push(await plate_currently_in.save());
      }
    }
    // find the same plate in platelog
    let plate_plate_log = await PlateLog.findOne({
      plate_number: plate.plate_number,
      time: plate.time,
    });
    if (plate_plate_log != null) {
      if (change == true) {
        plate_plate_log.plate_number = plate_number;
        plate_plate_log.place_name = place_name;
        plate_plate_log.kana_text = kana_text;
        plate_plate_log.classification_number = classification_number;
        // plate_plate_log.organization_name = organization_name;
        // plate_plate_log.organization_name_khmer = organization_name_khmer;
        plate_plate_log.reason = reason;
        plate_plate_log.num_people = num_people;
        plate_plate_log.phone_number = phone_number;
        plate_plate_log.temperature = temperature;
        plate_plate_log.origin = origin;
        plate_plate_log.nationality = nationality;
        plate_plate_log.vehicle_type = vehicle_type;
        plate_plate_log.approved_by = approved_by;
      }
      plate_plate_log.approved = true;
      updatedPlates.push(await plate_plate_log.save());
    }
    res.json(updatedPlates);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const currently_in_delete = async (req, res) => {
  try {
    let updatedPlates = [];
    let plate_currently_in = await CurrentlyIn.findOne({
      _id: req.body.plate._id,
    });
    if (plate_currently_in == null) {
      return res
        .status(404)
        .json({ message: "Cannot find plate in CurrentlyIn" });
    } else {
      await plate_currently_in.remove();
      updatedPlates.push("Plate deleted from Currently In Database");
    }
    let plate_plate_log = await PlateLog.findOne({
      plate_number: req.body.plate.plate_number,
      time: req.body.plate.time,
    });
    if (plate_plate_log != null) {
      await plate_plate_log.remove();
      updatedPlates.push("Plate deleted from Plate Logs Database");
    }
    res.json(updatedPlates);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  currently_in_get,
  currently_in_approve,
  currently_in_delete,
};

/* eslint-disable */

const PlateLog = require("../models/plate_log");
const KnownPlate = require("../models/known_plate");
const BadPlate = require("../models/bad_plate");
const CurrentlyIn = require("../models/currently_in");
const { query_plates } = require("../utils/pagination");

// get all plate_logs
exports.plate_logs_get = async (req, res) => {
  try {
    const results = await query_plates(req.query, PlateLog);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get Known/Bad plate info
exports.plate_logs_get_one = async (req, res) => {
  try {
    let plate = await PlateLog.findById(req.params.id);
    if (plate == null) {
      return res.status(404).json({ message: "Cannot find in plate_logs" });
    }
    if (plate.type == "known") {
      let known_plate = await KnownPlate.findOne({
        plate_number: plate.plate_number,
      });
      if (known_plate == null) {
        return res
          .status(404)
          .json({ message: "Cannot find in known plate DB" });
      }
      res.json(known_plate);
    } else if (plate.type == "bad") {
      let bad_plate = await BadPlate.findOne({
        plate_number: plate.plate_number,
      });
      if (bad_plate == null) {
        return res.status(404).json({ message: "Cannot find in bad plate DB" });
      }
      res.json(bad_plate);
    } else if (plate.type == "unknown") {
      res.status(404).json({ message: "This is an unknown plate." });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.plate_logs_approve = async (req, res) => {
  try {
    const {
      plate_number,
      organization_name,
      organization_name_khmer,
      plate,
      change,
      temperature,
      reason,
      num_people,
      origin,
      phone_number,
      nationality,
      vehicle_type,
      status,
      approved_by,
    } = req.body;
    let updatedPlates = [];
    let plate_plate_log = await PlateLog.findOne({
      _id: plate._id,
    });
    if (plate_plate_log == null) {
      return res
        .status(404)
        .json({ message: "Cannot find plate in Plate Logs" });
    } else {
      if (change == true) {
        plate_plate_log.plate_number = plate_number;
        plate_plate_log.organization_name = organization_name;
        plate_plate_log.organization_name_khmer = organization_name_khmer;
        plate_plate_log.reason = reason;
        plate_plate_log.num_people = num_people;
        plate_plate_log.phone_number = phone_number;
        plate_plate_log.temperature = temperature;
        plate_plate_log.origin = origin;
        plate_plate_log.nationality = nationality;
        plate_plate_log.vehicle_type = vehicle_type;
        plate_plate_log.status = status;
        plate_plate_log.approved_by = approved_by;
      }
      plate_plate_log.approved = true;
      updatedPlates.push(await plate_plate_log.save());
    }
    let remove_plate_currently_in = false;

    let correct_plate_currently_in = await CurrentlyIn.findOne({
      plate_number: plate_number,
    });

    if (correct_plate_currently_in != null) {
      // delete if find same plate in currently_in but older time
      if (
        correct_plate_currently_in.time.getTime() <
        plate_plate_log.time.getTime()
      ) {
        await correct_plate_currently_in.remove();
        updatedPlates.push("deleted correct_plate from Currently_in DB");
      } else if (
        correct_plate_currently_in.time.getTime() >
        plate_plate_log.time.getTime()
      ) {
        // else delete this currently_in plate
        remove_plate_currently_in = true;
      }
    }

    if (!remove_plate_currently_in) {
      let latest_plate_log = await PlateLog.findOne({
        plate_number: plate_number,
      }).sort({ time: -1 });

      if (latest_plate_log != null) {
        if (latest_plate_log.time.getTime() > plate_plate_log.time.getTime()) {
          if (latest_plate_log.status == "Out") {
            remove_plate_currently_in = true;
          }
        }
      }
    }

    let plate_currently_in = await CurrentlyIn.findOne({
      plate_number: plate.plate_number,
      time: plate.time,
    }); //.sort({ time: -1 });

    if (plate_currently_in != null) {
      if (remove_plate_currently_in) {
        // plate in currently_in already exists ahead of time
        await plate_currently_in.remove();
        updatedPlates.push(
          "Remove plate from Currently_in DB because plate already exists"
        );
      } else {
        if (change == true) {
          plate_currently_in.plate_number = plate_number;
          plate_currently_in.organization_name = organization_name;
          plate_currently_in.organization_name_khmer = organization_name_khmer;
          plate_currently_in.reason = reason;
          plate_currently_in.num_people = num_people;
          plate_currently_in.phone_number = phone_number;
          plate_currently_in.temperature = temperature;
          plate_currently_in.origin = origin;
          plate_currently_in.nationality = nationality;
          plate_currently_in.vehicle_type = vehicle_type;
          plate_currently_in.status = status;
          plate_currently_in.approved_by = approved_by;
        }
        plate_currently_in.approved = true;
        updatedPlates.push(await plate_currently_in.save());
      }
    }

    res.json(updatedPlates);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// delete one in plate_logs must be deleted in
exports.plate_logs_delete = async (req, res) => {
  try {
    let updatedPlates = [];
    let plate_plate_log = await PlateLog.findOne({
      _id: req.body.plate._id,
    });
    if (plate_plate_log == null) {
      return res
        .status(404)
        .json({ message: "Cannot find plate in Plate Logs" });
    } else {
      await plate_plate_log.remove();
      updatedPlates.push("Plate deleted from Plate Logs Database");
    }
    let plate_currently_in = await CurrentlyIn.findOne({
      plate_number: req.body.plate.plate_number,
      time: req.body.plate.time,
    });
    if (plate_currently_in != null) {
      await plate_currently_in.remove();
      updatedPlates.push("Plate deleted from Currently In Database");
    }
    res.json(updatedPlates);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//User choose the date and by default last 7 days
exports.all_weekly_plate = async (req, res) => {
  try {
    //Start Date
    const startDate = req.body.startDate;
    // console.log(startDate)
    //end Date
    const end = req.body.endDate;
    const endDate = new Date(end);
    endDate.setHours(endDate.getHours() + 23, 59);
    // console.log(endDate)

    const range_dates = await PlateLog.find({
      time: { $gte: startDate, $lte: endDate },
    }).sort({ time: -1 });
    res.json(range_dates);
  } catch (err) {
    res.status(400).json(err);
  }
};

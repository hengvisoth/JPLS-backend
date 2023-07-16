const commitlogs = require("../models/commitlog");
const CurrentlyIn = require("../models/currently_in");
const KnownPlate = require("../models/known_plate");
const BadPlate = require("../models/bad_plate");
const PlateLog = require("../models/plate_log");
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.TelegramBot);
const io = require("../server").io;

const commitlog_get = async (req, res) => {
  try {
    const data = await commitlogs.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// insert data into commitlog, change currently_in, add in plate_logs
// Make changes to the commitlog_post function as follows:
const commitlog_post = async (req, res) => {
  const {
    plate_number,
    classification_number,
    place_name,
    kana_text , 
    location,
    time,
    status,
    vehicle_type,
  } = req.body;
  console.log(time,  classification_number,
    place_name,
    kana_text , );
  const timeNow = new Date(time);
  const commitlog_data = new commitlogs({
    plate_number: req.body.plate_number,
    classification_number: classification_number,
    kana_text: kana_text,
    place_name : place_name,
    location: location,
    time: timeNow,
    vehicle_type: vehicle_type,
  });
  // current plate_number
  const plate_number_obj = { plate_number: plate_number };
  // lastDetected plate according to plate_number
  const lastDetected = await commitlogs
    .findOne(plate_number_obj)
    .sort({ time: -1 });

  // if plate not in commitlog or time difference of lastDetected and current time is > 10s

  if (
    !lastDetected ||
    timeNow.getTime() - lastDetected.time.getTime() > 10000
  ) {
    // check type
    let type = "unknown";
    let KnownOrBadPlate = await KnownPlate.findOne(plate_number_obj);
    if (KnownOrBadPlate) {
      type = "known";
    } else {
      KnownOrBadPlate = await BadPlate.findOne(plate_number_obj);
      if (KnownOrBadPlate) {
        type = "bad";
      }
    }

    const detectedPlate = new PlateLog({
      organization_name_khmer: organization_name_khmer,
      plate_number: req.body.plate_number,
      organization_name: organization_name,
      location: location,
      type: type,
      time: timeNow,
      approved: false,
      vehicle_type: vehicle_type,
    });
    // new code for getting status input here
    let insideCurrently_in = await CurrentlyIn.findOne(plate_number_obj);
    if (insideCurrently_in) insideCurrently_in.remove();
    if (status == "Out") {
      try {
        // save in commitlog & delete from Currently_in & save in plate_logs
        const newCommitLog = await commitlog_data.save();
        detectedPlate.status = "Out";
        var newPlatedetected = await detectedPlate.save();
        res.json([
          newCommitLog,
          { message: "Deleted plate from currently_in" },
          newPlatedetected,
        ]);
      } catch (err) {
        res.status(500).json({ message: err.message }); // 400
      }
    } else {
      // car/moto is not inside, so add in commitlog & add in Currently_in & add in plate_logs
      const inPlate = new CurrentlyIn({
        organization_name_khmer: organization_name_khmer,
        plate_number: req.body.plate_number,
        organization_name: organization_name,
        location: location,
        type: type,
        time: timeNow,
        approved: false,
        vehicle_type: vehicle_type,
      });
      try {
        const newCommitLog = await commitlog_data.save();
        const newInPlate = await inPlate.save();
        detectedPlate.status = "In";
        var newPlatedetected = await detectedPlate.save();
        res.json([newCommitLog, newInPlate, newPlatedetected]);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    }
    /*
    let insideCurrently_in = await CurrentlyIn.findOne(plate_number_obj);
    // if car/moto is inside
    if (insideCurrently_in) {
      try {
        // save in commitlog & delete from Currently_in & save in plate_logs
        const newCommitLog = await commitlog_data.save();
        insideCurrently_in.remove();
        detectedPlate.status = "Out";
        var newPlatedetected = await detectedPlate.save();
        res.json([
          newCommitLog,
          { message: "Deleted plate from currently_in" },
          newPlatedetected,
        ]);
      } catch (err) {
        res.status(500).json({ message: err.message }); // 400
      }
    } else {
      // car/moto is not inside, so add in commitlog & add in Currently_in & add in plate_logs
      const inPlate = new CurrentlyIn({
        organization_name_khmer: organization_name_khmer,
        plate_number: req.body.plate_number,
        organization_name: organization_name,
        location: location,
        type: type,
        time: timeNow,
      });
      try {
        const newCommitLog = await commitlog_data.save();
        const newInPlate = await inPlate.save();
        detectedPlate.status = "In";
        var newPlatedetected = await detectedPlate.save();
        res.json([newCommitLog, newInPlate, newPlatedetected]);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    }
    */

    if ((type == "bad" || type == "unknown") || plate_number !== "No Plate") {
      let message =
        `${organization_name_khmer}\n` +
        `${req.body.plate_number}\n` +
        `${organization_name}\n` +
        `Status: ${detectedPlate.status}\n` +
        `Date: ${time.toString().slice(0, 10)}\n` +
        `Time: ${time.toString().slice(11, 19)}\n` +
        `Location: ${location}`;
      // if bad_plate, send an alert
      if (type == "unknown") {
        const ytd = new Date(time);
        ytd.setDate(ytd.getDate() - 1);
        const PlatesPast24h = await PlateLog.find({
          time: { $gte: ytd, $lte: timeNow },
        }).find(plate_number_obj);
        const count = Object.keys(PlatesPast24h).length;

        if (count > 9) {
          message = `ALERT! Unknown Plate in/out ${count} times\n` + message;
        }
      } else {
        message = "Bad Plate Alert!\n" + message;
      }
      bot.sendMessage(process.env.TelegramGroup, message);
      /*
      bot.sendPhoto(
        process.env.TelegramGroup,
        `/home/ubuntu/realtime_images/whiteshop/${time}.png`
      );
      */
    }

    // send new plate alert to front end socketIO
    io.emit("newPlate", "New Plate is in");
  } else {
    // duplicate plate, so add in commitlog
    try {
      // update organization names because later result tend to have better accuracy
      // AI sends first data when reached 5 count, so save org name of later result
      let firstDetectedPlate = await PlateLog.findOne(plate_number_obj).sort({
        time: -1,
      });
      if (firstDetectedPlate.approved == false) {
        firstDetectedPlate.organization_name = organization_name;
        firstDetectedPlate.organization_name_khmer = organization_name_khmer;
        await firstDetectedPlate.save();
        let firstDetectedPlateCurrentlyIn = await CurrentlyIn.findOne(
          plate_number_obj
        ).sort({ time: -1 });
        if (firstDetectedPlateCurrentlyIn != null) {
          firstDetectedPlateCurrentlyIn.organization_name = organization_name;
          firstDetectedPlateCurrentlyIn.organization_name_khmer =
            organization_name_khmer;
          await firstDetectedPlateCurrentlyIn.save();
        }
      }
      const newCommitlog = await commitlog_data.save();
      res.status(201).json(newCommitlog);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};

module.exports = { commitlog_get, commitlog_post };

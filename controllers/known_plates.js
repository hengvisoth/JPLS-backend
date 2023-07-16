const KnownPlate = require("../models/known_plate");

exports.known_plates_get_all = async (req, res) => {
  try {
    const plates = await KnownPlate.find();
    res.json(plates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.known_plates_get_one = (req, res) => {
  res.json(res.plate);
};

exports.known_plates_post = async (req, res) => {
  const plate = new KnownPlate({
    fullname: req.body.fullname,
    phone: req.body.phone,
    email: req.body.email,
    role: req.body.role,
    vehicle_type: req.body.vehicle_type,
    gender: req.body.gender,
    age: req.body.age,
    plate_number: req.body.plate_number,
    organization_name: req.body.organization_name,
    organization_name_khmer: req.body.organization_name_khmer,
  });
  try {
    const newKnownPlate = await plate.save();
    res.status(201).json(newKnownPlate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.known_plates_update = async (req, res) => {
  if (req.body.fullname != null) {
    res.plate.fullname = req.body.fullname;
  }
  if (req.body.phone != null) {
    res.plate.phone = req.body.phone;
  }
  if (req.body.email != null) {
    res.plate.email = req.body.email;
  }
  if (req.body.role != null) {
    res.plate.role = req.body.role;
  }
  if (req.body.vehicle_type != null) {
    res.plate.vehicle_type = req.body.vehicle_type;
  }
  if (req.body.gender != null) {
    res.plate.gender = req.body.gender;
  }
  if (req.body.age != null) {
    res.plate.age = req.body.age;
  }
  if (req.body.plate_number != null) {
    res.plate.plate_number = req.body.plate_number;
  }
  if (req.body.organization_name != null) {
    res.plate.organization_name = req.body.organization_name;
  }
  if (req.body.organization_name_khmer != null) {
    res.plate.organization_name_khmer = req.body.organization_name_khmer;
  }

  try {
    const updatedKnownPlate = await res.plate.save();
    res.json(updatedKnownPlate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.known_plates_delete = async (req, res) => {
  try {
    await res.plate.remove();
    res.json({ message: "Deleted plate" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.KnownPlateID = async function getKnownPlate(req, res, next) {
  let plate;
  try {
    plate = await KnownPlate.findOne({ plate_number: req.params.id });
    if (plate == null) {
      return res.status(404).json({ message: "Cannot find plate" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.plate = plate;
  next();
};

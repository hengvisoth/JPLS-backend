/* eslint-disable */

const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const BadPlatesControllers = require("../controllers/bad_plates");
// get all
router.get("/", checkAuth, BadPlatesControllers.bad_plates_get_all);
// get one
router.get(
  "/:id",
  checkAuth,
  BadPlatesControllers.BadPlateID,
  BadPlatesControllers.bad_plates_get_one
);
// create plate
router.post("/", checkAuth, BadPlatesControllers.bad_plates_post);
// update plate
router.patch(
  "/:id",
  checkAuth,
  BadPlatesControllers.BadPlateID,
  BadPlatesControllers.bad_plates_update
);
// delete
router.delete(
  "/:id",
  checkAuth,
  BadPlatesControllers.BadPlateID,
  BadPlatesControllers.bad_plates_delete
);

module.exports = router;

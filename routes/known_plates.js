const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const KnownPlatesControllers = require("../controllers/known_plates");
// get all
router.get("/", checkAuth, KnownPlatesControllers.known_plates_get_all);
// get one
router.get(
  "/:id",
  checkAuth,
  KnownPlatesControllers.KnownPlateID,
  KnownPlatesControllers.known_plates_get_one
);
// create plate
router.post("/", checkAuth, KnownPlatesControllers.known_plates_post);
// update plate
router.patch(
  "/:id",
  checkAuth,
  KnownPlatesControllers.KnownPlateID,
  KnownPlatesControllers.known_plates_update
);
// delete
router.delete(
  "/:id",
  checkAuth,
  KnownPlatesControllers.KnownPlateID,
  KnownPlatesControllers.known_plates_delete
);

module.exports = router;

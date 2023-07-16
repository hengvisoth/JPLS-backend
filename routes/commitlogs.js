const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const commitlogControllers = require("../controllers/commitlogs");

router.get("/", checkAuth, commitlogControllers.commitlog_get);
// post in commitLogs, also in PlateCollections, Currently_ins,
router.post("/", checkAuth, commitlogControllers.commitlog_post);

module.exports = router;

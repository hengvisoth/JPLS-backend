/* eslint-disable */

const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const PlateLogsControllers = require("../controllers/plate_logs");
/**
**
 * @swagger
 * /plate_logs:
 *   get:
 *     parameters:
 *      - in: query
 *        name: page
 *        type: integer
 *        required: false
 *        default: 1
 *        minimum: 1
 *        description: The number of pages
 *      - in: query
 *        name: limit
 *        type: integer
 *        required: false
 *        default: 5
 *        minimum: 1
 *        maximum: 100
 *        description: The numbers of items to return.
 *      - in: query
 *        name: type
 *        type: string
 *        required: false
 *        description: The type of the plate
 *      - in: query
 *        name: search
 *        type: string
 *        required: false
 *        description: The plate number to search
 *      - in: query
 *        name: sortBy
 *        type: string
 *        required: false
 *        description: key to sort
 *        example: time:desc, plate_number:asc
 *     summary: get all plate logs
 *     tags:
 *       - Plate Logs
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/plate_logs'
 */
router.get("/", checkAuth, PlateLogsControllers.plate_logs_get);
// get Known/Bad Plates info
router.get("/id/:id", checkAuth, PlateLogsControllers.plate_logs_get_one);
//Route for query date
router.post(
  "/date",
  checkAuth,
  PlateLogsControllers.all_weekly_plate
);
/**
 * @swagger
 * /plate_logs/approve:
 *   post:
 *     requestBody:
 *       required: true
 *       description: The plate number info to approve/edit
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/approve'
 *             example:
 *               "plate_number": "1E3282"
 *     summary: approve plate in plate logs
 *     tags:
 *       - Plate Logs
 *     responses:
 *       200:
 *         description: Plate approved
 */
router.post("/approve", checkAuth, PlateLogsControllers.plate_logs_approve);
/**
 * @swagger
 * /plate_logs/delete:
 *   delete:
 *     requestBody:
 *       required: true
 *       description: The plate number info to approve/edit
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/plate_log'
 *     summary: delete plate in plate logs
 *     tags:
 *       - Plate Logs
 *     responses:
 *       200:
 *         description: Plate deleted
 */
router.delete("/delete", checkAuth, PlateLogsControllers.plate_logs_delete);

module.exports = router;

const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const CurrentlyInControllers = require("../controllers/currently_in");
/**
 * @swagger
 * /currently_in:
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
 *     summary: get all plates that are currently inside
 *     tags:
 *       - CurrentlyIn
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/currently_ins'
 */
router.get("/", checkAuth, CurrentlyInControllers.currently_in_get);
/**
 * @swagger
 * /currently_in/approve:
 *   post:
 *     requestBody:
 *       required: true
 *       description: The plate number info to approve/edit
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/approve'
 *     summary: approve plate in currently_in
 *     tags:
 *       - CurrentlyIn
 *     responses:
 *       200:
 *         description: The plate number has been approved
 * 
 */
router.post("/approve", checkAuth, CurrentlyInControllers.currently_in_approve);
/**
 * @swagger
 * /currently_in/delete:
 *   delete:
 *     requestBody:
 *       required: true
 *       description: The plate number info to approve/edit
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/currently_in'
 *     summary: delete plate in currently in
 *     tags:
 *       - CurrentlyIn
 *     responses:
 *       200:
 *         description: Plate deleted
 */
router.delete("/delete", checkAuth, CurrentlyInControllers.currently_in_delete);

module.exports = router;

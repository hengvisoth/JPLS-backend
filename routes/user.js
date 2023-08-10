/* eslint-disable */

const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const UserControllers = require("../controllers/user");
router.get("/", checkAuth, UserControllers.user_get);
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login to the dashboard
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/login'
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User login successfully
 */
router.post("/login", UserControllers.user_login);

/**
 * @swagger
 * /user/signup:
 *  post:
 *   summary: Signup to the dashboard
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/login'
 *   tags:
 *      - Users
 *   responses:
 *    201:
 *     description: User signup successfully
 *    400:
 *     description: User signup failed
 *    409:
 *     description: Email already exists
 *    500:
 *     description: Internal server error
 */
router.post("/signup", UserControllers.user_signup);

router.post("/forget-password", UserControllers.user_forgetPassword)

router.post("/verify-otp",UserControllers.verifyOTP)

module.exports = router;

const express = require("express");
const { registerDoctor, loginDoctor } = require("../controllers/doctorController");
const { registerPatient, loginPatient } = require("../controllers/patientController");
const { googleAuth } = require("../controllers/googleAuthController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Endpoints for doctor and patient authentication
 */

/**
 * @swagger
 * /api/auth/doctor/register:
 *   post:
 *     summary: Register a new doctor
 *     tags: [Authentication]
 *     description: Creates a new doctor account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: "Dr. Ahmet Yılmaz"
 *               email:
 *                 type: string
 *                 example: "ahmet.yilmaz@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *               specialization:
 *                 type: string
 *                 example: "Psikoloji"
 *               available_days:
 *                 type: string
 *                 example: "Mon,Tue,Thu"
 *               available_hours:
 *                 type: string
 *                 example: '{"start": "09:00", "end": "17:00"}'
 *               address:
 *                 type: string
 *                 example: "Bağdat Cd. No:45"
 *               city:
 *                 type: string
 *                 example: "İstanbul"
 *               town:
 *                 type: string
 *                 example: "Kadıköy"
 *     responses:
 *       201:
 *         description: Doctor registered successfully
 *       400:
 *         description: Doctor already registered
 *       500:
 *         description: Server error
 */
router.post("/doctor/register", registerDoctor);

/**
 * @swagger
 * /api/auth/doctor/login:
 *   post:
 *     summary: Doctor login
 *     tags: [Authentication]
 *     description: Logs in a registered doctor and returns a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "ahmet.yilmaz@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 */
router.post("/doctor/login", loginDoctor);

/**
 * @swagger
 * /api/auth/patient/register:
 *   post:
 *     summary: Register a new patient
 *     tags: [Authentication]
 *     description: Creates a new patient account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: "Ali Vural"
 *               email:
 *                 type: string
 *                 example: "ali.vural@example.com"
 *               password:
 *                 type: string
 *                 example: "mypassword"
 *               phone:
 *                 type: string
 *                 example: "05431234567"
 *     responses:
 *       201:
 *         description: Patient registered successfully
 *       400:
 *         description: Patient already registered
 *       500:
 *         description: Server error
 */
router.post("/patient/register", registerPatient);

/**
 * @swagger
 * /api/auth/patient/login:
 *   post:
 *     summary: Patient login
 *     tags: [Authentication]
 *     description: Logs in a registered patient and returns a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "ayse.demir@example.com"
 *               password:
 *                 type: string
 *                 example: "demopass123"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 */
router.post("/patient/login", loginPatient);
router.post("/api/auth/google", googleAuth);


module.exports = router;

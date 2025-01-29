const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

/**
 * @swagger
 * tags:
 *   - name: Appointments
 *     description: Endpoints for managing doctor-patient appointments
 */

/**
 * @swagger
 * /api/appointments/book:
 *   post:
 *     summary: Book a new appointment
 *     tags: [Appointments]
 *     description: Creates a new appointment between a patient and a doctor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctor_id:
 *                 type: integer
 *                 example: 1
 *               patient_id:
 *                 type: integer
 *                 example: 5
 *               appointment_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-02-10"
 *               appointment_time:
 *                 type: string
 *                 format: time
 *                 example: "14:30"
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *       400:
 *         description: Appointment slot already taken
 *       500:
 *         description: Server error
 */
router.post("/book", appointmentController.bookAppointment);

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Get all appointments for a user
 *     tags: [Appointments]
 *     description: Fetches all appointments for a doctor or patient
 *     parameters:
 *       - name: user_id
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *       - name: role
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           enum: [doctor, patient]
 *         example: "patient"
 *     responses:
 *       200:
 *         description: List of appointments returned successfully
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Server error
 */
router.get("/", appointmentController.getAppointments);

/**
 * @swagger
 * /api/appointments/save-incomplete:
 *   post:
 *     summary: Save incomplete appointment progress
 *     tags: [Appointments]
 *     description: Saves an unfinished appointment to allow resuming later
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctor_id:
 *                 type: integer
 *                 example: 1
 *               patient_id:
 *                 type: integer
 *                 example: 5
 *               appointment_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-02-10"
 *               appointment_time:
 *                 type: string
 *                 format: time
 *                 example: "14:30"
 *     responses:
 *       200:
 *         description: Appointment progress saved
 *       500:
 *         description: Server error
 */
router.post("/save-incomplete", appointmentController.saveIncompleteAppointment);

/**
 * @swagger
 * /api/appointments/cancel:
 *   post:
 *     summary: Cancel an appointment
 *     tags: [Appointments]
 *     description: Allows a patient or doctor to cancel an appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointment_id:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Appointment cancelled successfully
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */
router.post("/cancel", appointmentController.cancelAppointment);

module.exports = router;

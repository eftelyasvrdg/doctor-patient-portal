const express = require("express");
const { submitReview, getDoctorReviews, requestReview } = require("../controllers/reviewController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: Endpoints for managing doctor reviews
 */

/**
 * @swagger
 * /api/reviews/submit:
 *   post:
 *     summary: Submit a review for a doctor
 *     tags: [Reviews]
 *     description: Allows a patient to submit a rating and comment for a doctor
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
 *               rating:
 *                 type: integer
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Great doctor, very professional!"
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *       400:
 *         description: Inappropriate language detected
 *       500:
 *         description: Server error
 */
router.post("/submit", submitReview);

/**
 * @swagger
 * /api/reviews/doctor/{doctor_id}:
 *   get:
 *     summary: Get all reviews for a specific doctor
 *     tags: [Reviews]
 *     description: Fetches all reviews for a doctor by their ID
 *     parameters:
 *       - name: doctor_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/doctor/:doctor_id", getDoctorReviews);

/**
 * @swagger
 * /api/reviews/request:
 *   post:
 *     summary: Send a review request email to a patient
 *     tags: [Reviews]
 *     description: Sends an email asking a patient to review their appointment with a doctor
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
 *     responses:
 *       200:
 *         description: Review request email sent successfully
 *       500:
 *         description: Server error
 */
router.post("/request", requestReview);

module.exports = router;

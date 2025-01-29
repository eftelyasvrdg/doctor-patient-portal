const Review = require("../models/Review");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const { checkProfanity } = require("../utils/profanityFilter");
const { sendReviewRequest } = require("../utils/emailService"); 

// ✅ Submit a review (Patient rates Doctor)
exports.submitReview = async (req, res) => {
  try {
    const { doctor_id, patient_id, rating, comment } = req.body;

    const patient = await Patient.findByPk(patient_id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const doctor = await Doctor.findByPk(doctor_id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    if (checkProfanity(comment)) {
      return res.status(400).json({ message: "Inappropriate language detected. Review rejected." });
    }

    const review = await Review.create({
      doctor_id,
      patient_id,
      rating,
      comment
    });

    res.status(201).json({ message: "Review submitted successfully!", review });
  } catch (error) {
    console.error("❌ Error submitting review:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Send review request email after an appointment
exports.requestReview = async (req, res) => {
  try {
    const { doctor_id, patient_id } = req.body;

    const patient = await Patient.findByPk(patient_id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const doctor = await Doctor.findByPk(doctor_id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    sendReviewRequest(patient.email, doctor.full_name, doctor.id);

    res.status(200).json({ message: "Review request email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending review request:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get all reviews for a specific doctor
exports.getDoctorReviews = async (req, res) => {
  try {
    const { doctor_id } = req.params;

    const reviews = await Review.findAll({
      where: { doctor_id },
      include: [{ model: Patient, attributes: ["full_name", "email"] }]
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendReviewRequest = (patientEmail, doctorName, doctorId) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: patientEmail,
        subject: `Please Rate Your Visit with Dr. ${doctorName}`,
        text: `Dear Patient,\n\nWe hope your visit with Dr. ${doctorName} was helpful. Please take a moment to rate your experience.\n\nClick the link below to submit your review:\n\nhttp://localhost:3000/review/${doctorId}\n\nThank you!\n\nBest regards,\nHospital Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("❌ Email sending failed:", error);
        } else {
            console.log("✅ Email sent:", info.response);
        }
    });
};

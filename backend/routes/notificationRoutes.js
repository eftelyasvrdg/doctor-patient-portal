const express = require("express");
const { incompleteAppointment } = require("../controllers/notificationController");

const router = express.Router();

router.post("/incomplete", incompleteAppointment);

module.exports = router;

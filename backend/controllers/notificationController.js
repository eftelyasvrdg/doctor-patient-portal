const { addToQueue } = require("../utils/queueService");

exports.incompleteAppointment = async (req, res) => {
    const { email, doctorName } = req.body;

    if (!email || !doctorName) {
        return res.status(400).json({ message: "Email and doctor name required" });
    }

    await addToQueue(email, doctorName);
    res.status(200).json({ message: "User added to reminder queue." });
};

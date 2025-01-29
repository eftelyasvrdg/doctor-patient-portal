const Patient = require("../models/Patient"); 
const jwt = require("jsonwebtoken");

// **Patient Registration (Manual)**
const registerPatient = async (req, res) => {
    try {
        const { full_name, email, password, phone } = req.body;

        console.log("🔍 Received Patient Data:", req.body);

        const patientExists = await Patient.findOne({ where: { email } });
        if (patientExists) {
            console.log("❌ Patient already exists!");
            return res.status(400).json({ message: "Patient already registered." });
        }

        const patient = await Patient.create({
            full_name,
            email,
            password,  
            phone
        });

        console.log("✅ Patient registered successfully:", patient.toJSON());
        res.status(201).json({ message: "Patient registered successfully." });

    } catch (error) {
        console.error("❌ Error in registerPatient:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// **Patient Login (Manual)**
const loginPatient = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(`🔍 Checking login for email: ${email}`);

        const patient = await Patient.findOne({ where: { email } });

        if (!patient) {
            console.log("❌ Patient not found!");
            return res.status(400).json({ message: "Invalid email or password." });
        }

        console.log(`✅ Patient found: ${patient.email}`);
        console.log(`🔑 Stored Password (Plain Text): ${patient.password}`);

        if (password !== patient.password) {
            console.log("❌ Password does not match!");
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { id: patient.id, email: patient.email, role: "patient" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful!", token });
    } catch (error) {
        console.error("❌ Error in loginPatient:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { registerPatient, loginPatient };

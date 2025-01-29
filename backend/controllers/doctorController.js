const Doctor = require("../models/Doctor");
const jwt = require("jsonwebtoken");

// **Doctor Registration (Manual)**
const registerDoctor = async (req, res) => {
    try {
        const { full_name, email, password, specialization, available_days, available_hours, address, city, town } = req.body;

        const doctorExists = await Doctor.findOne({ where: { email } });
        if (doctorExists) {
            return res.status(400).json({ message: "Doctor already registered." });
        }

        const doctor = await Doctor.create({
            full_name,
            email,
            password,  
            specialization,
            available_days,
            available_hours,
            address,
            city,
            town
        });

        res.status(201).json({ message: "Doctor registered successfully. Awaiting approval." });
    } catch (error) {
        console.error("❌ Error in registerDoctor:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// **Doctor Login (Manual)**
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(`🔍 Checking login for email: ${email}`);

        const doctor = await Doctor.findOne({ where: { email } });

        if (!doctor) {
            console.log("❌ Doctor not found!");
            return res.status(400).json({ message: "Invalid email or password." });
        }

        console.log(`✅ Doctor found: ${doctor.email}`);
        console.log(`🔑 Stored Password: ${doctor.password}`);

        if (password !== doctor.password) {
            console.log("❌ Password does not match!");
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { id: doctor.id, email: doctor.email, role: "doctor" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ 
            message: "Login successful!", 
            token,
            doctor: {
                id: doctor.id,
                full_name: doctor.full_name,
                email: doctor.email,
                specialization: doctor.specialization,
                city: doctor.city,
                town: doctor.town
            }
        });
    } catch (error) {
        console.error("❌ Error in loginDoctor:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// **Search Doctors by Specialization & Location**
const searchDoctors = async (req, res) => {
    try {
        const { query, location } = req.query;

        if (!query || !location) {
            return res.status(400).json({ message: "Query and location are required." });
        }

        const doctors = await Doctor.findAll({
            where: {
                [Op.or]: [
                    { full_name: { [Op.iLike]: `%${query}%` } }, 
                    { specialization: { [Op.iLike]: `%${query}%` } }  
                ],
                city: location
            }
        });

        if (doctors.length === 0) {
            return res.status(404).json({ message: "No doctors found matching the criteria." });
        }

        res.json({ message: "Doctors found!", doctors });
    } catch (error) {
        console.error("❌ Error in searchDoctors:", error);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = { registerDoctor, loginDoctor, searchDoctors };

const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ error: "No token provided" });

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, name } = ticket.getPayload();

        let user = await Doctor.findOne({ where: { email } }) || 
                   await Patient.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: "User not found, please register first" });
        }

        const role = user.specialization ? "doctor" : "patient";

        const jwtToken = jwt.sign(
            { id: user.id, email: user.email, role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ 
            message: "Login successful", 
            token: jwtToken, 
            user: {
                id: user.id,
                full_name: user.full_name || name,
                email: user.email,
                role,
                specialization: user.specialization || null, 
                city: user.city || null
            }
        });

    } catch (error) {
        console.error("Google authentication error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { googleAuth };

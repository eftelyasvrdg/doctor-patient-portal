const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

// 📌 1️⃣ Book an appointment
exports.bookAppointment = async (req, res) => {
    try {
        const { doctor_id, patient_id, appointment_date, appointment_time } = req.body;

        const doctor = await Doctor.findByPk(doctor_id);
        if (!doctor) return res.status(404).json({ message: "Doktor bulunamadı." });

        const patient = await Patient.findByPk(patient_id);
        if (!patient) return res.status(404).json({ message: "Hasta bulunamadı." });

        const existingAppointment = await Appointment.findOne({
            where: { doctor_id, appointment_date, appointment_time, status: ["pending", "confirmed"] }
        });

        if (existingAppointment) {
            return res.status(400).json({ message: "Bu saat için zaten randevu var." });
        }

        const appointment = await Appointment.create({
            doctor_id,
            patient_id,
            appointment_date,
            appointment_time,
            status: "pending"
        });

        res.status(201).json({ message: "Randevu başarıyla oluşturuldu.", appointment });
    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ message: "Randevu oluşturulurken bir hata oluştu." });
    }
};

// 📌 2️⃣ Get all appointments for a user
exports.getAppointments = async (req, res) => {
    try {
        const { user_id, role } = req.query;

        if (!user_id || !role) {
            return res.status(400).json({ message: "Geçerli bir kullanıcı ID ve rolü gereklidir." });
        }

        let appointments;
        if (role === "doctor") {
            appointments = await Appointment.findAll({
                where: { doctor_id: user_id },
                include: [{ model: Patient, attributes: ["id", "full_name", "email"] }]
            });
        } else if (role === "patient") {
            appointments = await Appointment.findAll({
                where: { patient_id: user_id },
                include: [{ model: Doctor, attributes: ["id", "full_name", "specialization"] }]
            });
        } else {
            return res.status(400).json({ message: "Geçersiz rol." });
        }

        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Randevular alınırken bir hata oluştu." });
    }
};

// 📌 3️⃣ Handle unfinished appointments (Save progress)
exports.saveIncompleteAppointment = async (req, res) => {
    try {
        const { doctor_id, patient_id, appointment_date, appointment_time } = req.body;

        if (!patient_id) return res.status(400).json({ message: "Hasta kimliği gereklidir." });
        res.json({ message: "Randevu bilgileri saklandı. Giriş yaparak tamamlayabilirsiniz." });

    } catch (error) {
        console.error("Error saving incomplete appointment:", error);
        res.status(500).json({ message: "Geçici randevu kaydedilirken hata oluştu." });
    }
};

// 📌 4️⃣ Cancel an appointment
exports.cancelAppointment = async (req, res) => {
    try {
        const { appointment_id } = req.body;

        const appointment = await Appointment.findByPk(appointment_id);
        if (!appointment) return res.status(404).json({ message: "Randevu bulunamadı." });

        await appointment.update({ status: "cancelled" });

        res.json({ message: "Randevu iptal edildi." });
    } catch (error) {
        console.error("Error cancelling appointment:", error);
        res.status(500).json({ message: "Randevu iptal edilirken bir hata oluştu." });
    }
};

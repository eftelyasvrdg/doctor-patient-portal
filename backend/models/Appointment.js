const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Doctor = require("./Doctor");
const Patient = require("./Patient");

const Appointment = sequelize.define("Appointment", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Doctor,
            key: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    },
    patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Patient,
            key: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    },
    appointment_date: {
        type: DataTypes.DATEONLY, 
        allowNull: false
    },
    appointment_time: {
        type: DataTypes.TIME, 
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
        defaultValue: "pending"
    }
}, {
    timestamps: true
});

Doctor.hasMany(Appointment, { foreignKey: "doctor_id" });
Patient.hasMany(Appointment, { foreignKey: "patient_id" });
Appointment.belongsTo(Doctor, { foreignKey: "doctor_id" });
Appointment.belongsTo(Patient, { foreignKey: "patient_id" });

module.exports = Appointment;

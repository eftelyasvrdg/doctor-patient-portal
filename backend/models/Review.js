const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Doctor = require("./Doctor");
const Patient = require("./Patient");

const Review = sequelize.define("Review", {
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
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true 
});

Doctor.hasMany(Review, { foreignKey: "doctor_id" });
Patient.hasMany(Review, { foreignKey: "patient_id" });
Review.belongsTo(Doctor, { foreignKey: "doctor_id" });
Review.belongsTo(Patient, { foreignKey: "patient_id" });

module.exports = Review;

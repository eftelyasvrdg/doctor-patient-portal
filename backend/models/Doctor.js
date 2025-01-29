const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Doctor = sequelize.define("Doctor", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  full_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: true }, // NULL for Google Auth, Required for Manual
  specialization: { type: DataTypes.STRING, allowNull: false },
  available_days: { type: DataTypes.TEXT, allowNull: false },
  available_hours: { type: DataTypes.TEXT, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  town: { type: DataTypes.STRING, allowNull: false },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false }, 
}, { 
  timestamps: true 
});

module.exports = Doctor;

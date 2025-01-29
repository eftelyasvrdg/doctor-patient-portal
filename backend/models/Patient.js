const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db");

const Patient = sequelize.define("Patient", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  full_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: true }, 
  phone: { type: DataTypes.STRING, allowNull: true },
  createdAt: { 
    type: DataTypes.DATE, 
    allowNull: false, 
    defaultValue: Sequelize.NOW 
  },
  updatedAt: { 
    type: DataTypes.DATE, 
    allowNull: false, 
    defaultValue: Sequelize.NOW 
  }
}, { 
  tableName: "patients",  
  timestamps: true,  
  freezeTableName: true 
});

module.exports = Patient;

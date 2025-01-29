const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false,
});

// Test the connection
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection to Google Cloud MySQL successful!");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
}

testDatabaseConnection();

module.exports = sequelize;

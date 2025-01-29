require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const setupSwagger = require("./config/swaggerConfig");
const sequelize = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const { processQueue } = require("./utils/scheduler");

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

// Initialize Swagger API Docs
setupSwagger(app);

// Start RabbitMQ Queue Processing
processQueue();

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("✅ Doctor Appointment Backend (Microservice) is Running!");
});

const PORT = process.env.PORT || 5008;
sequelize.sync({ alter: true }) 
  .then(() => {
    console.log("✅ Database synced successfully!");
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ Swagger Docs available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => {
    console.error("❌ Database sync error:", err);
  });

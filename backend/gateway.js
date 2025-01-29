require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT =  5000;

// 🔹 Route: Authentication + Appointments Service
app.use(
    "/api/auth",
    createProxyMiddleware({
        target: "http://localhost:5008",
        changeOrigin: true,
    })
);

app.use(
    "/api/appointments",
    createProxyMiddleware({
        target:"http://localhost:5008",
        changeOrigin: true,
    })
);

// 🔹 Route: Notifications Service
app.use(
    "/api/notifications",
    createProxyMiddleware({
        target: "http://localhost:5009",
        changeOrigin: true,
    })
);

// 🔹 Route: Reviews (Comments) Service
app.use(
    "/api/reviews",
    createProxyMiddleware({
        target:  "http://localhost:5010",
        changeOrigin: true,
    })
);

app.get("/", (req, res) => {
    res.send("✅ API Gateway is running...");
});

app.listen(PORT, () => {
    console.log(`✅ API Gateway running on port ${PORT}`);
});

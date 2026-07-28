const express = require("express");
const cors = require("cors");
const firstAidRoutes = require("./routes/firstAidRoutes");

const app = express();

// ===============================
// Middlewares
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// Home Route
// ===============================
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AI First Aid Assistant API is running successfully 🚑"
    });
});

// ===============================
// API Routes
// ===============================
app.use("/api", firstAidRoutes);

// ===============================
// Export App
// ===============================
module.exports = app;
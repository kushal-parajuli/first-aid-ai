const express = require("express");
const cors = require("cors");

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
// Export App
// ===============================
module.exports = app;
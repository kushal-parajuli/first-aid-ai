require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3000;

// ===============================
// Start Server
// ===============================
app.listen(PORT, () => {
    console.log("======================================");
    console.log("🚀 AI First Aid Assistant Server Started");
    console.log(`📍 Running at: http://localhost:${PORT}`);
    console.log("======================================");
});
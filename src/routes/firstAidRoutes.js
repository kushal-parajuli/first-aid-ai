// src/routes/firstAidRoutes.js
//
// Routes only define WHICH URL maps to WHICH controller function.
// No logic lives here — that's the whole point of separating routes
// from controllers.
const express = require("express");
const router = express.Router();
const { handleFirstAidQuery } = require("../controllers/firstAidController");
const { checkHealth } = require("../controllers/healthController"); // ADD

router.post("/first-aid", handleFirstAidQuery);
router.get("/health", checkHealth); // ADD

module.exports = router;
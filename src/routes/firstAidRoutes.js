// src/routes/firstAidRoutes.js
//
// Routes only define WHICH URL maps to WHICH controller function.
// No logic lives here — that's the whole point of separating routes
// from controllers.

const express = require("express");
const router = express.Router();
const { handleFirstAidQuery } = require("../controllers/firstAidController");

router.post("/first-aid", handleFirstAidQuery);

module.exports = router;
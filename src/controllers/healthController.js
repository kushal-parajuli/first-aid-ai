// src/controllers/healthController.js
//
// Lets us (and later, a frontend) check whether Ollama is actually
// reachable, separate from whether our own Express server is up.
// Useful during development so "Something went wrong" errors don't
// leave you guessing whether the bug is in our code or Ollama itself.

const axios = require("axios");
const ollamaConfig = require("../config/ollama");

async function checkHealth(req, res) {
    try {
        // Ollama's root endpoint just returns plain text "Ollama is running"
        // if it's up — we don't need a heavy request, just a quick ping.
        await axios.get(ollamaConfig.baseUrl, { timeout: 5000 });

        return res.status(200).json({
            success: true,
            server: "running",
            ollama: "running",
        });
    } catch (error) {
        return res.status(503).json({
            success: false,
            server: "running",
            ollama: "unreachable",
            message: "The AI server (Ollama) is not responding. Make sure it's running.",
        });
    }
}

module.exports = { checkHealth };
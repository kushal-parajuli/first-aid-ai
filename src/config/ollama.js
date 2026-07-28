// src/config/ollama.js
//
// Centralized configuration for connecting to Ollama.
// No other file should hardcode a URL, model name, or timeout —
// they should all read from this file instead. If we ever switch
// to a different model or a hosted AI provider later, this is the
// only file we'd need to touch.

const ollamaConfig = {
    baseUrl: process.env.OLLAMA_URL || "http://localhost:11434",
    model: process.env.MODEL || "llama3.2",
    timeout: parseInt(process.env.OLLAMA_TIMEOUT, 10) || 60000,
    generateEndpoint: "/api/generate", // Ollama's endpoint for single-turn text generation
};

module.exports = ollamaConfig;
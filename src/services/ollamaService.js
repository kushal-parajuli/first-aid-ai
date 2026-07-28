// src/services/ollamaService.js
//
// This service's ONLY job is talking to Ollama.
// It knows nothing about first aid, prompts, or business logic —
// that separation matters because if we ever swap Ollama for a
// different AI provider, this is the only file we'd need to rewrite.

const axios = require("axios");
const ollamaConfig = require("../config/ollama");

/**
 * Sends a prompt to the Ollama model and returns the generated text.
 * @param {string} prompt - The full text prompt to send to the model.
 * @returns {Promise<string>} - The model's text response.
 */
async function generateFirstAidResponse(prompt) {
    const url = `${ollamaConfig.baseUrl}${ollamaConfig.generateEndpoint}`;

    try {
        const response = await axios.post(
            url,
            {
                model: ollamaConfig.model,
                prompt: prompt,
                stream: false,
            },
            {
                timeout: ollamaConfig.timeout,
            }
        );

        // Ollama's response shape looks like: { response: "text...", done: true, ... }
        return response.data.response;
    } catch (error) {
        // Log the FULL error detail Ollama sent back, not just the generic message.
        // error.response.data usually contains Ollama's actual reason for the failure.
        console.error("Ollama service error:", error.response?.data || error.message);
        throw new Error("Failed to get a response from the AI model.");
    }
}

module.exports = { generateFirstAidResponse };
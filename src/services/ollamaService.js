// src/services/ollamaService.js

const axios = require("axios");
const ollamaConfig = require("../config/ollama");
const firstAidPrompt = require("../prompts/firstAidPrompt");

/**
 * Sends the full conversation (system prompt + history + new question)
 * to Ollama's chat endpoint and returns the model's reply text.
 * @param {Array} history - Prior messages: [{ role, content }, ...]
 * @param {string} userQuestion - The new question from the user.
 * @returns {Promise<string>} - The model's text response.
 */
async function generateFirstAidResponse(history, userQuestion) {
    const url = `${ollamaConfig.baseUrl}/api/chat`;

    const messages = [
        { role: "system", content: firstAidPrompt },
        ...history,
        { role: "user", content: userQuestion },
    ];

    try {
        const response = await axios.post(
            url,
            {
                model: ollamaConfig.model,
                messages: messages,
                stream: false,
            },
            {
                timeout: ollamaConfig.timeout,
            }
        );

        // /api/chat responses look like: { message: { role, content }, done: true, ... }
        return response.data.message.content;
    } catch (error) {
        console.error("Ollama service error:", error.response?.data || error.message);
        throw new Error("Failed to get a response from the AI model.");
    }
}

module.exports = { generateFirstAidResponse };
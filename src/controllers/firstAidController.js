// src/controllers/firstAidController.js
//
// The controller's job: handle the HTTP request/response cycle.
// It reads what the client sent, calls the right service to do the
// actual work, and sends back a clean response. It should NOT contain
// AI logic itself — that belongs in the service layer.

const { generateFirstAidResponse } = require("../services/ollamaService");

async function handleFirstAidQuery(req, res) {
    try {
        const { question } = req.body;

        // Basic input validation — never trust incoming data.
        if (!question || typeof question !== "string" || question.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid 'question' field in the request body.",
            });
        }

        // For now, we send the raw question directly to Ollama.
        // In the next step, we'll wrap this with our first-aid system prompt
        // so the AI actually behaves like a first-aid assistant.
        const aiResponse = await generateFirstAidResponse(question);

        return res.status(200).json({
            success: true,
            answer: aiResponse,
        });
    } catch (error) {
        console.error("Controller error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while processing your request.",
        });
    }
}

module.exports = { handleFirstAidQuery };
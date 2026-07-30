// src/controllers/firstAidController.js

const { generateFirstAidResponse } = require("../services/ollamaService");
const { getHistory, addMessage } = require("../utils/conversationStore");

function extractEmergencyLevel(aiText) {
    if (aiText.includes("🔴")) return "Red";
    if (aiText.includes("🟡")) return "Yellow";
    if (aiText.includes("🟢")) return "Green";
    return "Unknown";
}

async function handleFirstAidQuery(req, res) {
    try {
        const { question, sessionId } = req.body;

        if (!question || typeof question !== "string" || question.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid 'question' field in the request body.",
            });
        }

        if (!sessionId || typeof sessionId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Please provide a 'sessionId' to track the conversation.",
            });
        }

        const history = getHistory(sessionId);
        const aiResponse = await generateFirstAidResponse(history, question);

        // Save both sides of this exchange so future questions in this
        // session have the full context.
        addMessage(sessionId, "user", question);
        addMessage(sessionId, "assistant", aiResponse);

        const emergencyLevel = extractEmergencyLevel(aiResponse);

        return res.status(200).json({
            success: true,
            answer: aiResponse,
            emergencyLevel: emergencyLevel,
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
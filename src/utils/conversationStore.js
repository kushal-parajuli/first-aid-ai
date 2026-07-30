// src/utils/conversationStore.js
//
// A simple in-memory store mapping sessionId -> conversation history.
// This is intentionally basic: it lives only in server RAM and resets
// on every restart. That's fine for a learning project — a real
// production system would use Redis or a database instead, so
// conversations survive restarts and work across multiple server instances.

const conversations = {};

/**
 * Gets the message history for a session. Returns an empty array
 * if this session hasn't talked to us before.
 */
function getHistory(sessionId) {
    return conversations[sessionId] || [];
}

/**
 * Appends a new message to a session's history.
 * role is either "user" or "assistant".
 */
function addMessage(sessionId, role, content) {
    if (!conversations[sessionId]) {
        conversations[sessionId] = [];
    }
    conversations[sessionId].push({ role, content });
}

module.exports = { getHistory, addMessage };
# AI First Aid Assistant

A standalone backend AI service that provides structured first-aid guidance using a locally-run LLM (Ollama + Llama 3.2). Built as a reusable module.

---

## Features

- Text-based first-aid Q&A with structured responses
- Refuses non-first-aid questions (stays in scope)
- Emergency level detection (Green / Yellow / Red)
- Session-based conversation memory (follow-up questions retain context)
- Ollama health check endpoint

**Not implemented (hardware-limited):** image, voice, and video input. Architecture supports adding these later without redesign.

---

## Tech Stack

- Node.js + Express.js
- Ollama (local LLM runtime) + Llama 3.2
- Axios (HTTP client to Ollama)
- dotenv (environment config)

---

## Setup

1. Install [Ollama](https://ollama.com) and pull the model:
   ```
   ollama pull llama3.2
   ```
2. Make sure Ollama is running (`http://localhost:11434`)
3. Clone this repo and install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file:
   ```
   PORT=3000
   OLLAMA_URL=http://localhost:11434
   MODEL=llama3.2
   OLLAMA_TIMEOUT=60000
   ```
5. Run the server:
   ```
   npm run dev
   ```

---

## API Endpoints

### `GET /`
Health check — confirms the API itself is running.

### `GET /api/health`
Confirms both the API and Ollama are reachable.

**Response:**
```json
{ "success": true, "server": "running", "ollama": "running" }
```

### `POST /api/first-aid`
Main endpoint — ask a first-aid question.

**Body:**
```json
{
  "question": "I burned my hand while cooking",
  "sessionId": "any-unique-string-per-user-session"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "Possible Situation\n------------------\n...",
  "emergencyLevel": "Yellow"
}
```

- `sessionId` is required — used to retain conversation context across follow-up questions.
- Non-first-aid questions return a polite refusal instead of an answer.

---

## Project Structure

```
src/
├── config/         # Ollama connection settings
├── controllers/     # Request handling logic
├── prompts/          # System prompt defining AI behavior/format
├── routes/            # Route → controller mapping
├── services/          # Ollama API communication
├── utils/              # Conversation memory store
├── app.js
└── server.js
```

---

## Known Limitations

- Conversation history is stored in-memory (resets on server restart, no size/expiry limit yet)
- No database — sessions aren't persisted
- Image/voice/video input not yet implemented (planned, hardware-blocked)
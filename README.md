# AI First Aid Assistant

A full-stack AI-powered assistant that provides structured first-aid guidance, built using a locally-run LLM (Llama 3.2 via Ollama). Designed as a standalone, reusable module for future integration into the **Smart Blood Bank System**.

---

## What This Is

This project uses Meta's open-source **Llama 3.2** model, run locally through **Ollama**, wrapped in a custom-engineered system that:

- Constrains the model to only answer first-aid and emergency questions
- Enforces a consistent, structured response format for new injuries
- Gives short, targeted follow-up answers when the user adds new details (not repeated boilerplate)
- Extracts a machine-readable emergency severity level (Green/Yellow/Red) from each response
- Remembers conversation context per session (follow-up questions work correctly)
- Serves everything through a REST API, consumed by a React frontend

---

## Features

- Text-based first-aid Q&A with structured responses
- Refuses non-first-aid questions, staying in scope
- Emergency level detection (Green / Yellow / Red)
- Session-based conversation memory (follow-ups retain context, short targeted replies)
- Ollama health check endpoint
- Responsive chat UI (React + Tailwind), dark theme
- Chat history persists in-browser for 1 hour (survives refresh, new tabs, and browser restart within that window)

**Not implemented (hardware-limited):** image, voice, and video input — deferred until vision-capable hardware is available. Backend architecture supports adding these later without redesign.

---

## Tech Stack

**Backend:** Node.js, Express.js, Ollama (Llama 3.2), Axios, dotenv
**Frontend:** React (Vite), Tailwind CSS

---

## Project Structure

```
AI/
├── src/
│   ├── config/          # Ollama connection settings (ollama.js)
│   ├── controllers/      # Request handling logic
│   │   ├── firstAidController.js
│   │   └── healthController.js
│   ├── prompts/           # System prompt defining AI behavior/format
│   │   └── firstAidPrompt.js
│   ├── routes/             # Route → controller mapping
│   │   └── firstAidRoutes.js
│   ├── services/           # Ollama API communication
│   │   └── ollamaService.js
│   ├── utils/               # Conversation memory store
│   │   └── conversationStore.js
│   ├── app.js
│   └── server.js
├── client/                  # React + Tailwind frontend
│   └── src/
│       ├── App.jsx           # Main chat UI
│       ├── index.css
│       └── main.jsx
├── .env                        # Backend environment config (not committed)
└── package.json
```

---

## How to Run This Project (Full Setup)

### Prerequisites

- [Node.js](https://nodejs.org) installed
- [Ollama](https://ollama.com) installed

### 1. Clone the repo

```
git clone https://github.com/kushal-parajuli/first-aid-ai.git
cd first-aid-ai
```

### 2. Set up Ollama

```
ollama pull llama3.2
```

Start Ollama (if not already running as a background service):

```
ollama serve
```

**If you have an older/low-VRAM NVIDIA GPU (e.g. MX-series) and see CUDA crashes**, force CPU-only mode by setting these as permanent environment variables on your system, then restart Ollama:

```
CUDA_VISIBLE_DEVICES=-1
OLLAMA_VULKAN=0
```

### 3. Set up the backend

From the project root:

```
npm install
```

Create a `.env` file in the project root:

```
PORT=3000
OLLAMA_URL=http://localhost:11434
MODEL=llama3.2
OLLAMA_TIMEOUT=90000
```

Run the backend:

```
npm run dev
```

You should see:
```
🚀 AI First Aid Assistant Server Started
📍 Running at: http://localhost:3000
```

### 4. Set up the frontend

In a **new terminal**:

```
cd client
npm install
npm run dev
```

Open the URL it gives you (usually `http://localhost:5173`).

### 5. You're ready

With Ollama, the backend, and the frontend all running, open the frontend URL in your browser and start asking first-aid questions.

---

## API Endpoints

### `GET /`
Confirms the API itself is running.

### `GET /api/health`
Confirms both the API and Ollama are reachable.

```json
{ "success": true, "server": "running", "ollama": "running" }
```

### `POST /api/first-aid`
Main endpoint — ask a first-aid question.

**Request:**
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

## Known Limitations

- Conversation history (backend) is stored in-memory — resets on server restart, no size/expiry limit yet
- No database — sessions aren't persisted server-side
- Frontend chat history is saved in the browser's localStorage for 1 hour, then cleared — a convenience feature, not secure storage
- Image/voice/video input not yet implemented (planned, hardware-blocked)
- CPU-only inference on low-VRAM machines is noticeably slower on the first request after starting Ollama (model load time)

---

## Roadmap

- [x] Project setup & clean architecture
- [x] AI system prompt with structured responses
- [x] Text-based first aid Q&A
- [x] Conversation memory
- [x] React + Tailwind frontend
- [ ] Image analysis (blocked on hardware)
- [ ] Voice input/output (blocked on hardware)
- [ ] Video understanding (blocked on hardware)
- [ ] Integration into Smart Blood Bank System
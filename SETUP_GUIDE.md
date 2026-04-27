# 🚀 Nexus SDLC Orchestrator - Execution Guide

Welcome to the **Nexus SDLC Orchestrator**. This guide will help you get the system up and running in minutes.

---

## ⚡ Quick Start (TL;DR)

1.  **Ollama**: `ollama run llama3`
2.  **Backend**: `cd backend && npm install && npm start`
3.  **Frontend**: `cd frontend && npm install && npm run dev`

---

## 📋 Detailed Setup Instructions

Follow these steps in order to ensure a smooth experience.

### 1. 🧠 AI Engine (Ollama)
The orchestrator uses **Llama 3** locally for maximum privacy and speed.
*   **Install Ollama**: Download from [ollama.com](https://ollama.com).
*   **Pull Model**: Run the following in your terminal:
    ```bash
    ollama run llama3
    ```
*   *Note: If you don't have Ollama, the system will automatically use **Fallback Mode** (pre-defined templates) so you can still explore the UI.*

### 2. ⚙️ Backend API Server
The backend handles the agent logic, project persistence, and AI orchestration.
1.  Open a **new terminal**.
2.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Launch the server:
    ```bash
    npm start
    ```
    *The API will be live at `http://localhost:5000`*

### 3. 🎨 Frontend Interface
The high-fidelity dashboard where you interact with the agents.
1.  Open a **third terminal**.
2.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Launch the development server:
    ```bash
    npm run dev
    ```
    *The dashboard will be available at the URL shown in your terminal (usually `http://localhost:5173`)*

---

## 🛠️ Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **Port 5000 already in use** | The backend will try to use 5000. Close any other Node processes or change the port in `backend/server.js`. |
| **Ollama connection failed** | Ensure Ollama is running and you have run `ollama run llama3` at least once. |
| **Node version error** | Ensure you are using Node.js v18 or higher. |

---

## 🌟 How to use the Swarm
1.  **Sign Up**: Create a local account on the login page.
2.  **Project Intake**: Go to the intake form and describe your software idea.
3.  **Deploy Agents**: Hit "Generate" and navigate to the **Live Agents** view.
4.  **Review Artifacts**: Once complete, explore the **Artifact Hub** to see your SRS, Architecture, and DevOps scripts.

---
*Built with ❤️ for the future of automated SDLC.*

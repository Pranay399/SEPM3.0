# Nexus SDLC Orchestrator

Nexus SDLC Orchestrator is a full-stack, multi-agent AI pipeline designed to automate the Software Development Lifecycle (SDLC). It uses a sequence of 6 AI agents (Analyst, Strategist, Architect, QA/QC, DevOps, TaskMaster) to automatically generate comprehensive project artifacts from a simple problem statement.

## 🚀 Features
- **Multi-Agent AI Swarm**: 6 specialized agents working sequentially to build out your project.
- **Local LLM Integration**: Powered by Ollama (`llama3`) for private, local AI generation.
- **Resilient Architecture**: Includes a sophisticated fallback engine if your local LLM is offline.
- **High-Fidelity Dashboards**: Dedicated command centers for each agent (QA/QC, DevOps, Architect) built with a premium "Digital Architect" design system.
- **Real-Time Monitoring**: Watch the agents process tasks and view their live progress.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **Ollama** (Required for the AI generation, though the app works in fallback mode without it)

---

## 💻 How to Run the Project

You will need to open **three separate terminal windows** to run the complete stack.

### 1. Start the Local AI Model (Ollama)
In your first terminal, run:
```bash
ollama run llama3
```
*Note: The first time you run this, it will download the 4.7GB model. This may take several minutes depending on your internet connection. Once downloaded, it will start a prompt. You can just leave this terminal open.*

*💡 **Fallback Mode**: If you don't want to wait for the download or if Ollama is closed, the backend will automatically use its built-in templating engine as a fallback so the app never crashes!*

### 2. Start the Backend API Server
Open a second terminal, navigate to the `backend` folder, install dependencies, and start the server:
```bash
cd backend
npm install
npm start
```
The backend server will run on `http://localhost:5000`.

### 3. Start the Frontend React App
Open a third terminal, navigate to the `frontend` folder, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
The frontend will usually run on `http://localhost:5173` (or `http://localhost:5174` if 5173 is in use). 

---

## 🎮 How to Use the App

1. **Open your browser** to the frontend URL (e.g., `http://localhost:5174`).
2. **Sign Up**: Since the app features JWT authentication, click "Sign up" to create a new local account.
3. **Create a Project**: Navigate to **Project Intake** on the sidebar. Fill out a simple problem statement (e.g., "Build an AI support bot") and submit.
4. **Watch the Swarm**: You will be redirected to the **Live Agents** dashboard where you can watch the 6 AI agents execute sequentially.
5. **Explore Dashboards**: Click on the specific agent dashboards (Architect, QA/QC, DevOps) in the sidebar to see their high-fidelity outputs, or go to the **Artifact Hub** to view all generated documents.

---

## 🏗️ Tech Stack
- **Frontend**: React 18, Vite, React Router DOM
- **Backend**: Node.js, Express
- **AI Engine**: Ollama (Llama 3 API)
- **Storage**: Local JSON persistence (self-contained, no external DB required)

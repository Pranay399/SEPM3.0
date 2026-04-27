# Nexus SDLC Orchestrator: Team Work Breakdown (5 Students)

To successfully manage and expand the Nexus SDLC Orchestrator, here is a recommended division of roles and responsibilities.

---

### 👤 Student 1: Requirements & Strategy Lead (Product Owner)
**Core Focus**: Project Definition & High-Level Planning
- **Responsibilities**:
    - Managing the **Project Intake** process and input validation.
    - Overseeing the **Analyst Agent** (SRS generation) and **Strategist Agent** (Methodology).
    - Ensuring the generated functional/non-functional requirements align with user intent.
- **Key Files**: `ProjectIntakePage.jsx`, `analyst.js`, `strategist.js`.

### 👤 Student 2: System Architect & Security Engineer
**Core Focus**: Technical Blueprint & Infrastructure Design
- **Responsibilities**:
    - Designing the **Architect Agent** logic for tech stack and security decisions.
    - Managing the **Architecture Dashboard** and PDF export features.
    - Ensuring security architecture (authentication, encryption) is correctly defined in artifacts.
- **Key Files**: `ArchitectDashboard.jsx`, `architect.js`, `AuthContext.js`.

### 👤 Student 3: Backend & AI Engine Core Developer
**Core Focus**: System Integration & AI Orchestration
- **Responsibilities**:
    - Maintaining the **Express.js API** and the **Agent Pipeline** (`pipeline.js`).
    - Optimizing the **LLM Engine** (`engine.js`) for better JSON parsing and retry logic.
    - Managing local storage and data persistence (`projects.json`, `artifacts/`).
- **Key Files**: `backend/server.js`, `backend/llm/engine.js`, `backend/agents/pipeline.js`.

### 👤 Student 4: Frontend UI/UX & QA Engineer
**Core Focus**: Dashboard Experience & Quality Control
- **Responsibilities**:
    - Developing and polishing the **Live Agent Dashboard** and **QA/QC Dashboard**.
    - Implementing the **QA Agent** logic (Test case generation).
    - Managing CSS Design System (`index.css`) and responsive layouts.
- **Key Files**: `LiveAgentDashboard.jsx`, `QADashboard.jsx`, `qaqc.js`, `index.css`.

### 👤 Student 5: DevOps & Project Tracking Lead
**Core Focus**: Lifecycle Management & Delivery
- **Responsibilities**:
    - Overseeing the **DevOps Agent** (CI/CD, ITIL) and **Taskmaster Agent** (WBS/Roadmap).
    - Managing the **DevOps Dashboard** and **Project Tracking** (Gantt/Task list) views.
    - Handling Git repository maintenance and deployment workflows.
- **Key Files**: `DevOpsDashboard.jsx`, `ProjectTracking.jsx`, `devops.js`, `taskmaster.js`.

---

### 🤝 Collaborative Tasks (All Students)
1. **Prompt Engineering**: Every student should fine-tune the system prompts for their respective agents.
2. **Integration Testing**: Ensuring data flows correctly from Student 1's SRS to Student 5's Roadmap.
3. **Documentation**: Each student documents their respective agent's logic and dashboard features.

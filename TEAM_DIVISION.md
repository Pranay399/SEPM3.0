# Nexus SDLC Orchestrator: Team Work Breakdown (5 Students)

To successfully manage and expand the Nexus SDLC Orchestrator, here is a recommended division of roles and responsibilities based on the actual project architecture and file structure.

---

### 👤 Student 1: Requirements & Strategy Lead (Product Owner)
**Core Focus**: Project Definition, High-Level Planning, & API Routes
- **Responsibilities**:
    - Managing the **Project Intake** process and frontend input validation.
    - Handling backend project routes (creation, fetching project state).
    - Overseeing the **Artifact Viewer** to ensure generated documents (SRS, Methodology) display correctly.
- **Key Files**: 
    - `frontend/src/pages/ProjectIntakePage.jsx`
    - `frontend/src/pages/ArtifactViewer.jsx`
    - `backend/routes/projects.js`

### 👤 Student 2: System Architect & Security Engineer
**Core Focus**: Authentication, Security, & Architecture Dashboard
- **Responsibilities**:
    - Implementing and maintaining the authentication flow (Login Page, Auth Context).
    - Managing backend authentication routes and session security.
    - Overseeing the **Architecture Dashboard** for displaying tech stack and security decisions.
- **Key Files**: 
    - `frontend/src/pages/ArchitectDashboard.jsx`
    - `frontend/src/pages/LoginPage.jsx`
    - `frontend/src/context/AuthContext.jsx`
    - `backend/routes/auth.js`

### 👤 Student 3: Backend & AI Engine Core Developer
**Core Focus**: System Integration, LLM Orchestration, & Prompts
- **Responsibilities**:
    - Maintaining the core **Express.js API** server.
    - Optimizing the **LLM Engine**, managing the centralized system prompts for *all* agents, and handling retry/fallback logic.
    - Managing the sequential agent execution pipeline and local JSON storage.
- **Key Files**: 
    - `backend/server.js`
    - `backend/llm/engine.js`
    - `backend/agents/pipeline.js`
    - `backend/utils/storage.js`
    - `frontend/src/utils/api.js`

### 👤 Student 4: Frontend UI/UX & QA Engineer
**Core Focus**: Dashboard Experience, Design System, & Quality Control
- **Responsibilities**:
    - Developing and polishing the **Live Agent Dashboard** and **QA/QC Dashboard**.
    - Managing the global CSS Design System and responsive navigation components.
    - Managing the backend evaluation scripts that assess project data.
- **Key Files**: 
    - `frontend/src/index.css`
    - `frontend/src/pages/LiveAgentDashboard.jsx`
    - `frontend/src/pages/QADashboard.jsx`
    - `frontend/src/components/Sidebar.jsx`
    - `frontend/src/components/TopNav.jsx`
    - `backend/utils/evaluate.js`

### 👤 Student 5: DevOps & Project Tracking Lead
**Core Focus**: Lifecycle Management, Tracking, & App Routing
- **Responsibilities**:
    - Managing the **DevOps Dashboard** (CI/CD pipelines, monitoring alerts).
    - Overseeing the **Project Tracking Dashboard** (Gantt charts, task lists).
    - Managing root React application routing and project dependencies.
- **Key Files**: 
    - `frontend/src/pages/DevOpsDashboard.jsx`
    - `frontend/src/pages/ProjectTracking.jsx`
    - `frontend/src/App.jsx`
    - `backend/package.json` & `frontend/package.json`

---

### 🤝 Collaborative Tasks (All Students)
1. **Prompt Engineering**: While Student 3 manages `engine.js`, every student should collaborate on fine-tuning the system prompts for their respective domains (Analyst, Architect, QA, etc.).
2. **Integration Testing**: Ensuring data flows correctly from the backend storage to the frontend dashboard components.
3. **Documentation**: Each student is responsible for commenting their assigned files and updating the README/Setup guides when modifying dependencies.

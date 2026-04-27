const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/auth');
const { readData, writeData, writeArtifact, getProjectArtifacts } = require('../utils/storage');
const agentPipeline = require('../agents/pipeline');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/projects — List all projects for the current user
router.get('/', (req, res) => {
  const projects = readData('projects');
  const userProjects = projects.filter(p => p.userId === req.user.id);
  res.json({ projects: userProjects });
});

// GET /api/projects/:id — Get a single project
router.get('/:id', (req, res) => {
  const projects = readData('projects');
  const project = projects.find(p => p.id === req.params.id && p.userId === req.user.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  // Attach pipeline state if available
  const pipelineState = agentPipeline.getPipelineState(project.id);
  const artifacts = getProjectArtifacts(project.id);

  res.json({ project, pipelineState, artifacts });
});

// POST /api/projects — Create a new project & trigger agent pipeline
router.post('/', async (req, res) => {
  try {
    const { name, problemStatement, targetAudience, complexity, goals } = req.body;

    if (!name || !problemStatement) {
      return res.status(400).json({ error: 'Project name and problem statement are required' });
    }

    const project = {
      id: uuidv4(),
      name,
      problemStatement,
      targetAudience: targetAudience || 'external_b2b',
      complexity: complexity || 'medium',
      goals: goals || '',
      userId: req.user.id,
      status: 'processing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const projects = readData('projects');
    projects.push(project);
    writeData('projects', projects);

    // Start pipeline execution (non-blocking)
    agentPipeline.executePipeline(project.id, project, (projectId, state) => {
      // Save artifacts as they complete
      for (const [agentId, agentState] of Object.entries(state.agents)) {
        if (agentState.status === 'completed' && agentState.output) {
          writeArtifact(projectId, agentId, agentState.output);
        }
      }

      // Update project status when pipeline completes
      if (state.status === 'completed' || state.status === 'error') {
        const projects = readData('projects');
        const idx = projects.findIndex(p => p.id === projectId);
        if (idx !== -1) {
          projects[idx].status = state.status === 'completed' ? 'completed' : 'error';
          projects[idx].updatedAt = new Date().toISOString();
          writeData('projects', projects);
        }
      }
    }).catch(err => {
      console.error(`Pipeline error for project ${project.id}:`, err);
    });

    res.status(201).json({ project, message: 'Project created. Agent pipeline started.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project', details: error.message });
  }
});

// GET /api/projects/:id/agents — Get agent pipeline status for a project
router.get('/:id/agents', (req, res) => {
  const pipelineState = agentPipeline.getPipelineState(req.params.id);
  if (!pipelineState) {
    // Return default pending state
    const agents = agentPipeline.getAgentDefinitions().map(a => ({
      ...a,
      status: 'pending',
      progress: 0,
      activity: 'Not started',
    }));
    return res.json({ agents, pipelineStatus: 'idle' });
  }

  res.json({
    agents: Object.values(pipelineState.agents),
    pipelineStatus: pipelineState.status,
    startedAt: pipelineState.startedAt,
    completedAt: pipelineState.completedAt,
  });
});

// GET /api/projects/:id/artifacts — Get all generated artifacts
router.get('/:id/artifacts', (req, res) => {
  const artifacts = getProjectArtifacts(req.params.id);
  res.json({ artifacts });
});

// GET /api/projects/:id/artifacts/:agentId — Get specific agent's artifact
router.get('/:id/artifacts/:agentId', (req, res) => {
  const { readArtifact } = require('../utils/storage');
  const artifact = readArtifact(req.params.id, req.params.agentId);
  if (!artifact) {
    return res.status(404).json({ error: 'Artifact not found' });
  }
  res.json({ artifact });
});

module.exports = router;

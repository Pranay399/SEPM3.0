/**
 * Agent Pipeline Orchestrator
 * Runs agents sequentially: Analyst → Strategist → Architect → QA/QC → DevOps → TaskMaster
 * Each agent receives the output of previous agents as context.
 */

const llmEngine = require('../llm/engine');

const AGENT_DEFINITIONS = [
  { id: 'analyst',    name: 'Analyst',    subtitle: 'Requirements & Data', icon: 'person_search',  order: 1 },
  { id: 'strategist', name: 'Strategist', subtitle: 'Solution Planning',   icon: 'lightbulb',      order: 2 },
  { id: 'architect',  name: 'Architect',  subtitle: 'System Design',       icon: 'architecture',   order: 3 },
  { id: 'qaqc',       name: 'QA/QC',      subtitle: 'Test Strategy',       icon: 'bug_report',     order: 4 },
  { id: 'devops',     name: 'DevOps',     subtitle: 'Infrastructure',      icon: 'cloud_sync',     order: 5 },
  { id: 'taskmaster', name: 'TaskMaster', subtitle: 'Ticket Generation',   icon: 'fact_check',     order: 6 },
];

class AgentPipeline {
  constructor() {
    this.runningPipelines = new Map(); // projectId -> pipeline state
  }

  /**
   * Get agent metadata
   */
  getAgentDefinitions() {
    return AGENT_DEFINITIONS;
  }

  /**
   * Execute the full sequential pipeline for a project
   */
  async executePipeline(projectId, projectData, onProgress) {
    const pipelineState = {
      projectId,
      status: 'running',
      startedAt: new Date().toISOString(),
      agents: {},
      outputs: {},
    };

    // Initialize all agents as "pending"
    for (const agent of AGENT_DEFINITIONS) {
      pipelineState.agents[agent.id] = {
        ...agent,
        status: 'pending',
        progress: 0,
        activity: 'Waiting...',
        output: null,
        startedAt: null,
        completedAt: null,
      };
    }

    this.runningPipelines.set(projectId, pipelineState);

    // Execute sequentially
    const previousOutputs = {};

    for (const agent of AGENT_DEFINITIONS) {
      try {
        // Mark agent as running
        pipelineState.agents[agent.id].status = 'running';
        pipelineState.agents[agent.id].startedAt = new Date().toISOString();
        pipelineState.agents[agent.id].activity = this._getRunningActivity(agent.id);
        pipelineState.agents[agent.id].progress = 10;

        if (onProgress) onProgress(projectId, pipelineState);

        // Simulate progressive work (3 stages)
        await this._simulateWork(300);
        pipelineState.agents[agent.id].progress = 40;
        if (onProgress) onProgress(projectId, pipelineState);

        await this._simulateWork(400);
        pipelineState.agents[agent.id].progress = 70;
        if (onProgress) onProgress(projectId, pipelineState);

        // Generate output via LLM engine
        const output = await llmEngine.generate(agent.id, projectData, previousOutputs);
        previousOutputs[agent.id] = output;

        await this._simulateWork(300);

        // Mark agent as complete
        pipelineState.agents[agent.id].status = 'completed';
        pipelineState.agents[agent.id].progress = 100;
        pipelineState.agents[agent.id].activity = this._getCompletedActivity(agent.id);
        pipelineState.agents[agent.id].output = output;
        pipelineState.agents[agent.id].completedAt = new Date().toISOString();
        pipelineState.outputs[agent.id] = output;

        if (onProgress) onProgress(projectId, pipelineState);

      } catch (error) {
        pipelineState.agents[agent.id].status = 'error';
        pipelineState.agents[agent.id].activity = `Error: ${error.message}`;
        pipelineState.status = 'error';
        this.runningPipelines.set(projectId, pipelineState);
        throw error;
      }
    }

    pipelineState.status = 'completed';
    pipelineState.completedAt = new Date().toISOString();
    this.runningPipelines.set(projectId, pipelineState);

    // Final callback to update project status in DB
    if (onProgress) onProgress(projectId, pipelineState);

    return pipelineState;
  }

  /**
   * Get current state of a pipeline
   */
  getPipelineState(projectId) {
    return this.runningPipelines.get(projectId) || null;
  }

  /**
   * Get all pipeline states
   */
  getAllPipelines() {
    return Object.fromEntries(this.runningPipelines);
  }

  _getRunningActivity(agentId) {
    const activities = {
      analyst: 'Analyzing requirements & extracting user stories...',
      strategist: 'Evaluating methodology & building roadmap...',
      architect: 'Designing system topology & tech stack...',
      qaqc: 'Generating test cases & QA guidelines...',
      devops: 'Configuring CI/CD pipeline & deployment strategy...',
      taskmaster: 'Breaking down tasks & allocating resources...',
    };
    return activities[agentId] || 'Processing...';
  }

  _getCompletedActivity(agentId) {
    const activities = {
      analyst: 'Completed SRS & Requirements Analysis',
      strategist: 'Finalized Strategy & Roadmap',
      architect: 'Completed System Architecture Design',
      qaqc: 'Generated Test Strategy & Cases',
      devops: 'Configured DevOps & ITIL Processes',
      taskmaster: 'Completed Task Breakdown & Sprint Plan',
    };
    return activities[agentId] || 'Completed';
  }

  _simulateWork(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new AgentPipeline();

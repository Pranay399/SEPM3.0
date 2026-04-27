import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AGENT_ICONS = {
  analyst: 'person_search',
  strategist: 'lightbulb',
  architect: 'architecture',
  qaqc: 'bug_report',
  devops: 'cloud_sync',
  taskmaster: 'fact_check',
};

export default function LiveAgentDashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [agents, setAgents] = useState([]);
  const [pipelineStatus, setPipelineStatus] = useState('idle');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch projects
  useEffect(() => {
    api.get('/projects').then(res => {
      setProjects(res.data.projects);
      if (res.data.projects.length > 0) {
        setSelectedProject(res.data.projects[0]);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Poll agent status for selected project
  useEffect(() => {
    if (!selectedProject) return;

    const fetchAgents = () => {
      api.get(`/projects/${selectedProject.id}/agents`).then(res => {
        setAgents(res.data.agents);
        setPipelineStatus(res.data.pipelineStatus);
      }).catch(() => {});
    };

    fetchAgents();
    const interval = setInterval(fetchAgents, 2000);
    return () => clearInterval(interval);
  }, [selectedProject]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'var(--success)';
      case 'running': return 'var(--primary-container)';
      case 'error': return 'var(--error)';
      default: return 'var(--outline)';
    }
  };

  const getCardStyle = (agent) => {
    const isActive = agent.status === 'running';
    const isDone = agent.status === 'completed';
    const isPending = agent.status === 'pending';
    return {
      background: isPending ? 'var(--surface-container-low)' : 'var(--surface-container-lowest)',
      border: `1px solid ${isActive ? 'var(--primary-container)' : 'var(--outline-variant)'}`,
      borderStyle: isPending ? 'dashed' : 'solid',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-md)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      opacity: isPending ? 0.75 : 1,
      position: 'relative',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s, border-color 0.3s',
      boxShadow: isActive ? '0 2px 12px rgba(24, 104, 219, 0.1)' : 'none',
    };
  };

  if (loading) {
    return (
      <div className="layout-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="material-symbols-outlined animate-spin" style={{ fontSize: '32px', color: 'var(--primary-container)' }}>sync</span>
      </div>
    );
  }

  return (
    <div className="layout-main">
      <div className="layout-main-wide animate-slide-up">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
          <div>
            <h1 className="text-headline-xl" style={{ color: 'var(--on-background)', marginBottom: '4px' }}>Active Swarm</h1>
            <p className="text-body-md" style={{ color: 'var(--on-surface-variant)' }}>
              {selectedProject
                ? `Monitoring 6 AI agents collaborating on ${selectedProject.name}.`
                : 'No projects yet. Create one to start the agent pipeline.'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Project Selector */}
            {projects.length > 1 && (
              <select
                className="select-field"
                style={{ width: '200px', height: '32px', fontSize: '12px' }}
                value={selectedProject?.id || ''}
                onChange={e => {
                  const proj = projects.find(p => p.id === e.target.value);
                  setSelectedProject(proj);
                }}
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}
            {/* Status Badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '4px 12px',
              background: 'var(--surface-container-high)',
              border: '1px solid var(--outline-variant)',
              borderRadius: 'var(--radius-default)',
            }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: pipelineStatus === 'completed' ? 'var(--success)' : pipelineStatus === 'running' ? 'var(--primary-container)' : 'var(--outline)',
              }} className={pipelineStatus === 'running' ? 'animate-pulse' : ''} />
              <span className="text-label-md" style={{ color: 'var(--on-surface)' }}>
                {pipelineStatus === 'completed' ? 'Pipeline Complete' : pipelineStatus === 'running' ? 'Processing...' : pipelineStatus === 'error' ? 'Error' : 'System Optimal'}
              </span>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {!selectedProject && (
          <div className="card" style={{ textAlign: 'center', padding: '64px 32px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--outline-variant)', marginBottom: '16px' }}>smart_toy</span>
            <h2 className="text-headline-md" style={{ color: 'var(--on-surface)', marginBottom: '8px' }}>No Active Projects</h2>
            <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', marginBottom: '24px' }}>Create your first project to unleash the AI agent swarm.</p>
            <button className="btn btn-primary" onClick={() => navigate('/intake')}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
              New Project
            </button>
          </div>
        )}

        {/* Agent Grid */}
        {selectedProject && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {agents.map((agent, idx) => (
              <div key={agent.id} style={getCardStyle(agent)} className="animate-fade-in">
                {/* Active indicator bar */}
                {agent.status === 'running' && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: 'var(--primary-container)' }} />
                )}

                <div>
                  {/* Agent Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px',
                        borderRadius: 'var(--radius-default)',
                        background: agent.status === 'running' ? 'var(--primary-container)' :
                                   agent.status === 'completed' ? 'var(--secondary-container)' :
                                   'var(--surface-container-highest)',
                        color: agent.status === 'running' ? 'var(--on-primary-container)' :
                               agent.status === 'completed' ? 'var(--on-secondary-container)' :
                               'var(--on-surface-variant)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span className="material-symbols-outlined icon-fill">{AGENT_ICONS[agent.id] || 'smart_toy'}</span>
                      </div>
                      <div>
                        <h3 className="text-headline-sm" style={{ color: 'var(--on-surface)' }}>{agent.name}</h3>
                        <p className="text-label-md" style={{ color: 'var(--outline)' }}>{agent.subtitle}</p>
                      </div>
                    </div>
                    <button
                      className={`btn ${agent.status === 'running' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{
                        height: '28px', fontSize: '11px',
                        opacity: agent.status === 'pending' ? 0.5 : 1,
                        cursor: agent.status === 'pending' ? 'not-allowed' : 'pointer',
                      }}
                      disabled={agent.status === 'pending'}
                      onClick={() => {
                        if (agent.status === 'completed') {
                          navigate('/artifacts', { state: { projectId: selectedProject.id, agentId: agent.id } });
                        }
                      }}
                    >
                      View Output
                    </button>
                  </div>

                  {/* Current Activity */}
                  <div style={{ marginBottom: '8px' }}>
                    <span className="text-label-md" style={{ color: 'var(--outline)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Current Activity
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {agent.status === 'running' && (
                        <span className="material-symbols-outlined animate-spin" style={{ fontSize: '16px', color: 'var(--primary-container)' }}>sync</span>
                      )}
                      {agent.status === 'pending' && (
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--outline)' }}>hourglass_empty</span>
                      )}
                      <p className="text-body-md" style={{
                        color: agent.status === 'pending' ? 'var(--on-surface-variant)' : 'var(--on-surface)',
                        fontWeight: agent.status === 'pending' ? 400 : 500,
                        fontStyle: agent.status === 'pending' ? 'italic' : 'normal',
                      }}>
                        {agent.activity || 'Waiting...'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className="text-label-md" style={{ color: 'var(--on-surface-variant)' }}>Progress</span>
                    <span className="text-label-md" style={{ color: 'var(--on-surface-variant)' }}>{agent.progress || 0}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{
                      width: `${agent.progress || 0}%`,
                      background: agent.status === 'completed' ? 'var(--success)' : 'var(--primary-container)',
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

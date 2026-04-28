import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const STATUS_STYLES = {
  'Done': { bg: 'var(--success-bg)', color: '#065f46' },
  'In Progress': { bg: 'var(--primary-fixed)', color: 'var(--on-primary-fixed)' },
  'To Do': { bg: 'var(--surface-container-highest)', color: 'var(--on-surface)' },
};

const PRIORITY_CONFIG = {
  'Highest': { icon: 'keyboard_double_arrow_up', color: 'var(--error)' },
  'High': { icon: 'keyboard_arrow_up', color: 'var(--error)' },
  'Medium': { icon: 'keyboard_arrow_up', color: 'var(--on-surface-variant)' },
  'Low': { icon: 'keyboard_arrow_down', color: 'var(--on-surface-variant)' },
};

const AGENT_ICONS = {
  'DevOps': { icon: 'cloud', bg: 'var(--primary-fixed)' },
  'Backend': { icon: 'code', bg: 'var(--primary-fixed)' },
  'Frontend': { icon: 'web', bg: 'var(--secondary-fixed)' },
  'QA': { icon: 'bug_report', bg: 'var(--secondary-fixed)' },
  'Analyst': { icon: 'person_search', bg: 'var(--tertiary-fixed)' },
  'Architect': { icon: 'architecture', bg: 'var(--primary-fixed-dim)' },
};

export default function ProjectTracking() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProjects = useCallback(() => {
    api.get('/projects').then(res => {
      setProjects(res.data.projects);
      if (res.data.projects.length > 0 && !selectedProject) {
        setSelectedProject(res.data.projects[0]);
      } else if (res.data.projects.length === 0) {
        setLoading(false);
      }
    });
  }, [selectedProject]);

  const fetchTasks = useCallback(() => {
    if (!selectedProject) return;
    setRefreshing(true);
    api.get(`/projects/${selectedProject.id}/artifacts/taskmaster`).then(res => {
      const breakdown = res.data.artifact?.sections?.taskBreakdown || [];
      setTasks(breakdown);
      setLoading(false);
      setRefreshing(false);
    }).catch(() => {
      setTasks([]);
      setLoading(false);
      setRefreshing(false);
    });
  }, [selectedProject]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleRefresh = () => {
    fetchTasks();
  };

  const getStatusStyle = (status) => STATUS_STYLES[status] || STATUS_STYLES['To Do'];
  const getPriorityConfig = (priority) => PRIORITY_CONFIG[priority] || PRIORITY_CONFIG['Medium'];
  const getAgentConfig = (agent) => AGENT_ICONS[agent] || { icon: 'smart_toy', bg: 'var(--surface-container-highest)' };

  return (
    <div className="layout-main">
      <div className="layout-main-wide animate-slide-up">
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--on-surface-variant)', marginBottom: '4px', fontSize: '12px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>inventory_2</span>
                <span>Project Management</span>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{selectedProject?.name || 'Loading...'}</span>
              </div>
              <h1 className="text-headline-xl" style={{ color: 'var(--on-surface)' }}>TaskMaster Backlog</h1>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select
                className="text-label-lg"
                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--outline-variant)', color: 'var(--primary)', cursor: 'pointer', padding: '2px 4px', width: '180px' }}
                value={selectedProject?.id || ''}
                onChange={e => {
                  setLoading(true);
                  setSelectedProject(projects.find(p => p.id === e.target.value));
                }}
              >
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              
              <button 
                className={`btn ${refreshing ? 'btn-ghost' : 'btn-secondary'}`} 
                style={{ height: '36px' }}
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <span className={`material-symbols-outlined ${refreshing ? 'animate-spin' : ''}`} style={{ fontSize: '18px' }}>sync</span>
                {refreshing ? 'Syncing...' : 'Sync Tasks'}
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{
          background: 'var(--surface-container-lowest)',
          border: '1px solid var(--outline-variant)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-1)'
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr 180px 140px 140px',
            gap: '12px',
            padding: '12px 20px',
            background: 'var(--surface-container-low)',
            borderBottom: '1px solid var(--outline-variant)',
            alignItems: 'center',
          }}>
            {['Key', 'Task Name', 'Assigned Agent', 'Status', 'Priority'].map(col => (
              <div key={col}>
                <span className="text-label-md" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.08em', fontWeight: 700 }}>
                  {col}
                </span>
              </div>
            ))}
          </div>

          {/* Table Body */}
          <div style={{ minHeight: '300px' }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px' }}>
                <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid var(--surface-variant)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
                <p className="text-label-lg text-on-surface-variant">Accessing task database...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px', color: 'var(--on-surface-variant)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--outline-variant)', marginBottom: '16px' }}>checklist_rtl</span>
                <h3 className="text-headline-sm" style={{ color: 'var(--on-surface)', marginBottom: '8px' }}>No Tasks Generated</h3>
                <p className="text-body-md" style={{ maxWidth: '400px', margin: '0 auto' }}>
                  The TaskMaster Agent hasn't processed this project yet. Please ensure the pipeline is complete.
                </p>
              </div>
            ) : (
              tasks.map((task, idx) => {
                const statusStyle = getStatusStyle(task.status);
                const priorityConfig = getPriorityConfig(task.priority);
                const agentConfig = getAgentConfig(task.agent);
                return (
                  <div
                    key={task.key || idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '100px 1fr 180px 140px 140px',
                      gap: '12px',
                      padding: '14px 20px',
                      borderBottom: idx < tasks.length - 1 ? '1px solid var(--outline-variant)' : 'none',
                      alignItems: 'center',
                      transition: 'background 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-container-low)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Key */}
                    <div>
                      <span className="text-code-sm" style={{ color: 'var(--primary)', fontWeight: 700 }}>{task.key || `TASK-${idx+1}`}</span>
                    </div>

                    {/* Task Name */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: '16px' }}>
                      <span className="text-body-md" style={{ color: 'var(--on-surface)', fontWeight: 500, lineHeight: '1.4' }}>{task.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: 'var(--surface-container-high)', color: 'var(--on-surface-variant)' }}>
                          {task.estimate || '3 pts'}
                        </span>
                      </div>
                    </div>

                    {/* Agent */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '8px',
                        background: agentConfig.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        border: '1px solid var(--outline-variant)'
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{agentConfig.icon}</span>
                      </div>
                      <span className="text-label-lg" style={{ color: 'var(--on-surface)' }}>{task.agent} Agent</span>
                    </div>

                    {/* Status */}
                    <div>
                      <span className="chip" style={{ 
                        background: statusStyle.bg, 
                        color: statusStyle.color,
                        fontWeight: 600,
                        fontSize: '11px'
                      }}>
                        {task.status}
                      </span>
                    </div>

                    {/* Priority */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: priorityConfig.color }}>
                      <span className="material-symbols-outlined icon-fill" style={{ fontSize: '18px' }}>{priorityConfig.icon}</span>
                      <span className="text-label-lg" style={{ fontWeight: 500 }}>{task.priority}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {tasks.length > 0 && (
            <div style={{
              padding: '12px 20px',
              borderTop: '1px solid var(--outline-variant)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '13px',
              color: 'var(--on-surface-variant)',
              background: 'var(--surface-container-lowest)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>info</span>
                <span>Showing {tasks.length} optimized tickets generated by TaskMaster AI.</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-ghost" style={{ padding: '4px 12px', fontSize: '12px' }}>Export CSV</button>
                <button className="btn btn-ghost" style={{ padding: '4px 12px', fontSize: '12px' }}>Sync to Jira</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

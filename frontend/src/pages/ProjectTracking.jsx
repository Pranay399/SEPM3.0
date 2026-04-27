import { useState, useEffect } from 'react';
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
};

export default function ProjectTracking() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects').then(res => {
      setProjects(res.data.projects);
      if (res.data.projects.length > 0) setSelectedProject(res.data.projects[0]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    api.get(`/projects/${selectedProject.id}/artifacts/taskmaster`).then(res => {
      if (res.data.artifact?.sections?.taskBreakdown) {
        setTasks(res.data.artifact.sections.taskBreakdown);
      }
    }).catch(() => setTasks([]));
  }, [selectedProject]);

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
                <span>Project: {selectedProject?.name || 'None'}</span>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
                <span>Sprint 1</span>
              </div>
              <h1 className="text-headline-xl" style={{ color: 'var(--on-surface)' }}>TaskMaster Backlog</h1>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {projects.length > 1 && (
                <select
                  className="select-field"
                  style={{ width: '180px', height: '32px', fontSize: '12px' }}
                  value={selectedProject?.id || ''}
                  onChange={e => setSelectedProject(projects.find(p => p.id === e.target.value))}
                >
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              )}
              <button className="btn btn-secondary" style={{ height: '32px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>filter_list</span>
                Filter
              </button>
              <button className="btn btn-secondary" style={{ height: '32px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>group_work</span>
                Group by: Agent
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
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr 160px 120px 120px',
            gap: '8px',
            padding: '8px 16px',
            background: 'var(--surface-container-low)',
            borderBottom: '1px solid var(--outline-variant)',
            alignItems: 'center',
          }}>
            {['Key', 'Task Name', 'Assigned Agent', 'Status', 'Priority'].map(col => (
              <div key={col}>
                <span className="text-label-md" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.08em' }}>
                  {col}
                </span>
              </div>
            ))}
          </div>

          {/* Table Body */}
          <div>
            {tasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: 'var(--on-surface-variant)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--outline-variant)', marginBottom: '8px' }}>checklist</span>
                <p className="text-body-md">No tasks generated yet. Create a project to generate the task breakdown.</p>
              </div>
            ) : (
              tasks.map((task, idx) => {
                const statusStyle = getStatusStyle(task.status);
                const priorityConfig = getPriorityConfig(task.priority);
                const agentConfig = getAgentConfig(task.agent);
                return (
                  <div
                    key={task.key}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr 160px 120px 120px',
                      gap: '8px',
                      padding: '10px 16px',
                      borderBottom: idx < tasks.length - 1 ? '1px solid var(--outline-variant)' : 'none',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-container-low)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Key */}
                    <div>
                      <span className="text-code-sm" style={{ color: 'var(--on-surface-variant)' }}>{task.key}</span>
                    </div>

                    {/* Task Name */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingRight: '16px' }}>
                      <span className="text-body-md" style={{ color: 'var(--on-surface)', fontWeight: 500 }}>{task.name}</span>
                      <span style={{ fontSize: '12px', color: 'var(--on-surface-variant)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {task.estimate} estimate
                      </span>
                    </div>

                    {/* Agent */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '24px', height: '24px', borderRadius: 'var(--radius-default)',
                        background: agentConfig.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{agentConfig.icon}</span>
                      </div>
                      <span style={{ fontSize: '13px', color: 'var(--on-surface)' }}>{task.agent}_Agent</span>
                    </div>

                    {/* Status */}
                    <div>
                      <span className="chip" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                        {task.status}
                      </span>
                    </div>

                    {/* Priority */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: priorityConfig.color }}>
                      <span className="material-symbols-outlined icon-fill" style={{ fontSize: '16px' }}>{priorityConfig.icon}</span>
                      <span style={{ fontSize: '13px' }}>{task.priority}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {tasks.length > 0 && (
            <div style={{
              padding: '8px 16px',
              borderTop: '1px solid var(--outline-variant)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '13px',
              color: 'var(--on-surface-variant)',
            }}>
              <span>Showing 1-{tasks.length} of {tasks.length} tasks</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn btn-ghost" style={{ height: '28px', width: '28px', padding: 0, opacity: 0.5 }} disabled>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_left</span>
                </button>
                <button className="btn btn-ghost" style={{ height: '28px', width: '28px', padding: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

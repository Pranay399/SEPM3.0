import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';

const ARTIFACT_TREE = [
  {
    folder: 'Requirements',
    icon: 'folder',
    items: [
      { agentId: 'analyst', label: 'Software Requirements Specification (SRS)', icon: 'description' },
    ],
  },
  {
    folder: 'Strategy',
    icon: 'folder',
    items: [
      { agentId: 'strategist', label: 'Project Strategy & Methodology Report', icon: 'lightbulb' },
    ],
  },
  {
    folder: 'Architecture',
    icon: 'folder',
    items: [
      { agentId: 'architect', label: 'System Architecture Document', icon: 'architecture' },
    ],
  },
  {
    folder: 'Testing',
    icon: 'folder',
    items: [
      { agentId: 'qaqc', label: 'Quality Assurance & Test Strategy', icon: 'bug_report' },
    ],
  },
  {
    folder: 'DevOps',
    icon: 'folder',
    items: [
      { agentId: 'devops', label: 'DevOps & ITIL Management Plan', icon: 'cloud_sync' },
    ],
  },
  {
    folder: 'Planning',
    icon: 'folder',
    items: [
      { agentId: 'taskmaster', label: 'Task Breakdown & Sprint Plan', icon: 'fact_check' },
    ],
  },
];

export default function ArtifactViewer() {
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [artifacts, setArtifacts] = useState({});
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set(['Requirements', 'Strategy', 'Architecture', 'Testing', 'DevOps', 'Planning']));

  useEffect(() => {
    api.get('/projects').then(res => {
      setProjects(res.data.projects);
      const projId = location.state?.projectId;
      const proj = projId ? res.data.projects.find(p => p.id === projId) : res.data.projects[0];
      if (proj) setSelectedProject(proj);
    });
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    api.get(`/projects/${selectedProject.id}/artifacts`).then(res => {
      setArtifacts(res.data.artifacts);
      const agId = location.state?.agentId || 'analyst';
      if (res.data.artifacts[agId]) {
        setSelectedArtifact(res.data.artifacts[agId]);
        setSelectedAgentId(agId);
      }
    });
  }, [selectedProject]);

  const toggleFolder = (folder) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      next.has(folder) ? next.delete(folder) : next.add(folder);
      return next;
    });
  };

  const renderValue = (value, depth = 0) => {
    if (value === null || value === undefined) return null;

    if (Array.isArray(value)) {
      if (value.length === 0) return <span style={{ color: 'var(--outline)' }}>—</span>;

      // If array of objects with specific structure, render as table
      if (typeof value[0] === 'object' && value[0] !== null && !Array.isArray(value[0])) {
        const keys = Object.keys(value[0]);
        return (
          <div style={{ border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-default)', overflow: 'hidden', marginTop: '12px', marginBottom: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', tableLayout: 'auto' }}>
              <thead>
                <tr style={{ background: 'var(--surface-container-low)', borderBottom: '1px solid var(--outline-variant)' }}>
                  {keys.map(k => (
                    <th key={k} className="text-label-md" style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--on-surface)', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.05em' }}>
                      {k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {value.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--outline-variant)', background: i % 2 === 0 ? 'transparent' : 'var(--surface-container-lowest)' }}>
                    {keys.map(k => (
                      <td key={k} style={{ padding: '12px 16px', color: 'var(--on-surface-variant)', lineHeight: '1.5', verticalAlign: 'top' }}>
                        {Array.isArray(row[k]) 
                          ? row[k].join(', ') 
                          : typeof row[k] === 'object' 
                            ? JSON.stringify(row[k]) 
                            : String(row[k])
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      // Array of strings or primitives
      return (
        <ul style={{ paddingLeft: '24px', margin: '12px 0', listStyleType: 'square' }}>
          {value.map((item, i) => (
            <li key={i} style={{ marginBottom: '8px', color: 'var(--on-surface-variant)', fontSize: '15px', lineHeight: '1.6' }}>
              {typeof item === 'object' ? renderValue(item, depth + 1) : String(item)}
            </li>
          ))}
        </ul>
      );
    }

    if (typeof value === 'object') {
      return (
        <div style={{ marginLeft: depth > 0 ? '16px' : '0', marginTop: '12px' }}>
          {Object.entries(value).map(([key, val]) => (
            <div key={key} style={{ marginBottom: '20px' }}>
              <span className="text-headline-sm" style={{ color: 'var(--on-surface)', fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '6px', borderLeft: '3px solid var(--primary-container)', paddingLeft: '10px' }}>
                {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}
              </span>
              <div style={{ paddingLeft: '13px' }}>
                {renderValue(val, depth + 1)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return <p style={{ color: 'var(--on-surface-variant)', fontSize: '15px', lineHeight: '1.6', margin: '8px 0' }}>{String(value)}</p>;
  };

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', marginLeft: '256px', height: '100%' }}>
      {/* File Explorer Sidebar */}
      <aside style={{
        width: '288px',
        background: 'var(--surface)',
        borderRight: '1px solid var(--outline-variant)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid var(--outline-variant)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--surface-container-low)',
        }}>
          <h2 className="text-headline-sm" style={{ color: 'var(--on-surface)' }}>Files</h2>
          {projects.length > 1 && (
            <select
              style={{ fontSize: '11px', border: '1px solid var(--outline-variant)', borderRadius: '4px', padding: '2px 6px', background: 'var(--surface-container-lowest)' }}
              value={selectedProject?.id || ''}
              onChange={e => setSelectedProject(projects.find(p => p.id === e.target.value))}
            >
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          )}
        </div>

        {/* Tree */}
        <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
          {ARTIFACT_TREE.map(group => (
            <div key={group.folder} style={{ marginBottom: '8px' }}>
              <div
                onClick={() => toggleFolder(group.folder)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px', padding: '4px',
                  cursor: 'pointer', borderRadius: 'var(--radius-default)', color: 'var(--on-surface-variant)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-variant)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  {expandedFolders.has(group.folder) ? 'arrow_drop_down' : 'arrow_right'}
                </span>
                <span className="material-symbols-outlined icon-fill" style={{ fontSize: '18px', color: 'var(--primary)' }}>folder</span>
                <span className="text-label-md" style={{ color: 'var(--on-surface)', letterSpacing: 'normal', fontWeight: 500 }}>{group.folder}</span>
              </div>

              {expandedFolders.has(group.folder) && (
                <div style={{ paddingLeft: '16px', marginLeft: '8px', borderLeft: '1px solid var(--outline-variant)', marginTop: '2px' }}>
                  {group.items.map(item => {
                    const isActive = selectedAgentId === item.agentId;
                    const hasData = !!artifacts[item.agentId];
                    return (
                      <div
                        key={item.agentId}
                        onClick={() => {
                          if (hasData) {
                            setSelectedArtifact(artifacts[item.agentId]);
                            setSelectedAgentId(item.agentId);
                          }
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-default)',
                          cursor: hasData ? 'pointer' : 'default',
                          background: isActive ? 'var(--secondary-container)' : 'transparent',
                          color: isActive ? 'var(--on-secondary-container)' : hasData ? 'var(--on-surface-variant)' : 'var(--outline)',
                          opacity: hasData ? 1 : 0.5,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { if (!isActive && hasData) e.currentTarget.style.background = 'var(--surface-variant)'; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: isActive ? 'var(--primary)' : 'var(--outline)' }}>{item.icon}</span>
                        <span className="text-body-md" style={{ fontSize: '13px', fontWeight: isActive ? 500 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Document Canvas */}
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{
          height: '48px',
          borderBottom: '1px solid var(--outline-variant)',
          background: 'var(--surface-container-lowest)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '2px 8px', background: 'var(--surface-container)', borderRadius: 'var(--radius-default)', border: '1px solid var(--outline-variant)' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }} />
              <span className="text-label-md" style={{ fontSize: '10px', color: 'var(--on-surface)', textTransform: 'uppercase' }}>Synced</span>
            </div>
            <span style={{ color: 'var(--outline-variant)' }}>|</span>
            <span className="text-body-md" style={{ color: 'var(--on-surface-variant)', fontSize: '13px' }}>
              {selectedArtifact && <>Last edited by <strong>{selectedArtifact.agentVersion || 'Agent'}</strong> just now</>}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[{ icon: 'history', label: 'History' }, { icon: 'download', label: 'Export' }].map(({ icon, label }) => (
              <button key={label} className="btn btn-ghost" style={{ height: '32px', fontSize: '11px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{icon}</span>
                {label}
              </button>
            ))}
            <button className="btn btn-primary" style={{ height: '32px', fontSize: '11px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
              Edit
            </button>
          </div>
        </div>

        {/* Document */}
        <div style={{ flex: 1, overflowY: 'auto', background: 'var(--surface-container-low)', padding: '24px' }}>
          {selectedArtifact ? (
            <article className="animate-fade-in" style={{
              background: 'var(--surface-container-lowest)',
              width: '100%',
              maxWidth: '850px',
              minHeight: '100%',
              margin: '0 auto',
              border: '1px solid var(--outline-variant)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              borderRadius: 'var(--radius-default)',
              padding: '64px',
              position: 'relative',
            }}>
              {/* Watermark */}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0.03, pointerEvents: 'none', overflow: 'hidden',
              }}>
                <span style={{ fontSize: '120px', fontWeight: 900, transform: 'rotate(-45deg)', whiteSpace: 'nowrap', color: 'var(--on-surface)' }}>
                  DRAFT v1.0
                </span>
              </div>

              {/* Doc Header */}
              <header style={{ marginBottom: '32px', paddingBottom: '16px', borderBottom: '2px solid var(--surface-variant)' }}>
                <h1 className="text-headline-xl" style={{ color: 'var(--on-surface)', marginBottom: '8px' }}>{selectedArtifact.title}</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', fontSize: '14px', color: 'var(--on-surface-variant)' }}>
                  <div><strong style={{ color: 'var(--on-surface)' }}>Project:</strong> {selectedProject?.name}</div>
                  <div><strong style={{ color: 'var(--on-surface)' }}>Author:</strong> {selectedArtifact.agentVersion}</div>
                  <div><strong style={{ color: 'var(--on-surface)' }}>Date:</strong> {new Date(selectedArtifact.generatedAt).toLocaleDateString()}</div>
                  <div><strong style={{ color: 'var(--on-surface)' }}>Confidence:</strong> {selectedArtifact.confidence ? Math.round(selectedArtifact.confidence * 100) : 98}%</div>
                </div>
              </header>

              {/* Doc Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {selectedArtifact.sections && Object.entries(selectedArtifact.sections).map(([key, value]) => (
                  <section key={key}>
                    <h2 className="text-headline-md" style={{ color: 'var(--on-surface)', marginBottom: '12px' }}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                    </h2>
                    {renderValue(value)}
                  </section>
                ))}
              </div>
            </article>
          ) : (
            <div style={{ textAlign: 'center', padding: '64px', color: 'var(--on-surface-variant)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--outline-variant)', marginBottom: '16px' }}>description</span>
              <h2 className="text-headline-md" style={{ color: 'var(--on-surface)', marginBottom: '8px' }}>No Artifact Selected</h2>
              <p className="text-body-md">Select a document from the file tree to preview it here.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

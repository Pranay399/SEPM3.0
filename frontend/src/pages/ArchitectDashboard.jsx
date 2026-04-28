import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function ArchitectDashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [artifact, setArtifact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects').then(res => {
      setProjects(res.data.projects);
      if (res.data.projects.length > 0) {
        setSelectedProject(res.data.projects[0]);
      } else {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    setLoading(true);
    api.get(`/projects/${selectedProject.id}/artifacts`).then(res => {
      setArtifact(res.data.artifacts.architect || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedProject]);

  const sections = artifact?.sections || {};
  const techStack = sections.techStackDecision || {};
  const security = sections.securityArchitecture || {};
  const design = sections.systemDesign || {};

  return (
    <div className="layout-main">
      <div className="layout-main-wide animate-slide-up">
        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 className="text-headline-xl text-on-surface">System Architecture Design</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
              <span className="text-body-md text-on-surface-variant">Active Project:</span>
              <select 
                className="text-label-lg"
                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--outline-variant)', color: 'var(--primary)', cursor: 'pointer', padding: '2px 4px' }}
                value={selectedProject?.id || ''}
                onChange={(e) => setSelectedProject(projects.find(p => p.id === e.target.value))}
              >
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
              Export PDF
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '16px' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--surface-variant)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
            <p className="text-body-md text-on-surface-variant">Retrieving architectural blueprints...</p>
          </div>
        ) : !artifact ? (
          <div className="card" style={{ textAlign: 'center', padding: '64px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--outline-variant)', marginBottom: '16px' }}>architecture</span>
            <h2 className="text-headline-md text-on-surface">No Architecture Data Available</h2>
            <p className="text-body-md text-on-surface-variant">The Architect Agent hasn't finalized the design for this project yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px' }}>
            
            {/* Tech Stack Section */}
            <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--surface-container-high)', paddingBottom: '8px' }}>
                  <span className="material-symbols-outlined text-primary-container">layers</span>
                  <h3 className="text-headline-sm text-on-surface">Target Tech Stack</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { icon: 'view_quilt', title: 'Frontend', desc: techStack.frontend },
                    { icon: 'settings_input_component', title: 'Backend', desc: techStack.backend },
                    { icon: 'database', title: 'Database', desc: techStack.database },
                    { icon: 'speed', title: 'Caching', desc: techStack.caching },
                    { icon: 'deployed_code', title: 'Orchestration', desc: techStack.orchestration },
                  ].filter(i => i.desc).map(item => (
                    <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--outline-variant)', marginTop: '4px' }}>
                        <span className="material-symbols-outlined text-tertiary" style={{ fontSize: '18px' }}>{item.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-label-md text-on-surface">{item.title}</h4>
                        <p className="text-code-sm text-on-surface-variant" style={{ fontSize: '11px' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {techStack.techStackRationale && (
                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--surface-container-high)' }}>
                    <h4 className="text-label-md text-primary" style={{ fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}>Strategic Rationale</h4>
                    <p className="text-body-md text-on-surface-variant" style={{ fontSize: '12px', fontStyle: 'italic', lineHeight: '1.4' }}>
                      "{techStack.techStackRationale}"
                    </p>
                  </div>
                )}
              </div>

              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--surface-container-high)', paddingBottom: '8px' }}>
                  <span className="material-symbols-outlined text-primary-container">security</span>
                  <h3 className="text-headline-sm text-on-surface">Security Architecture</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(security).map(([key, value]) => (
                    <div key={key}>
                      <h4 className="text-label-md text-on-surface" style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--primary)' }}>{key}</h4>
                      <p className="text-body-md text-on-surface-variant" style={{ fontSize: '13px' }}>{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Diagrams & Docs Section */}
            <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="card" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '400px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined text-primary-container">account_tree</span>
                    <h3 className="text-headline-sm text-on-surface">System Components</h3>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {(sections.components || []).map((comp, idx) => (
                    <div key={idx} style={{ padding: '12px', background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-default)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span className="text-label-lg text-on-surface" style={{ fontWeight: 600 }}>{comp.name}</span>
                        <span className="chip" style={{ fontSize: '10px' }}>{comp.technology}</span>
                      </div>
                      <p className="text-body-md text-on-surface-variant" style={{ fontSize: '12px', lineHeight: '1.4' }}>{comp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--surface-container-high)', paddingBottom: '8px' }}>
                  <span className="material-symbols-outlined text-primary-container">schema</span>
                  <h3 className="text-headline-sm text-on-surface">System Design Patterns</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {Object.entries(design).map(([key, value]) => (
                    <div key={key}>
                      <h4 className="text-label-md text-on-surface" style={{ color: 'var(--outline)' }}>{key.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())}</h4>
                      <p className="text-body-md text-on-surface" style={{ fontSize: '14px' }}>{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function DevOpsDashboard() {
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
      setArtifact(res.data.artifacts.devops || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedProject]);

  const sections = artifact?.sections || {};
  const pipeline = sections.cicdPipeline || { stages: [] };
  const monitoring = sections.monitoring || {};

  return (
    <div className="layout-main">
      <div className="layout-main-wide animate-slide-up">
        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 className="text-headline-xl text-on-surface">DevOps & ITIL Command Center</h1>
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
          <button className="btn btn-secondary" onClick={() => window.location.reload()}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>sync</span>
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '16px' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--surface-variant)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
            <p className="text-body-md text-on-surface-variant">Establishing secure ops connection...</p>
          </div>
        ) : !artifact ? (
          <div className="card" style={{ textAlign: 'center', padding: '64px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--outline-variant)', marginBottom: '16px' }}>terminal</span>
            <h2 className="text-headline-md text-on-surface">No DevOps Data Available</h2>
            <p className="text-body-md text-on-surface-variant">The DevOps Agent is still provisioning the environment definitions.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px' }}>
            
            {/* CI/CD Pipeline Status */}
            <div className="card" style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--outline-variant)', paddingBottom: '8px' }}>
                <h2 className="text-headline-md text-on-surface" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined text-primary">route</span>
                  CI/CD Pipeline Definition
                </h2>
                <span className="chip chip-neutral">{sections.deploymentStrategy?.type || 'Standard'}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1, padding: '16px 0', overflowX: 'auto' }}>
                {pipeline.stages.map((stage, idx) => (
                  <React.Fragment key={idx}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '120px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--secondary-container)', color: 'var(--on-secondary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', border: '1px solid var(--primary-fixed-dim)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                          {stage.name.toLowerCase().includes('build') ? 'package_2' : 
                           stage.name.toLowerCase().includes('test') ? 'science' : 
                           stage.name.toLowerCase().includes('deploy') ? 'cloud_upload' : 'settings'}
                        </span>
                      </div>
                      <span className="text-label-md text-on-surface" style={{ fontWeight: 600 }}>{stage.name}</span>
                      <span className="text-code-sm text-tertiary" style={{ fontSize: '10px' }}>{stage.tools}</span>
                    </div>
                    {idx < pipeline.stages.length - 1 && (
                      <div style={{ flex: 1, height: '1px', background: 'var(--primary-container)', margin: '0 8px' }} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--outline-variant)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--on-surface-variant)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>info</span>
                  <span style={{ fontSize: '12px' }}>Rollback Strategy: {sections.deploymentStrategy?.rollback}</span>
                </div>
              </div>
            </div>

            {/* Monitoring & Alerts */}
            <div className="card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--outline-variant)', paddingBottom: '8px' }}>
                <h2 className="text-headline-md text-on-surface" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined text-secondary">monitoring</span>
                  Monitoring Stack
                </h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                <div style={{ background: 'var(--surface-container-low)', padding: '12px', borderRadius: 'var(--radius-default)', border: '1px solid var(--outline-variant)' }}>
                  <span className="text-label-md text-primary" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Infrastructure</span>
                  <div className="text-body-md text-on-surface" style={{ fontWeight: 600 }}>{monitoring.infrastructure}</div>
                </div>
                <div style={{ background: 'var(--surface-container-low)', padding: '12px', borderRadius: 'var(--radius-default)', border: '1px solid var(--outline-variant)' }}>
                  <span className="text-label-md text-secondary" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Application</span>
                  <div className="text-body-md text-on-surface" style={{ fontWeight: 600 }}>{monitoring.application}</div>
                </div>
                <div style={{ background: 'var(--surface-container-low)', padding: '12px', borderRadius: 'var(--radius-default)', border: '1px solid var(--outline-variant)' }}>
                  <span className="text-label-md text-tertiary" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Alerting</span>
                  <div className="text-body-md text-on-surface" style={{ fontWeight: 600 }}>{monitoring.alerting}</div>
                </div>
              </div>
            </div>

            {/* Incident & Management */}
            <div className="card" style={{ gridColumn: 'span 12' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--outline-variant)', paddingBottom: '8px' }}>
                <h2 className="text-headline-md text-on-surface" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined text-secondary">assignment</span>
                  ITIL Management Guidelines
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <h3 className="text-label-lg text-on-surface mb-2">Incident Flow</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {(sections.incidentManagement?.flow || []).map((step, i) => (
                      <div key={i} className="text-body-md text-on-surface-variant" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--primary-container)', color: 'var(--on-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{i+1}</span>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-label-lg text-on-surface mb-2">Escalation Path</h3>
                  {Object.entries(sections.incidentManagement?.escalation || {}).map(([level, group]) => (
                    <div key={level} style={{ marginBottom: '8px' }}>
                      <span className="text-label-md text-primary" style={{ fontSize: '11px' }}>{level}</span>
                      <div className="text-body-md text-on-surface" style={{ fontSize: '13px' }}>{group}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="text-label-lg text-on-surface mb-2">Dashboards</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(monitoring.dashboards || []).map((db, i) => (
                      <span key={i} className="chip chip-neutral">{db}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}

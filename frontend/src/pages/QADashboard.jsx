import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function QADashboard() {
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

  const refreshData = () => {
    if (!selectedProject) return;
    setLoading(true);
    api.get(`/projects/${selectedProject.id}/artifacts`).then(res => {
      setArtifact(res.data.artifacts.qaqc || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    refreshData();
  }, [selectedProject]);

  const sections = artifact?.sections || {};
  const strategy = sections.testingStrategy || {};
  const testCases = sections.testCases || [];

  return (
    <div className="layout-main">
      <div className="layout-main-wide animate-slide-up">
        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 className="text-headline-xl text-on-surface">QA/QC Dashboard</h1>
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
            <button className="btn btn-secondary" onClick={refreshData} disabled={loading}>
              <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`} style={{ fontSize: '18px' }}>sync</span>
              {loading ? 'Syncing...' : 'Sync Results'}
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '16px' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--surface-variant)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
            <p className="text-body-md text-on-surface-variant">Aggregating test metrics...</p>
          </div>
        ) : !artifact ? (
          <div className="card" style={{ textAlign: 'center', padding: '64px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--outline-variant)', marginBottom: '16px' }}>fact_check</span>
            <h2 className="text-headline-md text-on-surface">No QA Data Available</h2>
            <p className="text-body-md text-on-surface-variant">The QA/QC Agent is still designing the test suites for this project.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            
            {/* Strategy Summary */}
            <div className="card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 className="text-headline-sm text-on-surface" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined text-primary">rule</span>
                  Test Strategy Coverage
                </h3>
                <span className="chip chip-success" style={{ padding: '4px 8px' }}>{Math.round((artifact.confidence || 0.94) * 100)}% PLANNED</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px', flex: 1 }}>
                {[
                  { label: 'Unit', details: strategy.unitTesting, color: 'var(--primary)' },
                  { label: 'Integration', details: strategy.integrationTesting, color: 'var(--secondary)' },
                  { label: 'E2E', details: strategy.e2eTesting, color: 'var(--tertiary)' },
                  { label: 'Performance', details: strategy.performanceTesting, color: 'var(--error)' },
                ].filter(s => s.details).map(stat => (
                  <div key={stat.label} style={{ background: 'var(--surface-container-low)', padding: '12px', borderRadius: 'var(--radius-default)', border: '1px solid var(--outline-variant)' }}>
                    <span className="text-label-md text-on-surface-variant block mb-1">{stat.label}</span>
                    <div className="text-body-md text-on-surface" style={{ fontWeight: 600, fontSize: '13px' }}>{stat.details.framework}</div>
                    <div className="text-code-sm text-on-surface-variant" style={{ fontSize: '10px', marginTop: '4px' }}>{stat.details.coverage}</div>
                    <div className="progress-bar" style={{ marginTop: '8px' }}>
                      <div className="progress-bar-fill" style={{ width: '100%', background: stat.color, opacity: 0.7 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Defect Management */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="text-headline-sm text-on-surface" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span className="material-symbols-outlined text-secondary">bug_report</span>
                SLA Guidelines
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                {Object.entries(sections.defectManagement?.sla || {}).map(([sev, time]) => (
                  <div key={sev} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-default)', border: '1px solid var(--outline-variant)' }}>
                    <span className="text-label-md text-on-surface">{sev} Severity</span>
                    <span className="text-code-sm text-on-surface-variant">{time} Resolution</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Cases Table */}
            <div className="card" style={{ gridColumn: 'span 3', padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px', background: 'var(--surface-container-lowest)', borderBottom: '1px solid var(--outline-variant)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="text-headline-sm text-on-surface" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined text-tertiary">description</span>
                  Generated Test Scenarios
                </h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-container-low)', borderBottom: '1px solid var(--outline-variant)' }}>
                      <th className="text-label-md text-on-surface-variant" style={{ padding: '12px' }}>ID</th>
                      <th className="text-label-md text-on-surface-variant" style={{ padding: '12px' }}>Module</th>
                      <th className="text-label-md text-on-surface-variant" style={{ padding: '12px' }}>Scenario</th>
                      <th className="text-label-md text-on-surface-variant" style={{ padding: '12px' }}>Expected Result</th>
                      <th className="text-label-md text-on-surface-variant" style={{ padding: '12px' }}>Type</th>
                    </tr>
                  </thead>
                  <tbody className="text-body-md text-on-surface">
                    {testCases.map((tc, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                        <td className="text-code-sm" style={{ padding: '12px' }}>{tc.id}</td>
                        <td style={{ padding: '12px' }}><span className="chip chip-neutral">{tc.module}</span></td>
                        <td style={{ padding: '12px', fontSize: '13px' }}>{tc.scenario}</td>
                        <td className="text-on-surface-variant" style={{ padding: '12px', fontSize: '13px' }}>{tc.expected}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)' }} className="text-label-md">
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>pending</span> {tc.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}

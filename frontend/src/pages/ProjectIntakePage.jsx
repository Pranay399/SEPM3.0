import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function ProjectIntakePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    problemStatement: '',
    targetAudience: '',
    complexity: 'medium',
    goals: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/projects', formData);
      navigate('/dashboard', { state: { projectId: res.data.project.id, newProject: true } });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout-main">
      <div className="layout-main-narrow animate-slide-up">
        {/* Breadcrumb */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--outline)', marginBottom: '8px', fontSize: '14px' }}>
            <span>Projects</span>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
            <span>New Intake</span>
          </div>
          <h1 className="text-headline-xl" style={{ color: 'var(--on-background)' }}>Initialize New Project</h1>
          <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '8px', maxWidth: '600px' }}>
            Define the core parameters, problem space, and intended audience for your new initiative. This information will be used to generate the initial artifact hub and agent workspaces.
          </p>
        </div>

        {/* Form Card */}
        <div className="card" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Project Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label className="text-label-md" style={{ color: 'var(--on-surface)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Project Name <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <input
                className="input-field"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Nexus Payment Gateway Revamp"
                required
                style={{ borderRadius: 'var(--radius-default)' }}
              />
              <span style={{ fontSize: '12px', color: 'var(--outline)', marginTop: '4px' }}>
                Keep it concise and descriptive. This will be used for repository naming.
              </span>
            </div>

            {/* Problem Statement */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label className="text-label-md" style={{ color: 'var(--on-surface)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Idea / Problem Statement <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <textarea
                className="textarea-field"
                name="problemStatement"
                value={formData.problemStatement}
                onChange={handleChange}
                placeholder="Describe the current pain points or the opportunity this project addresses..."
                rows={5}
                required
              />
              <span style={{ fontSize: '12px', color: 'var(--outline)', marginTop: '4px' }}>Markdown is supported.</span>
            </div>

            {/* Two-column row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Target Audience */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="text-label-md" style={{ color: 'var(--on-surface)' }}>Target Audience</label>
                <div style={{ position: 'relative' }}>
                  <select className="select-field" name="targetAudience" value={formData.targetAudience} onChange={handleChange}>
                    <option value="" disabled>Select primary audience...</option>
                    <option value="internal_eng">Internal Engineering</option>
                    <option value="external_b2b">External B2B Clients</option>
                    <option value="external_b2c">End Consumers (B2C)</option>
                    <option value="internal_ops">Operations / Support</option>
                  </select>
                  <span className="material-symbols-outlined" style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--outline)', pointerEvents: 'none',
                  }}>expand_more</span>
                </div>
              </div>

              {/* Complexity */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="text-label-md" style={{ color: 'var(--on-surface)' }}>Estimated Complexity</label>
                <div style={{ position: 'relative' }}>
                  <select className="select-field" name="complexity" value={formData.complexity} onChange={handleChange}>
                    <option value="low">Low (1-2 Sprints)</option>
                    <option value="medium">Medium (1 Quarter)</option>
                    <option value="high">High (Multi-Quarter)</option>
                    <option value="epic">Epic / Transformational</option>
                  </select>
                  <span className="material-symbols-outlined" style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--outline)', pointerEvents: 'none',
                  }}>expand_more</span>
                </div>
              </div>
            </div>

            {/* Goals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label className="text-label-md" style={{ color: 'var(--on-surface)' }}>Primary Goals & Success Metrics</label>
              <textarea
                className="textarea-field"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                placeholder="What does success look like? (e.g., Reduce latency by 20%, Increase conversion by 5%)"
                rows={3}
              />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--outline-variant)', margin: '8px 0' }} />

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? (
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: '16px' }}>sync</span>
                ) : (
                  <>
                    <span>Create Project Draft</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p className="text-body-md" style={{ fontSize: '13px', color: 'var(--outline)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>info</span>
            Drafts are saved automatically to your workspace.
          </p>
        </div>
      </div>
    </div>
  );
}

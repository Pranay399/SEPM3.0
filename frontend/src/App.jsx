import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import ProjectIntakePage from './pages/ProjectIntakePage';
import LiveAgentDashboard from './pages/LiveAgentDashboard';
import ArtifactViewer from './pages/ArtifactViewer';
import ProjectTracking from './pages/ProjectTracking';
import QADashboard from './pages/QADashboard';
import DevOpsDashboard from './pages/DevOpsDashboard';
import ArchitectDashboard from './pages/ArchitectDashboard';

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--background)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <span className="material-symbols-outlined animate-spin" style={{ fontSize: '40px', color: 'var(--primary-container)' }}>hub</span>
          <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '16px' }}>Loading Nexus SDLC...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="layout-shell">
      <TopNav />
      <div className="layout-body">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--background)',
      }}>
        <span className="material-symbols-outlined animate-spin" style={{ fontSize: '40px', color: 'var(--primary-container)' }}>hub</span>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<LiveAgentDashboard />} />
        <Route path="/intake" element={<ProjectIntakePage />} />
        <Route path="/artifacts" element={<ArtifactViewer />} />
        <Route path="/tracking" element={<ProjectTracking />} />
        <Route path="/qaqc" element={<QADashboard />} />
        <Route path="/devops" element={<DevOpsDashboard />} />
        <Route path="/architect" element={<ArchitectDashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

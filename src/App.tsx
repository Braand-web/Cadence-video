import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { VideosProvider } from './lib/VideosContext';
import { Landing } from './pages/Landing';
import { Onboarding } from './pages/Onboarding';
import { AppLayout } from './layouts/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { CreateFlow } from './pages/CreateFlow';
import { Editor } from './pages/Editor';
import { Calendar } from './pages/Calendar';
import { Analytics } from './pages/Analytics';
import { Billing } from './pages/Billing';
import { Queue } from './pages/Queue';
import { History } from './pages/History';
import { Trends } from './pages/Trends';
import { Settings } from './pages/Settings';

function Gate() {
  const { session, demoMode, loading } = useAuth();
  const authenticated = !!session || demoMode;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0F', color: '#8A8A9C', fontFamily: 'Manrope' }}>
        Chargement…
      </div>
    );
  }

  if (!authenticated) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Onboarding onEnterApp={() => {}} />} />
      </Routes>
    );
  }

  return (
    <VideosProvider>
      <Routes>
        <Route path="/app" element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create" element={<CreateFlow />} />
          <Route path="editor/:id" element={<Editor />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="queue" element={<Queue />} />
          <Route path="history" element={<History />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="billing" element={<Billing />} />
          <Route path="trends" element={<Trends />} />
          <Route path="settings" element={<Settings />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
      </Routes>
    </VideosProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Gate />
      </AuthProvider>
    </BrowserRouter>
  );
}

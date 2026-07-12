import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { useVideos } from '../lib/VideosContext';
import { seedLibrary } from '../lib/library';

export function AppLayout() {
  const { videos } = useVideos();
  const loc = useLocation();
  const queueCount = videos.filter((v) => v.status === 'scheduled' || v.status === 'review').length + seedLibrary().filter((v) => v.status === 'scheduled').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'radial-gradient(1200px 600px at 78% -8%, rgba(240,90,40,.14), transparent 60%),radial-gradient(900px 500px at -6% 108%, rgba(240,90,40,.09), transparent 55%),#101012' }}>
      <Sidebar queueCount={queueCount} />
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ flex: 1, padding: '30px 34px 60px' }} key={loc.pathname}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

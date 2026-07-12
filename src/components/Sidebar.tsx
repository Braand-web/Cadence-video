import { NavLink, useLocation } from 'react-router-dom';
import { Icon, ICONS } from './Icon';
import { LogoBadge } from './Logo';
import { useAuth } from '../lib/AuthContext';

const NAV_ITEMS: { id: string; to: string; label: string; icon: keyof typeof ICONS; badge?: () => string | null }[] = [
  { id: 'dashboard', to: '/app/dashboard', label: 'Tableau de bord', icon: 'home' },
  { id: 'create', to: '/app/create', label: 'Créer', icon: 'spark' },
  { id: 'trends', to: '/app/trends', label: 'Tendances IA', icon: 'bulb' },
  { id: 'calendar', to: '/app/calendar', label: 'Calendrier', icon: 'cal' },
  { id: 'queue', to: '/app/queue', label: "File d'attente", icon: 'clock' },
  { id: 'history', to: '/app/history', label: 'Historique', icon: 'history' },
  { id: 'analytics', to: '/app/analytics', label: 'Analytics', icon: 'chart' },
  { id: 'billing', to: '/app/billing', label: 'Facturation', icon: 'card' },
  { id: 'settings', to: '/app/settings', label: 'Réglages', icon: 'gear' },
];

export function Sidebar({ queueCount }: { queueCount: number }) {
  const { profile, signOut } = useAuth();
  const loc = useLocation();

  return (
    <aside style={{ width: 248, flex: 'none', borderRight: '1px solid rgba(255,255,255,.07)', padding: '22px 15px', display: 'flex', flexDirection: 'column', gap: 4, position: 'sticky', top: 0, height: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '6px 8px 18px' }}>
        <LogoBadge size={34} />
        <div>
          <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: 18, letterSpacing: '-.01em', lineHeight: 1 }}>Cadence</div>
          <div style={{ fontSize: 10.5, color: '#7E7E92', letterSpacing: '.04em', marginTop: 2 }}>CONTENU AUTOPILOTE</div>
        </div>
      </div>

      {NAV_ITEMS.map((item) => {
        const active = loc.pathname.startsWith(item.to) || (item.id === 'dashboard' && loc.pathname.startsWith('/app/editor'));
        return (
          <NavLink
            key={item.id}
            to={item.to}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              padding: '10px 12px',
              borderRadius: 11,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Manrope',
              fontWeight: 600,
              fontSize: 14,
              textAlign: 'left',
              transition: 'background .15s',
              background: active ? 'rgba(124,92,255,.16)' : 'transparent',
              color: active ? '#F3F3F6' : '#8A8A9C',
              textDecoration: 'none',
            }}
          >
            <span style={{ display: 'flex', flex: 'none' }}>
              <Icon name={item.icon} size={18} />
            </span>
            <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
            {item.id === 'queue' && queueCount > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(124,92,255,.2)', color: '#A78BFA', padding: '1px 7px', borderRadius: 20 }}>{queueCount}</span>
            )}
          </NavLink>
        );
      })}

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: 10, border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, background: 'rgba(255,255,255,.02)' }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#9D6BFF,#7C5CFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, flex: 'none' }}>
          {(profile?.studio_name || 'C')[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile?.studio_name || 'Studio Créateur'}</div>
          <div style={{ fontSize: 11, color: '#7E7E92', textTransform: 'capitalize' }}>Plan {profile?.plan || 'Creator'}</div>
        </div>
        <button onClick={() => signOut()} style={{ background: 'none', border: 'none', color: '#7E7E92', cursor: 'pointer', display: 'flex', padding: 4 }} title="Déconnexion">
          <Icon name="logout" size={16} />
        </button>
      </div>
    </aside>
  );
}

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { NOTIF_DEFS } from '../data/mock';

const TITLES: Record<string, [string, string]> = {
  dashboard: ['Tableau de bord', "Vue d'ensemble de ton contenu automatisé"],
  create: ['Créer une automatisation', 'Configure une machine à contenu quotidien'],
  editor: ['Éditeur vidéo', 'Peaufine ta vidéo avant publication'],
  calendar: ['Calendrier de publication', 'Planning de tes vidéos sur tous les réseaux'],
  queue: ["File d'attente", 'Vidéos programmées et à valider'],
  history: ['Historique de publication', 'Journal de tout ce que Cadence a publié pour toi'],
  analytics: ['Analytics', 'Performances de tes publications'],
  billing: ['Facturation', 'Abonnement, consommation et factures'],
  trends: ['Tendances & idées IA', 'Sujets qui percent en ce moment dans ta niche'],
  settings: ['Réglages', 'Compte, équipe, notifications et intégrations'],
};

function routeKey(pathname: string) {
  const seg = pathname.split('/')[2] || 'dashboard';
  return TITLES[seg] ? seg : 'dashboard';
}

export function Header() {
  const loc = useLocation();
  const navigate = useNavigate();
  const key = routeKey(loc.pathname);
  const [pageTitle, pageSubtitle] = TITLES[key];
  const isEditor = key === 'editor';
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifRead, setNotifRead] = useState(false);
  const hasUnread = !notifRead && NOTIF_DEFS.some((n) => n.u);

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '20px 34px',
        borderBottom: '1px solid rgba(255,255,255,.06)',
        position: 'sticky',
        top: 0,
        background: 'rgba(10,10,15,.82)',
        backdropFilter: 'blur(14px)',
        zIndex: 5,
      }}
    >
      {isEditor && (
        <button
          onClick={() => navigate('/app/dashboard')}
          style={{ width: 38, height: 38, borderRadius: 11, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.04)', color: '#F3F3F6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}
        >
          <Icon name="back" size={18} strokeWidth={2.2} />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ margin: 0, fontFamily: 'Space Grotesk,sans-serif', fontSize: 22, fontWeight: 600, letterSpacing: '-.02em' }}>{pageTitle}</h1>
        <div style={{ fontSize: 13, color: '#8A8A9C', marginTop: 2 }}>{pageSubtitle}</div>
      </div>
      {isEditor && (
        <button style={{ background: 'rgba(255,255,255,.05)', color: '#C9C9D6', border: '1px solid rgba(255,255,255,.1)', padding: '10px 16px', borderRadius: 11, fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          Enregistrer
        </button>
      )}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setNotifOpen((o) => !o)}
          style={{ position: 'relative', width: 40, height: 40, borderRadius: 11, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.04)', color: '#F3F3F6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="bell" size={18} />
          {hasUnread && <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', background: '#9D6BFF', border: '2px solid #0A0A0F' }} />}
        </button>
        {notifOpen && (
          <div>
            <div onClick={() => setNotifOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
            <div style={{ position: 'absolute', right: 0, top: 50, width: 344, background: '#14141B', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, boxShadow: '0 24px 60px rgba(0,0,0,.55)', zIndex: 41, overflow: 'hidden', animation: 'fadeUp .2s ease both' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
                <button onClick={() => setNotifRead(true)} style={{ background: 'none', border: 'none', color: '#A78BFA', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Manrope' }}>
                  Tout marquer lu
                </button>
              </div>
              <div style={{ maxHeight: 360, overflow: 'auto' }}>
                {NOTIF_DEFS.map((n, i) => {
                  const unread = n.u && !notifRead;
                  return (
                    <div key={i} style={{ display: 'flex', gap: 11, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,.05)', background: unread ? 'rgba(124,92,255,.05)' : 'transparent' }}>
                      <span style={{ width: 32, height: 32, borderRadius: 9, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${n.c}22`, color: n.c }}>
                        <Icon name={n.ic} size={15} />
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{n.title}</div>
                        <div style={{ fontSize: 11.5, color: '#7E7E92', marginTop: 2 }}>{n.time}</div>
                      </div>
                      {unread && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7C5CFF', flex: 'none', marginTop: 6 }} />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      {!isEditor && (
        <button
          onClick={() => navigate('/app/create')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#7C5CFF,#9D6BFF)', color: '#fff', border: 'none', padding: '11px 18px', borderRadius: 11, fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 8px 24px rgba(124,92,255,.35)' }}
        >
          <Icon name="plus" size={17} strokeWidth={2.2} /> Nouvelle vidéo
        </button>
      )}
    </header>
  );
}

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
          style={{ width: 38, height: 38, borderRadius: 11, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.04)', color: '#F7F4EF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}
        >
          <Icon name="back" size={18} strokeWidth={2.2} />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ margin: 0, fontFamily: 'Hanken Grotesk,sans-serif', fontSize: 22, fontWeight: 600, letterSpacing: '-.02em' }}>{pageTitle}</h1>
        <div style={{ fontSize: 13, color: '#8B8B92', marginTop: 2 }}>{pageSubtitle}</div>
      </div>
      {isEditor && (
        <button style={{ background: 'rgba(255,255,255,.05)', color: '#E4E1DA', border: '1px solid rgba(255,255,255,.1)', padding: '10px 16px', borderRadius: 11, fontFamily: 'Hanken Grotesk', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          Enregistrer
        </button>
      )}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setNotifOpen((o) => !o)}
          style={{ position: 'relative', width: 40, height: 40, borderRadius: 11, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.04)', color: '#F7F4EF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="bell" size={18} />
          {hasUnread && <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', background: '#A56A00', border: '2px solid #101012' }} />}
        </button>
        {notifOpen && (
          <div>
            <div onClick={() => setNotifOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
            <div style={{ position: 'absolute', right: 0, top: 50, width: 344, background: '#17171B', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, boxShadow: '0 24px 60px rgba(0,0,0,.55)', zIndex: 41, overflow: 'hidden', animation: 'fadeUp .2s ease both' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
                <button onClick={() => setNotifRead(true)} style={{ background: 'none', border: 'none', color: '#FF8A5C', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Hanken Grotesk' }}>
                  Tout marquer lu
                </button>
              </div>
              <div style={{ maxHeight: 360, overflow: 'auto' }}>
                {NOTIF_DEFS.map((n, i) => {
                  const unread = n.u && !notifRead;
                  return (
                    <div key={i} style={{ display: 'flex', gap: 11, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,.05)', background: unread ? 'rgba(240,90,40,.05)' : 'transparent' }}>
                      <span style={{ width: 32, height: 32, borderRadius: 9, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${n.c}22`, color: n.c }}>
                        <Icon name={n.ic} size={15} />
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{n.title}</div>
                        <div style={{ fontSize: 11.5, color: '#6E6E74', marginTop: 2 }}>{n.time}</div>
                      </div>
                      {unread && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#F05A28', flex: 'none', marginTop: 6 }} />}
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
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#101012', border: 'none', padding: '11px 18px', borderRadius: 9999, fontFamily: 'Hanken Grotesk', fontWeight: 500, fontSize: 14, cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,.35)' }}
        >
          <Icon name="plus" size={17} strokeWidth={2.2} /> Nouvelle vidéo
        </button>
      )}
    </header>
  );
}

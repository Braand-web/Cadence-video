import { useState } from 'react';
import { Icon, YoutubeIcon, TiktokIcon } from '../components/Icon';
import { PlatformBadge, toggleTrackStyle, toggleKnobStyle } from '../components/common';
import { useAuth } from '../lib/AuthContext';
import { MEMBERS, PENDING_INVITES, ROLE_LEGEND, WORKSPACES, NETWORKS, REF_STATS, REF_PROGRESS, REF_GOAL, REFERRAL_CODE, NOTIF_PREF_DEFS } from '../data/mock';

const SET_TABS: [string, string, string][] = [
  ['compte', 'Compte', 'gear'],
  ['notifications', 'Notifications', 'bell'],
  ['team', 'Équipe & rôles', 'users'],
  ['accounts', 'Comptes & espaces', 'link'],
  ['referral', 'Parrainage', 'gift'],
];
const ROLE_OPTS: [string, string][] = [
  ['admin', 'Admin'],
  ['editor', 'Éditeur'],
  ['viewer', 'Lecteur'],
];

function AccountTab() {
  const { profile, updateProfile } = useAuth();
  const [studioName, setStudioName] = useState(profile?.studio_name || '');
  const [language, setLanguage] = useState(profile?.language || 'fr');
  const [timezone, setTimezone] = useState(profile?.timezone || 'Europe/Paris (GMT+2)');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await updateProfile({ studio_name: studioName, language, timezone });
    setSaving(false);
  };

  return (
    <div style={{ animation: 'fadeUp .25s ease both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 20, background: 'rgba(255,255,255,.02)', marginBottom: 18 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#9D6BFF,#7C5CFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 24, flex: 'none' }}>{(studioName || 'C')[0]}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Manrope', fontSize: 18, fontWeight: 600 }}>{studioName || 'Studio Créateur'}</div>
          <div style={{ fontSize: 13, color: '#8A8A9C' }}>
            {profile?.email} · Plan {profile?.plan || 'Creator'}
          </div>
        </div>
        <button style={{ background: 'rgba(255,255,255,.06)', color: '#F3F3F6', border: '1px solid rgba(255,255,255,.14)', padding: '9px 16px', borderRadius: 11, fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          Changer la photo
        </button>
      </div>
      <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 22, background: 'rgba(255,255,255,.02)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#B9B9C8', marginBottom: 7 }}>Nom du studio</label>
            <input value={studioName} onChange={(e) => setStudioName(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 11, padding: '11px 14px', color: '#F3F3F6', fontSize: 14 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#B9B9C8', marginBottom: 7 }}>E-mail</label>
            <input value={profile?.email || ''} disabled style={{ width: '100%', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 11, padding: '11px 14px', color: '#8A8A9C', fontSize: 14 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#B9B9C8', marginBottom: 7 }}>Langue</label>
            <input value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 11, padding: '11px 14px', color: '#F3F3F6', fontSize: 14 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#B9B9C8', marginBottom: 7 }}>Fuseau horaire</label>
            <input value={timezone} onChange={(e) => setTimezone(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 11, padding: '11px 14px', color: '#F3F3F6', fontSize: 14 }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
          <button onClick={save} disabled={saving} style={{ background: 'linear-gradient(135deg,#7C5CFF,#9D6BFF)', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 11, fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', boxShadow: '0 8px 24px rgba(124,92,255,.35)', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>
      <div style={{ border: '1px solid rgba(255,92,92,.25)', borderRadius: 16, padding: '18px 20px', background: 'rgba(255,92,92,.05)', marginTop: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, color: '#FF9A9A' }}>Supprimer le compte</div>
          <div style={{ fontSize: 12.5, color: '#8A8A9C' }}>Action irréversible — toutes tes vidéos et données seront effacées.</div>
        </div>
        <button style={{ background: 'rgba(255,92,92,.14)', color: '#FF9A9A', border: '1px solid rgba(255,92,92,.3)', padding: '9px 16px', borderRadius: 11, fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Supprimer</button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const { profile, updateProfile } = useAuth();
  const prefs = profile?.notif_prefs || {};

  const toggle = (key: string, ch: 'e' | 'p') => {
    const current = prefs[key] || { e: false, p: false };
    updateProfile({ notif_prefs: { ...prefs, [key]: { ...current, [ch]: !current[ch] } } });
  };

  return (
    <div style={{ animation: 'fadeUp .25s ease both', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, background: 'rgba(255,255,255,.02)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,.07)', fontSize: 12, fontWeight: 700, color: '#7E7E92', letterSpacing: '.03em' }}>
        <span style={{ flex: 1 }}>TYPE D'ÉVÉNEMENT</span>
        <span style={{ width: 64, textAlign: 'center' }}>E-MAIL</span>
        <span style={{ width: 64, textAlign: 'center' }}>PUSH</span>
      </div>
      {NOTIF_PREF_DEFS.map((n) => {
        const pr = prefs[n.key] || { e: false, p: false };
        return (
          <div key={n.key} style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{n.label}</div>
              <div style={{ fontSize: 12, color: '#8A8A9C', marginTop: 2 }}>{n.desc}</div>
            </div>
            <div style={{ width: 64, display: 'flex', justifyContent: 'center' }}>
              <label onClick={() => toggle(n.key, 'e')} style={{ cursor: 'pointer' }}>
                <span style={toggleTrackStyle(pr.e, false)}>
                  <span style={toggleKnobStyle(pr.e, false)} />
                </span>
              </label>
            </div>
            <div style={{ width: 64, display: 'flex', justifyContent: 'center' }}>
              <label onClick={() => toggle(n.key, 'p')} style={{ cursor: 'pointer' }}>
                <span style={toggleTrackStyle(pr.p, false)}>
                  <span style={toggleKnobStyle(pr.p, false)} />
                </span>
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TeamTab() {
  const [teamRoles, setTeamRoles] = useState<Record<string, string>>({ anna: 'admin', marc: 'editor' });

  return (
    <div style={{ animation: 'fadeUp .25s ease both' }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        <input placeholder="collaborateur@email.com" style={{ flex: 1, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 11, padding: '11px 14px', color: '#F3F3F6', fontSize: 14 }} />
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#7C5CFF,#9D6BFF)', color: '#fff', border: 'none', padding: '11px 20px', borderRadius: 11, fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(124,92,255,.35)' }}>
          <Icon name="users" size={16} /> Inviter
        </button>
      </div>
      <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, background: 'rgba(255,255,255,.02)', overflow: 'hidden', marginBottom: 18 }}>
        {MEMBERS.map((m) => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, flex: 'none' }}>{m.name[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: '#8A8A9C' }}>{m.email}</div>
            </div>
            {m.fixed ? (
              <span style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', background: 'rgba(124,92,255,.16)', padding: '6px 14px', borderRadius: 9 }}>{m.fixed}</span>
            ) : (
              <div style={{ display: 'flex', gap: 6 }}>
                {ROLE_OPTS.map(([rk, rl]) => (
                  <button
                    key={rk}
                    onClick={() => setTeamRoles((r) => ({ ...r, [m.id]: rk }))}
                    style={{ padding: '6px 12px', borderRadius: 9, cursor: 'pointer', fontFamily: 'Manrope', fontWeight: 600, fontSize: 12, border: `1px solid ${teamRoles[m.id] === rk ? 'rgba(124,92,255,.5)' : 'rgba(255,255,255,.1)'}`, background: teamRoles[m.id] === rk ? 'rgba(124,92,255,.16)' : 'transparent', color: teamRoles[m.id] === rk ? '#A78BFA' : '#8A8A9C' }}
                  >
                    {rl}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {PENDING_INVITES.map((p) => (
        <div key={p.email} style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px dashed rgba(255,255,255,.14)', borderRadius: 14, padding: '14px 18px', marginBottom: 18 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7E7E92', flex: 'none' }}>
            <Icon name="clock" size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{p.email}</div>
            <div style={{ fontSize: 12, color: '#FFB74C' }}>Invitation en attente · {p.role}</div>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#7E7E92', fontFamily: 'Manrope', fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>Annuler</button>
        </div>
      ))}
      <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: 18, background: 'rgba(255,255,255,.02)' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#7E7E92', letterSpacing: '.03em', marginBottom: 12 }}>RÔLES</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ROLE_LEGEND.map((r) => (
            <div key={r.r} style={{ display: 'flex', gap: 10, fontSize: 13 }}>
              <span style={{ fontWeight: 700, color: '#A78BFA', width: 70, flex: 'none' }}>{r.r}</span>
              <span style={{ color: '#B9B9C8' }}>{r.d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AccountsTab() {
  const { profile, updateProfile } = useAuth();
  const [workspace, setWorkspace] = useState('studio');
  const connected = profile?.connected_networks || { yt: false, tt: false };

  const toggleNet = (kind: 'yt' | 'tt') => updateProfile({ connected_networks: { ...connected, [kind]: !connected[kind] } });

  return (
    <div style={{ animation: 'fadeUp .25s ease both' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontFamily: 'Manrope', fontSize: 16, fontWeight: 600 }}>Espaces de travail</h3>
        <button style={{ background: 'rgba(124,92,255,.14)', color: '#A78BFA', border: '1px solid rgba(124,92,255,.3)', padding: '8px 15px', borderRadius: 10, fontFamily: 'Manrope', fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>+ Nouvel espace</button>
      </div>
      <p style={{ fontSize: 12.5, color: '#8A8A9C', margin: '0 0 16px' }}>Gère plusieurs marques depuis un seul compte. Chacune a son planning, ses réseaux et son abonnement.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        {WORKSPACES.map((w) => {
          const active = workspace === w.id;
          return (
            <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 14, border: `1px solid ${active ? 'rgba(124,92,255,.5)' : 'rgba(255,255,255,.08)'}`, borderRadius: 14, padding: 14, background: active ? 'rgba(124,92,255,.08)' : 'rgba(255,255,255,.02)' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: w.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 17, flex: 'none' }}>{w.name[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{w.name}</div>
                <div style={{ fontSize: 12, color: '#8A8A9C' }}>
                  {w.handle} · Plan {w.plan}
                </div>
              </div>
              <button
                onClick={() => setWorkspace(w.id)}
                style={
                  active
                    ? { background: 'rgba(52,211,153,.14)', color: '#34D399', border: '1px solid rgba(52,211,153,.3)', padding: '8px 16px', borderRadius: 10, fontFamily: 'Manrope', fontWeight: 700, fontSize: 12.5, cursor: 'default', flex: 'none' }
                    : { background: 'rgba(255,255,255,.06)', color: '#F3F3F6', border: '1px solid rgba(255,255,255,.14)', padding: '8px 16px', borderRadius: 10, fontFamily: 'Manrope', fontWeight: 700, fontSize: 12.5, cursor: 'pointer', flex: 'none' }
                }
              >
                {active ? '✓ Actif' : 'Basculer'}
              </button>
            </div>
          );
        })}
      </div>
      <h3 style={{ margin: '0 0 14px', fontFamily: 'Manrope', fontSize: 16, fontWeight: 600 }}>Réseaux connectés</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {NETWORKS.map((n) => {
          const isRealNet = n.kind === 'yt' || n.kind === 'tt';
          const isConnected = isRealNet ? connected[n.kind as 'yt' | 'tt'] : n.connected;
          return (
            <div key={n.name} style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: 14, background: 'rgba(255,255,255,.02)' }}>
              <span style={{ width: 42, height: 42, borderRadius: 11, background: n.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flex: 'none' }}>
                {n.kind === 'yt' ? <YoutubeIcon /> : n.kind === 'tt' ? <TiktokIcon /> : <Icon name={n.kind as any} size={16} />}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {n.name}
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: isConnected ? '#34D399' : '#5A5A6C' }} />
                </div>
                <div style={{ fontSize: 12, color: '#8A8A9C' }}>{isConnected ? n.handle : 'Non connecté'}</div>
              </div>
              <button
                onClick={() => isRealNet && toggleNet(n.kind as 'yt' | 'tt')}
                style={
                  isConnected
                    ? { background: 'rgba(255,255,255,.05)', color: '#8A8A9C', border: '1px solid rgba(255,255,255,.1)', padding: '8px 15px', borderRadius: 10, fontFamily: 'Manrope', fontWeight: 700, fontSize: 12.5, cursor: 'pointer', flex: 'none' }
                    : { background: '#fff', color: '#14141B', border: 'none', padding: '8px 15px', borderRadius: 10, fontFamily: 'Manrope', fontWeight: 700, fontSize: 12.5, cursor: 'pointer', flex: 'none' }
                }
              >
                {isConnected ? 'Déconnecter' : 'Connecter'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReferralTab() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try {
      navigator.clipboard.writeText(REFERRAL_CODE);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  const pct = Math.round((REF_PROGRESS / REF_GOAL) * 100) + '%';

  return (
    <div style={{ animation: 'fadeUp .25s ease both' }}>
      <div style={{ border: '1px solid rgba(124,92,255,.3)', borderRadius: 18, padding: 26, background: 'linear-gradient(135deg,rgba(124,92,255,.16),rgba(124,92,255,.08))', marginBottom: 20 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: 14 }}>
          <Icon name="gift" size={30} />
        </div>
        <h2 style={{ fontFamily: 'Manrope', fontSize: 20, fontWeight: 600, margin: '0 0 6px' }}>Offre 1 mois, gagne 1 mois</h2>
        <p style={{ fontSize: 13.5, color: '#C9C9D6', margin: '0 0 18px', lineHeight: 1.5 }}>Pour chaque ami qui s'abonne, vous recevez tous les deux 1 mois Creator offert. À 10 filleuls, 3 mois Studio en bonus.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, background: 'rgba(0,0,0,.25)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 11, padding: '12px 16px', fontSize: 14, fontWeight: 600, fontFamily: 'ui-monospace,Menlo,monospace', color: '#F3F3F6', display: 'flex', alignItems: 'center' }}>{REFERRAL_CODE}</div>
          <button onClick={copy} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#14141B', border: 'none', padding: '12px 20px', borderRadius: 11, fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <Icon name="copy" size={15} /> {copied ? 'Copié !' : 'Copier'}
          </button>
        </div>
      </div>
      <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 20, background: 'rgba(255,255,255,.02)', marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10 }}>
          <span style={{ fontWeight: 700 }}>Progression vers 3 mois Studio</span>
          <span style={{ color: '#8A8A9C' }}>
            {REF_PROGRESS} / {REF_GOAL} filleuls
          </span>
        </div>
        <div style={{ height: 10, borderRadius: 10, background: 'rgba(255,255,255,.06)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 10, background: 'linear-gradient(90deg,#7C5CFF,#9D6BFF)', width: pct }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {REF_STATS.map((r) => (
          <div key={r.label} style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: 18, background: 'rgba(255,255,255,.02)', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Manrope', fontSize: 26, fontWeight: 600, color: '#A78BFA' }}>{r.value}</div>
            <div style={{ fontSize: 12.5, color: '#8A8A9C', marginTop: 4 }}>{r.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Settings() {
  const [tab, setTab] = useState('compte');

  return (
    <div style={{ animation: 'fadeUp .35s ease both', display: 'grid', gridTemplateColumns: '224px 1fr', gap: 30, alignItems: 'start', maxWidth: 1000 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'sticky', top: 96 }}>
        {SET_TABS.map(([k, l, ic]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: '10px 13px', borderRadius: 11, border: 'none', cursor: 'pointer', fontFamily: 'Manrope', fontWeight: 600, fontSize: 13.5, textAlign: 'left', background: tab === k ? 'rgba(124,92,255,.16)' : 'transparent', color: tab === k ? '#F3F3F6' : '#8A8A9C' }}
          >
            <span style={{ display: 'flex', flex: 'none' }}>
              <Icon name={ic as any} size={16} />
            </span>
            {l}
          </button>
        ))}
      </div>
      <div>
        {tab === 'compte' && <AccountTab />}
        {tab === 'notifications' && <NotificationsTab />}
        {tab === 'team' && <TeamTab />}
        {tab === 'accounts' && <AccountsTab />}
        {tab === 'referral' && <ReferralTab />}
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { PlatformBadge, chipStyle } from '../components/common';
import { useVideos } from '../lib/VideosContext';
import { mergeLibrary, type DisplayVideo } from '../lib/library';

type Filter = 'all' | 'published' | 'scheduled' | 'draft';

const FILTERS: [Filter, string][] = [
  ['all', 'Toutes'],
  ['published', 'Publiées'],
  ['scheduled', 'Programmées'],
  ['draft', 'Brouillons'],
];

function VideoCard({ v, onEdit }: { v: DisplayVideo; onEdit: () => void }) {
  const meta = v.status === 'published' ? `${v.views ?? '—'} vues · ${v.likes ?? '—'} likes` : v.when || 'Non programmé';
  const captionWord = v.status === 'published' ? 'VIRAL' : 'AUTO';
  const statusMap = {
    published: { label: '● Publié', bg: 'rgba(52,211,153,.16)', fg: '#34D399' },
    scheduled: { label: '● Programmé', bg: 'rgba(240,90,40,.18)', fg: '#FF8A5C' },
    draft: { label: '● Brouillon', bg: 'rgba(255,255,255,.09)', fg: '#D8D5CE' },
    review: { label: '● À valider', bg: 'rgba(255,183,76,.16)', fg: '#FFB74C' },
  } as const;
  const st = statusMap[v.status];
  return (
    <div onClick={onEdit} style={{ cursor: 'pointer' }}>
      <div style={{ position: 'relative', aspectRatio: '9/16', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,.1)', background: v.bg }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.55))' }} />
        <div style={{ position: 'absolute', top: 11, left: 11, display: 'flex', gap: 6 }}>
          <PlatformBadge plat={v.plat} />
        </div>
        <div style={{ position: 'absolute', top: 11, right: 11, fontSize: 10, fontWeight: 700, color: '#fff', background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(6px)', padding: '3px 8px', borderRadius: 20 }}>{v.dur}</div>
        <div style={{ position: 'absolute', left: 14, right: 14, top: '50%', transform: 'translateY(-50%)', textAlign: 'center', fontFamily: 'Hanken Grotesk,sans-serif', fontWeight: 700, fontSize: 18, lineHeight: 1.12, color: '#fff', textShadow: '0 2px 14px rgba(0,0,0,.5)' }}>{v.hook}</div>
        <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'inline-flex', alignSelf: 'center', gap: 4, background: 'rgba(0,0,0,.55)', padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#fff' }}>
            <span style={{ color: '#FFE45C' }}>⚡</span>
            {captionWord}
          </div>
          <div style={{ alignSelf: 'flex-start', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: st.bg, color: st.fg, backdropFilter: 'blur(6px)' }}>{st.label}</div>
        </div>
      </div>
      <div style={{ padding: '10px 2px 0' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#D8D5CE' }}>{v.nicheName}</div>
        <div style={{ marginTop: 4, fontSize: 12, color: '#6E6E74' }}>{meta}</div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { videos } = useVideos();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');

  const all = useMemo(() => mergeLibrary(videos), [videos]);
  const filtered = filter === 'all' ? all : all.filter((v) => v.status === filter);

  const stats = [
    { label: 'Vidéos générées', value: String(47 + videos.length), delta: '+12 cette semaine', icon: 'film' as const },
    { label: 'Programmées', value: String(all.filter((v) => v.status === 'scheduled').length), delta: 'Prochaine dans 3h', icon: 'cal' as const },
    { label: 'Publiées ce mois', value: '31', delta: '+8 vs mois dernier', icon: 'check' as const },
    { label: 'Vues totales', value: '1,24M', delta: '+18,3% ce mois', icon: 'trend' as const },
  ];

  const openEditor = (v: DisplayVideo) => navigate(`/app/editor/${v.id}`, { state: v.video ? undefined : { seedIndex: v.id } });

  return (
    <div style={{ animation: 'fadeUp .35s ease both' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: '18px 18px 16px', background: 'linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,.01))' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12.5, color: '#8B8B92', fontWeight: 600 }}>{s.label}</span>
              <span style={{ display: 'flex', color: '#F05A28' }}>
                <Icon name={s.icon} size={16} />
              </span>
            </div>
            <div style={{ fontFamily: 'Hanken Grotesk,sans-serif', fontSize: 30, fontWeight: 600, letterSpacing: '-.02em', marginTop: 10 }}>{s.value}</div>
            <div style={{ fontSize: 12, marginTop: 4, color: '#34D399', fontWeight: 600 }}>{s.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0, fontFamily: 'Hanken Grotesk,sans-serif', fontSize: 17, fontWeight: 600, marginRight: 6 }}>Bibliothèque</h2>
        {FILTERS.map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} style={{ ...chipStyle(filter === id), padding: '7px 14px', borderRadius: 20 }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(184px,1fr))', gap: 20 }}>
        {filtered.map((v) => (
          <VideoCard key={v.id} v={v} onEdit={() => openEditor(v)} />
        ))}
      </div>
    </div>
  );
}

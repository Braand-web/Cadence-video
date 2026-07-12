import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { PlatformBadge } from '../components/common';
import { TRENDS, TREND_SOUNDS, TREND_TAGS } from '../data/mock';
import { nicheName } from '../data/niches';

const NICHE_CHIPS: [string, string][] = [
  ['all', 'Toutes'],
  ['motivation', 'Motivation'],
  ['finance', 'Finance'],
  ['facts', 'Faits'],
  ['growth', 'Dev perso'],
  ['fitness', 'Fitness'],
];

const SCORE_COLOR: Record<string, string> = { 'Potentiel élevé': '#34D399', 'En hausse': '#A78BFA', Stable: '#8A8A9C' };

export function Trends() {
  const [trendNiche, setTrendNiche] = useState('all');
  const navigate = useNavigate();

  const trends = TRENDS.filter((t) => trendNiche === 'all' || t.niche === trendNiche);

  return (
    <div style={{ animation: 'fadeUp .35s ease both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
        {NICHE_CHIPS.map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTrendNiche(k)}
            style={{ padding: '7px 14px', borderRadius: 20, border: `1px solid ${trendNiche === k ? 'rgba(124,92,255,.5)' : 'rgba(255,255,255,.1)'}`, background: trendNiche === k ? 'rgba(124,92,255,.16)' : 'transparent', color: trendNiche === k ? '#A78BFA' : '#8A8A9C', fontFamily: 'Manrope', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
          >
            {l}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,.05)', color: '#C9C9D6', border: '1px solid rgba(255,255,255,.1)', padding: '8px 14px', borderRadius: 11, fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          <Icon name="refresh" size={15} /> Actualiser
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
          {trends.map((t) => (
            <div key={t.topic} style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,.02)' }}>
              <div style={{ height: 88, background: t.bg, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 12 }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.1),rgba(0,0,0,.35))' }} />
                <span style={{ position: 'relative', fontSize: 11, fontWeight: 800, color: '#0A0A0F', background: '#FFE45C', padding: '3px 9px', borderRadius: 20 }}>🔥 {t.badge}</span>
                <span style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 5 }}>
                  <PlatformBadge plat={t.plat} />
                </span>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 11.5, color: '#8A8A9C', fontWeight: 600 }}>{nicheName(t.niche)}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: `${SCORE_COLOR[t.score]}22`, color: SCORE_COLOR[t.score] }}>{t.score}</span>
                </div>
                <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: 16, lineHeight: 1.2 }}>{t.topic}</div>
                <div style={{ fontSize: 13, color: '#B9B9C8', marginTop: 8, fontStyle: 'italic', lineHeight: 1.4 }}>{t.hook}</div>
                <div style={{ fontSize: 12, color: '#7E7E92', marginTop: 10 }}>Format suggéré · {t.format}</div>
                <button
                  onClick={() => navigate('/app/create', { state: { niche: t.niche } })}
                  style={{ width: '100%', marginTop: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: 'linear-gradient(135deg,#7C5CFF,#9D6BFF)', color: '#fff', border: 'none', padding: 10, borderRadius: 11, fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, cursor: 'pointer' }}
                >
                  ✨ Générer cette vidéo
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 96 }}>
          <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 18, background: 'rgba(255,255,255,.02)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>🎵 Sons en tendance</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {TREND_SOUNDS.map((m) => (
                <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(124,92,255,.16)', color: '#A78BFA', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    <Icon name="music" size={15} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.1 }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: '#7E7E92' }}>{m.uses}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 18, background: 'rgba(255,255,255,.02)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}># Hashtags populaires</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TREND_TAGS.map((h) => (
                <span key={h} style={{ fontSize: 12.5, fontWeight: 600, color: '#A78BFA', background: 'rgba(124,92,255,.12)', padding: '5px 11px', borderRadius: 20 }}>
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { KPIS, VIEWS_SERIES, DAY_LABELS, TOP_VIDEOS, BEST_TIMES } from '../data/mock';

function Donut() {
  const R = 42;
  const C = 2 * Math.PI * R;
  const ytFrac = 0.62;
  return (
    <svg width={130} height={130} viewBox="0 0 110 110">
      <circle cx={55} cy={55} r={R} fill="none" stroke="#7C5CFF" strokeWidth={16} />
      <circle cx={55} cy={55} r={R} fill="none" stroke="#FF0033" strokeWidth={16} strokeDasharray={`${C * ytFrac} ${C}`} strokeLinecap="round" transform="rotate(-90 55 55)" />
      <text x={55} y={52} textAnchor="middle" fill="#F3F3F6" fontSize={18} fontWeight={700} fontFamily="Manrope">
        1,24M
      </text>
      <text x={55} y={68} textAnchor="middle" fill="#8A8A9C" fontSize={8}>
        vues totales
      </text>
    </svg>
  );
}

export function Analytics() {
  const maxV = Math.max(...VIEWS_SERIES);

  return (
    <div style={{ animation: 'fadeUp .35s ease both' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {KPIS.map((k) => (
          <div key={k.label} style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 18, background: 'linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,.01))' }}>
            <div style={{ fontSize: 12.5, color: '#8A8A9C', fontWeight: 600 }}>{k.label}</div>
            <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 28, fontWeight: 600, letterSpacing: '-.02em', marginTop: 8 }}>{k.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: k.deltaColor }}>{k.delta}</span>
              <span style={{ fontSize: 11, color: '#7E7E92' }}>vs période préc.</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18, marginBottom: 18 }}>
        <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 18, padding: 22, background: 'rgba(255,255,255,.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontFamily: 'Space Grotesk,sans-serif', fontSize: 16, fontWeight: 600 }}>Vues · 14 derniers jours</h3>
            <span style={{ fontSize: 12, color: '#34D399', fontWeight: 700 }}>+18,3%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 180 }}>
            {VIEWS_SERIES.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', borderRadius: '6px 6px 3px 3px', background: 'linear-gradient(180deg,#9D6BFF,#7C5CFF)', height: `${Math.round((v / maxV) * 100)}%`, transformOrigin: 'bottom', animation: 'growBar .6s ease both' }} title={`${(v * 1.3).toFixed(0)}K vues`} />
                <span style={{ fontSize: 9, color: '#5A5A6C' }}>{DAY_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 18, padding: 22, background: 'rgba(255,255,255,.02)' }}>
          <h3 style={{ margin: '0 0 18px', fontFamily: 'Space Grotesk,sans-serif', fontSize: 16, fontWeight: 600 }}>Répartition par réseau</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <Donut />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: '#FF0033' }} />
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>YouTube Shorts</span>
              <span style={{ fontSize: 13, color: '#8A8A9C' }}>62%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: '#7C5CFF' }} />
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>TikTok</span>
              <span style={{ fontSize: 13, color: '#8A8A9C' }}>38%</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 18, padding: 22, background: 'rgba(255,255,255,.02)' }}>
          <h3 style={{ margin: '0 0 16px', fontFamily: 'Space Grotesk,sans-serif', fontSize: 16, fontWeight: 600 }}>Top vidéos</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {TOP_VIDEOS.map((t) => (
              <div key={t.rank} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15, color: '#7E7E92', width: 18 }}>{t.rank}</span>
                <div style={{ width: 38, height: 56, borderRadius: 8, background: t.bg, flex: 'none', border: '1px solid rgba(255,255,255,.1)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.hook}</div>
                  <div style={{ fontSize: 11.5, color: '#8A8A9C', marginTop: 2 }}>{t.niche}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{t.views}</div>
                  <div style={{ fontSize: 11, color: '#34D399' }}>{t.rate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 18, padding: 22, background: 'rgba(255,255,255,.02)' }}>
          <h3 style={{ margin: '0 0 6px', fontFamily: 'Space Grotesk,sans-serif', fontSize: 16, fontWeight: 600 }}>Meilleurs horaires</h3>
          <p style={{ margin: '0 0 16px', fontSize: 12, color: '#8A8A9C' }}>Engagement moyen par créneau</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {BEST_TIMES.map((h) => (
              <div key={h.time} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 52, fontSize: 12.5, fontWeight: 600, color: '#B9B9C8' }}>{h.time}</span>
                <div style={{ flex: 1, height: 8, borderRadius: 8, background: 'rgba(255,255,255,.06)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 8, background: 'linear-gradient(90deg,#7C5CFF,#9D6BFF)', width: h.pct }} />
                </div>
                <span style={{ fontSize: 12, color: '#8A8A9C', width: 34, textAlign: 'right' }}>{h.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

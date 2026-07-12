import { Icon } from '../components/Icon';
import { PlatformBadge } from '../components/common';
import { HISTORY, HIST_STATS } from '../data/mock';
import { nicheName } from '../data/niches';

export function History() {
  let lastDate: string | null = null;

  return (
    <div style={{ animation: 'fadeUp .35s ease both', maxWidth: 960 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 26 }}>
        {HIST_STATS.map((s) => (
          <div key={s.label} style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: '16px 18px', background: 'linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,.01))' }}>
            <div style={{ fontSize: 12.5, color: '#8A8A9C', fontWeight: 600 }}>{s.label}</div>
            <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 26, fontWeight: 600, letterSpacing: '-.02em', marginTop: 8 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {HISTORY.map((h, i) => {
        const showDate = h.date !== lastDate;
        lastDate = h.date;
        return (
          <div key={i}>
            {showDate && <div style={{ fontSize: 12, fontWeight: 700, color: '#7E7E92', letterSpacing: '.05em', textTransform: 'uppercase', margin: '20px 0 10px' }}>{h.date}</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: '12px 16px', marginBottom: 10, background: 'rgba(255,255,255,.02)' }}>
              <div style={{ width: 42, height: 74, borderRadius: 8, overflow: 'hidden', flex: 'none', position: 'relative', background: h.bg, border: '1px solid rgba(255,255,255,.1)' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: 'Manrope', fontWeight: 700, fontSize: 7, lineHeight: 1.1, padding: 4, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,.6)' }}>{h.hook}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.hook}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, fontSize: 12.5, color: '#8A8A9C' }}>
                  <span>{nicheName(h.niche)}</span>
                  <span style={{ color: '#3A3A48' }}>•</span>
                  <PlatformBadge plat={h.plat} size={22} />
                  <span style={{ color: '#3A3A48' }}>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Icon name="clock" size={13} /> {h.time}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: '#B9B9C8', flex: 'none' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, minWidth: 58 }}>
                  <Icon name="eye" size={13} /> {h.views}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, minWidth: 52 }}>
                  <Icon name="heart" size={13} /> {h.likes}
                </span>
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  padding: '5px 11px',
                  borderRadius: 9,
                  flex: 'none',
                  background: h.ok ? 'rgba(52,211,153,.16)' : 'rgba(255,92,92,.16)',
                  color: h.ok ? '#34D399' : '#FF9A9A',
                }}
              >
                {h.ok ? '● Publié' : '● Échec'}
              </div>
              {h.ok ? (
                <button style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.04)', color: '#8A8A9C', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }} title="Voir la publication">
                  <Icon name="external" size={14} />
                </button>
              ) : (
                <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid rgba(255,183,76,.3)', background: 'rgba(255,183,76,.12)', color: '#FFB74C', cursor: 'pointer', padding: '8px 13px', borderRadius: 10, fontFamily: 'Manrope', fontWeight: 700, fontSize: 12.5, flex: 'none' }} title="Republier">
                  <Icon name="refresh" size={14} /> Réessayer
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

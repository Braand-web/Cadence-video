import { useMemo } from 'react';
import { Icon } from '../components/Icon';
import { PlatformBadge, toggleTrackStyle, toggleKnobStyle } from '../components/common';
import { useVideos } from '../lib/VideosContext';
import { useAuth } from '../lib/AuthContext';
import { mergeLibrary } from '../lib/library';

export function Queue() {
  const { videos, approveVideo } = useVideos();
  const { profile, updateProfile } = useAuth();

  const validate = profile?.default_validate_before_publish ?? true;
  const toggleValidate = () => updateProfile({ default_validate_before_publish: !validate });

  const all = useMemo(() => mergeLibrary(videos), [videos]);
  const queue = all.filter((v) => v.status === 'scheduled' || v.status === 'review');

  const statusStyle = (status: 'scheduled' | 'review') => {
    const map = {
      scheduled: { label: '● Programmé', bg: 'rgba(124,92,255,.18)', fg: '#A78BFA' },
      review: { label: '● À valider', bg: 'rgba(255,183,76,.16)', fg: '#FFB74C' },
    } as const;
    return map[status];
  };

  return (
    <div style={{ animation: 'fadeUp .35s ease both', maxWidth: 920 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: '16px 20px', background: 'rgba(255,255,255,.02)', marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Mode « valider avant de publier »</div>
          <div style={{ fontSize: 12.5, color: '#8A8A9C' }}>{validate ? 'Activé — les vidéos attendent ta validation avant publication.' : 'Désactivé — publication 100% automatique selon le planning.'}</div>
        </div>
        <label style={{ cursor: 'pointer' }} onClick={toggleValidate}>
          <span style={toggleTrackStyle(validate)}>
            <span style={toggleKnobStyle(validate)} />
          </span>
        </label>
      </div>

      {queue.map((q) => {
        const st = statusStyle(q.status as 'scheduled' | 'review');
        return (
          <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: 16, border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: '12px 14px', marginBottom: 12, background: 'rgba(255,255,255,.02)' }}>
            <div style={{ width: 54, height: 96, borderRadius: 9, overflow: 'hidden', flex: 'none', position: 'relative', background: q.bg, border: '1px solid rgba(255,255,255,.1)' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: 'Manrope', fontWeight: 700, fontSize: 8, lineHeight: 1.1, padding: 5, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,.6)' }}>{q.hook}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>{q.hook}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, fontSize: 12.5, color: '#8A8A9C' }}>
                <span>{q.nicheName}</span>
                <span style={{ color: '#3A3A48' }}>•</span>
                <PlatformBadge plat={q.plat} size={22} />
                <span style={{ color: '#3A3A48' }}>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Icon name="clock" size={13} /> {q.when}
                </span>
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 9, flex: 'none', background: st.bg, color: st.fg }}>{st.label}</div>
            {q.status === 'review' && (
              <button onClick={() => approveVideo(q.id)} style={{ background: '#34D399', color: '#04160E', border: 'none', padding: '9px 16px', borderRadius: 10, fontWeight: 700, fontSize: 13, fontFamily: 'Manrope', cursor: 'pointer' }}>
                Valider
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

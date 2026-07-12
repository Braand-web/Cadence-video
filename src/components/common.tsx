import type { CSSProperties } from 'react';
import { Icon, YoutubeIcon, TiktokIcon } from './Icon';

export type Platform = 'yt' | 'tt' | 'both';

export function PlatformBadge({ plat, size = 22 }: { plat: Platform; size?: number }) {
  const yt = (
    <span
      key="yt"
      style={{ width: size, height: size, borderRadius: 6, background: '#FF0033', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
    >
      <YoutubeIcon size={Math.round(size * 0.64)} />
    </span>
  );
  const tt = (
    <span
      key="tt"
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        background: '#000',
        border: '1px solid rgba(255,255,255,.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
      }}
    >
      <TiktokIcon size={Math.round(size * 0.6)} />
    </span>
  );
  if (plat === 'yt') return yt;
  if (plat === 'tt') return tt;
  return (
    <>
      {yt}
      {tt}
    </>
  );
}

export function WaveBars() {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 3,
            height: 22,
            borderRadius: 3,
            background: '#fff',
            transformOrigin: 'bottom',
            animation: `wave ${0.6 + (i % 4) * 0.15}s ease-in-out ${i * 0.05}s infinite`,
          }}
        />
      ))}
    </>
  );
}

export function MiniWave({ active }: { active: boolean }) {
  const hs = [7, 12, 9, 15, 11, 17, 10, 14, 8, 13, 9, 16, 11, 7, 12, 10];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 18 }}>
      {hs.map((h, i) => (
        <span key={i} style={{ width: 2, height: h, borderRadius: 2, background: active ? '#A78BFA' : 'rgba(255,255,255,.25)' }} />
      ))}
    </div>
  );
}

export function toggleTrackStyle(on: boolean, big = true): CSSProperties {
  const w = big ? 44 : 40;
  const h = big ? 25 : 23;
  return { position: 'relative', width: w, height: h, borderRadius: 20, flex: 'none', transition: 'background .2s', display: 'inline-block', background: on ? '#7C5CFF' : 'rgba(255,255,255,.15)' };
}
export function toggleKnobStyle(on: boolean, big = true): CSSProperties {
  const w = big ? 19 : 17;
  const off = big ? 3 : 3;
  const onLeft = big ? 22 : 20;
  return { position: 'absolute', top: 3, left: on ? onLeft : off, width: w, height: w, borderRadius: '50%', background: '#fff', transition: 'left .2s' };
}

export function Toggle({ on, onClick, big = true }: { on: boolean; onClick: () => void; big?: boolean }) {
  return (
    <span onClick={onClick} style={{ cursor: 'pointer', display: 'inline-block' }}>
      <span style={toggleTrackStyle(on, big)}>
        <span style={toggleKnobStyle(on, big)} />
      </span>
    </span>
  );
}

export function chipStyle(on: boolean): CSSProperties {
  return {
    padding: '9px 15px',
    borderRadius: 11,
    cursor: 'pointer',
    fontFamily: 'Manrope',
    fontWeight: 600,
    fontSize: 13,
    border: `1px solid ${on ? 'rgba(124,92,255,.5)' : 'rgba(255,255,255,.1)'}`,
    background: on ? 'rgba(124,92,255,.16)' : 'transparent',
    color: on ? '#A78BFA' : '#B9B9C8',
  };
}

export function StatusBadge({ status }: { status: 'published' | 'scheduled' | 'draft' | 'review' }) {
  const map = {
    published: { label: '● Publié', bg: 'rgba(52,211,153,.16)', fg: '#34D399' },
    scheduled: { label: '● Programmé', bg: 'rgba(124,92,255,.18)', fg: '#A78BFA' },
    draft: { label: '● Brouillon', bg: 'rgba(255,255,255,.09)', fg: '#B9B9C8' },
    review: { label: '● À valider', bg: 'rgba(255,183,76,.16)', fg: '#FFB74C' },
  } as const;
  const st = map[status] || map.draft;
  return (
    <div style={{ alignSelf: 'flex-start', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: st.bg, color: st.fg, backdropFilter: 'blur(6px)' }}>
      {st.label}
    </div>
  );
}

export function statusMeta(status: 'published' | 'scheduled' | 'draft' | 'review') {
  const map = {
    published: { label: '● Publié', bg: 'rgba(52,211,153,.16)', fg: '#34D399' },
    scheduled: { label: '● Programmé', bg: 'rgba(124,92,255,.18)', fg: '#A78BFA' },
    draft: { label: '● Brouillon', bg: 'rgba(255,255,255,.09)', fg: '#B9B9C8' },
    review: { label: '● À valider', bg: 'rgba(255,183,76,.16)', fg: '#FFB74C' },
  } as const;
  return map[status] || map.draft;
}

export { Icon };

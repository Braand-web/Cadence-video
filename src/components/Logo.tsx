import type { CSSProperties } from 'react';

/**
 * The Cadence mark: four rising pulse bars — the rhythm of a daily publishing
 * cadence, and a nod to the waveforms used throughout the product (voice,
 * music, captions). Deliberately not a generic bolt/spark glyph.
 */
export function LogoMark({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="8" width="3.2" height="8" rx="1.6" fill={color} />
      <rect x="7.6" y="4.5" width="3.2" height="15" rx="1.6" fill={color} />
      <rect x="13.2" y="2" width="3.2" height="20" rx="1.6" fill={color} />
      <rect x="18.8" y="6" width="3.2" height="12" rx="1.6" fill={color} />
    </svg>
  );
}

/** The mark inside the brand's rounded-square gradient badge — the app's standard logo chrome. */
export function LogoBadge({ size = 34, radius }: { size?: number; radius?: number }) {
  const r = radius ?? Math.round(size * 0.3);
  const iconSize = Math.round(size * 0.5);
  const style: CSSProperties = {
    width: size,
    height: size,
    borderRadius: r,
    background: 'linear-gradient(135deg,#7C5CFF,#9D6BFF)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 'none',
    boxShadow: `0 ${Math.round(size * 0.18)}px ${Math.round(size * 0.6)}px rgba(124,92,255,.42)`,
  };
  return (
    <div style={style}>
      <LogoMark size={iconSize} color="#fff" />
    </div>
  );
}

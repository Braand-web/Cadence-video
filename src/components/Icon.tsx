import type { CSSProperties } from 'react';
import { createElement } from 'react';

type PathAttrs = Record<string, string | number>;
type PathDef = string | { t: string; a: PathAttrs };
type IconDef = PathDef | PathDef[];

// Ported 1:1 from the Cadence.dc.html design prototype's icon path definitions.
export const ICONS: Record<string, IconDef> = {
  home: 'M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.4 2.4M15.3 15.3l2.4 2.4M17.7 6.3l-2.4 2.4M8.7 15.3l-2.4 2.4',
  cal: [{ t: 'rect', a: { x: 3, y: 4.5, width: 18, height: 16.5, rx: 2.5 } }, 'M3 9h18M8 2.5v4M16 2.5v4'],
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  gear: [
    { t: 'circle', a: { cx: 12, cy: 12, r: 3.2 } },
    'M4 12a8 8 0 0 1 .3-2.2l-2-1.5 2-3.5 2.3 1a8 8 0 0 1 1.9-1.1L9 2h4l.5 2.4a8 8 0 0 1 1.9 1.1l2.3-1 2 3.5-2 1.5A8 8 0 0 1 20 12a8 8 0 0 1-.3 2.2l2 1.5-2 3.5-2.3-1a8 8 0 0 1-1.9 1.1L13 22H9l-.5-2.4a8 8 0 0 1-1.9-1.1l-2.3 1-2-3.5 2-1.5A8 8 0 0 1 4 12z',
  ],
  card: [{ t: 'rect', a: { x: 3, y: 5, width: 18, height: 14, rx: 2.5 } }, 'M3 10h18'],
  plus: 'M12 5v14M5 12h14',
  check: 'M20 6 9 17l-5-5',
  uploadc: 'M12 15V4m0 0 4 4m-4-4-4 4M4 15v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3',
  play: { t: 'path', a: { d: 'M8 5v14l11-7z', fill: 'currentColor', stroke: 'none' } },
  clock: [{ t: 'circle', a: { cx: 12, cy: 12, r: 9 } }, 'M12 7v5l3 2'],
  pause: [
    { t: 'rect', a: { x: 6, y: 5, width: 4, height: 14, rx: 1, fill: 'currentColor', stroke: 'none' } },
    { t: 'rect', a: { x: 14, y: 5, width: 4, height: 14, rx: 1, fill: 'currentColor', stroke: 'none' } },
  ],
  mute: ['M11 5 6 9H2v6h4l5 4z', 'M22 9l-6 6M16 9l6 6'],
  volume: ['M11 5 6 9H2v6h4l5 4z', 'M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13'],
  crop: ['M6 2v16a1 1 0 0 0 1 1h16', 'M2 6h16a1 1 0 0 1 1 1v16'],
  scissors: [
    { t: 'circle', a: { cx: 6, cy: 6, r: 2.5 } },
    { t: 'circle', a: { cx: 6, cy: 18, r: 2.5 } },
    'M8 8l12 8M8 16l12-8',
  ],
  type: 'M4 7V5h16v2M9 5v14M9 19h6',
  stamp: ['M9 3h6v4a3 3 0 0 1-3 3 3 3 0 0 1-3-3z', 'M12 10v4M5 21h14v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3z'],
  sparkles: 'M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5zM19 14l.7 2.1L22 17l-2.3.9L19 20l-.7-2.1L16 17l2.3-.9z',
  music: [{ t: 'circle', a: { cx: 6, cy: 18, r: 2.5 } }, { t: 'circle', a: { cx: 18, cy: 16, r: 2.5 } }, 'M8.5 18V6l12-2v12'],
  mic: [{ t: 'rect', a: { x: 9, y: 2.5, width: 6, height: 11, rx: 3 } }, 'M6 11a6 6 0 0 0 12 0M12 17v4'],
  img: [{ t: 'rect', a: { x: 3, y: 4, width: 18, height: 16, rx: 2.5 } }, { t: 'circle', a: { cx: 8.5, cy: 9.5, r: 1.5 } }, 'M21 16l-5-5L4 20'],
  film: [{ t: 'rect', a: { x: 3, y: 4, width: 18, height: 16, rx: 2.5 } }, 'M3 9h18M3 15h18M8 4v16M16 4v16'],
  doc: [{ t: 'path', a: { d: 'M6 3h8l4 4v14H6z' } }, 'M14 3v4h4M9 12h6M9 16h6'],
  download: 'M12 4v11m0 0 4-4m-4 4-4-4M5 20h14',
  caption: [{ t: 'rect', a: { x: 3, y: 5, width: 18, height: 14, rx: 2.5 } }, 'M7 10h3M7 14h7M14 10h3'],
  trend: 'M3 17l6-6 4 4 8-8M15 7h6v6',
  flame: 'M12 3c3 3 4 6 2 9 0-2-1-3-2-3 0 3-4 3-4 7a4 4 0 0 0 8 0c0-4-2-6-4-13z',
  dollar: 'M12 2v20M17 6.5C17 4.6 14.8 3.5 12 3.5S7 4.9 7 7s2.2 3 5 3.5 5 1.4 5 3.5-2.2 3.5-5 3.5S7 20 7 18',
  dumbbell: 'M6.5 6.5l11 11M4 9l2-2M20 15l-2 2M7 4l3 3M17 20l-3-3M2 12l3 3M22 12l-3-3',
  brain: 'M9.5 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V15a3 3 0 0 0 5 2.2M14.5 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V15a3 3 0 0 1-5 2.2M12 4.5v14',
  zap: { t: 'path', a: { d: 'M13 2 4 14h7l-1 8 9-12h-7z', fill: 'currentColor', stroke: 'none' } },
  back: 'M15 5l-7 7 7 7',
  lock: [{ t: 'rect', a: { x: 5, y: 11, width: 14, height: 9, rx: 2 } }, 'M8 11V7a4 4 0 0 1 8 0v4'],
  logout: 'M16 17l5-5-5-5M21 12H9M12 3H5v18h7',
  bell: 'M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0',
  users: [{ t: 'circle', a: { cx: 9, cy: 8, r: 3.2 } }, 'M3 20a6 6 0 0 1 12 0M16 5.6a3 3 0 0 1 0 5.8M21 20a5.5 5.5 0 0 0-4-5.3'],
  gift: [
    { t: 'rect', a: { x: 3, y: 8, width: 18, height: 5, rx: 1 } },
    'M12 8v13M4 13v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 8S11 3 8 3a2.5 2.5 0 0 0 0 5M12 8s1-5 4-5a2.5 2.5 0 0 1 0 5',
  ],
  link: 'M9 15l6-6M10.5 7l1-1a4 4 0 0 1 5.7 5.7l-1 1M13.5 17l-1 1a4 4 0 0 1-5.7-5.7l1-1',
  trash: 'M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13',
  copy: [{ t: 'rect', a: { x: 9, y: 9, width: 11, height: 11, rx: 2 } }, 'M5 15V5a2 2 0 0 1 2-2h10'],
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10c1 1 1.4 2 1.5 3h5c.1-1 .5-2 1.5-3a6 6 0 0 0-4-10z',
  refresh: 'M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4',
  history: [{ t: 'path', a: { d: 'M3 12a9 9 0 1 0 3-6.7L3 8' } }, 'M3 4v4h4M12 8v4l3 2'],
  external: [{ t: 'path', a: { d: 'M14 4h6v6' } }, 'M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5'],
  eye: ['M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z', { t: 'circle', a: { cx: 12, cy: 12, r: 3 } }],
  heart: 'M12 20s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5c-2.5 4.5-9.5 9-9.5 9z',
};

export function svgPaths(def: IconDef, key?: string) {
  const arr = Array.isArray(def) ? def : [def];
  return arr.map((d, i) => (typeof d === 'string' ? <path key={key ? `${key}-${i}` : i} d={d} /> : createElement(d.t, { key: key ? `${key}-${i}` : i, ...d.a })));
}

export function Icon({
  name,
  size = 18,
  strokeWidth = 1.8,
  style,
  className,
}: {
  name: keyof typeof ICONS;
  size?: number;
  strokeWidth?: number;
  style?: CSSProperties;
  className?: string;
}) {
  const def = ICONS[name];
  if (!def) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
    >
      {svgPaths(def)}
    </svg>
  );
}

export function PlayFilledIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M9 6v12l9-6z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function GoogleIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.3C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.5l6.2 5.3C39.9 41.2 44 37 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

export function YoutubeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M9 8.5v7l6-3.5z" fill="#fff" stroke="none" />
    </svg>
  );
}

export function TiktokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 4c.4 2 1.7 3.4 3.5 3.6v2.3c-1.3 0-2.5-.4-3.5-1v5.8a4.6 4.6 0 1 1-4.6-4.6c.3 0 .5 0 .8.1v2.4a2.2 2.2 0 1 0 1.5 2.1V4z" />
    </svg>
  );
}

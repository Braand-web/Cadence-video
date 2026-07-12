import { useState } from 'react';
import { CALENDAR_EVENTS_2026_06 } from '../data/mock';

const MONTH_NAMES = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const WEEKDAYS = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
const TODAY = new Date(2026, 6, 10);

export function Calendar() {
  const [cal, setCal] = useState({ y: 2026, m: 6 });

  const calPrev = () => setCal((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }));
  const calNext = () => setCal((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }));

  const { y, m } = cal;
  const first = new Date(y, m, 1);
  const startDow = (first.getDay() + 6) % 7;
  const dim = new Date(y, m + 1, 0).getDate();
  const events = y === 2026 && m === 6 ? CALENDAR_EVENTS_2026_06 : {};

  const cells: { day: number | null }[] = [];
  for (let i = 0; i < startDow; i++) cells.push({ day: null });
  for (let d = 1; d <= dim; d++) cells.push({ day: d });

  return (
    <div style={{ animation: 'fadeUp .35s ease both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <button onClick={calPrev} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.04)', color: '#F3F3F6', cursor: 'pointer' }}>
          ‹
        </button>
        <h2 style={{ margin: 0, fontFamily: 'Space Grotesk,sans-serif', fontSize: 19, fontWeight: 600, minWidth: 190 }}>
          {MONTH_NAMES[m]} {y}
        </h2>
        <button onClick={calNext} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.04)', color: '#F3F3F6', cursor: 'pointer' }}>
          ›
        </button>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#8A8A9C' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: '#7C5CFF' }} />
            Programmé
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: '#34D399' }} />
            Publié
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: '#FFB74C' }} />À valider
          </span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 8, marginBottom: 8 }}>
        {WEEKDAYS.map((w) => (
          <div key={w} style={{ textAlign: 'center', fontSize: 11.5, fontWeight: 700, color: '#7E7E92', letterSpacing: '.04em' }}>
            {w}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 8 }}>
        {cells.map((c, i) => {
          if (c.day == null) return <div key={i} style={{ minHeight: 96, borderRadius: 12, background: 'transparent' }} />;
          const isToday = c.day === TODAY.getDate() && m === TODAY.getMonth() && y === TODAY.getFullYear();
          const evs = events[c.day] || [];
          const shown = evs.slice(0, 2);
          return (
            <div key={i} style={{ minHeight: 96, borderRadius: 12, padding: 8, background: isToday ? 'rgba(124,92,255,.1)' : 'rgba(255,255,255,.02)', border: `1px solid ${isToday ? 'rgba(124,92,255,.5)' : 'rgba(255,255,255,.06)'}` }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: isToday ? '#A78BFA' : '#B9B9C8' }}>{c.day}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
                {shown.map((e, j) => (
                  <div key={j} style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: e.c, borderRadius: 5, padding: '2px 6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {e.h}
                  </div>
                ))}
                {evs.length > 2 && <div style={{ fontSize: 10, color: '#8A8A9C', fontWeight: 600 }}>+{evs.length - 2}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

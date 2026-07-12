import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { PlatformBadge, MiniWave, chipStyle, toggleTrackStyle, toggleKnobStyle } from '../components/common';
import { DEFAULT_SCENE_FULLS, nicheName } from '../data/niches';
import { SEED_VIDEOS } from '../data/seedVideos';
import { useVideos } from '../lib/VideosContext';
import type { Platform, TransitionType } from '../types';

interface EditingVideo {
  hook: string;
  niche: string; // display name
  bg: string;
  plat: Platform;
  sceneFulls?: string[];
  script?: string;
}

const TRANS_OPTS: [TransitionType, string][] = [
  ['cut', 'Coupe'],
  ['fade', 'Fondu'],
  ['slide', 'Glissé'],
  ['zoom', 'Zoom'],
];
const TRANS_ANIM: Record<TransitionType, string | undefined> = {
  cut: undefined,
  fade: 'trFade .45s ease both',
  slide: 'trSlide .5s cubic-bezier(.4,0,.2,1) both',
  zoom: 'trZoom .5s ease both',
};

const SCENE_META = [
  { label: 'Hook', bg: 'linear-gradient(150deg,#9D6BFF,#7C2D6B)', src: 'IA' },
  { label: 'Contexte', bg: 'linear-gradient(150deg,#7C2D6B,#3B1D4E)', src: 'IA' },
  { label: 'Tension', bg: 'linear-gradient(150deg,#4C1D95,#7C5CFF)', src: 'Stock' },
  { label: 'Preuve', bg: 'linear-gradient(150deg,#2D3E9E,#5CC8FF)', src: 'IA' },
  { label: 'CTA', bg: 'linear-gradient(150deg,#0EA5A5,#34D399)', src: 'IA' },
];

const CAP_STYLE_OPTS: [string, string][] = [
  ['karaoke', 'Karaoké'],
  ['bold', 'Bold + contour'],
  ['neon', 'Néon'],
  ['pill', 'Pilule'],
];
const CAP_PREVIEW: Record<string, React.CSSProperties> = {
  karaoke: { background: '#7C5CFF', color: '#fff', fontWeight: 800, fontSize: 13, padding: '4px 10px', borderRadius: 6 },
  bold: { color: '#fff', fontWeight: 800, fontSize: 15, textShadow: '0 2px 8px rgba(0,0,0,.8)', WebkitTextStroke: '1px rgba(0,0,0,.5)' },
  neon: { color: '#7DF9FF', fontWeight: 800, fontSize: 14, textShadow: '0 0 10px #7DF9FF' },
  pill: { background: 'rgba(0,0,0,.7)', color: '#fff', fontWeight: 700, fontSize: 13, padding: '5px 12px', borderRadius: 20 },
};
const CAP_FONT_OPTS: [string, string][] = [
  ['grotesk', 'Manrope'],
  ['manrope', 'Manrope'],
  ['impact', 'Condensé'],
];
const CAP_COLORS = ['#7C5CFF', '#FFFFFF', '#FFE45C', '#34D399', '#9D6BFF'];
const HI_COLORS = ['#FFE45C', '#7DF9FF', '#9D6BFF', '#34D399'];
const CAP_POS_OPTS: [string, string][] = [
  ['haut', 'Haut'],
  ['centre', 'Centre'],
  ['bas', 'Bas'],
];
const VOICE_OPTS = [
  { key: 'lea', name: 'Léa', desc: 'Féminine · FR · douce', color: '#9D6BFF' },
  { key: 'hugo', name: 'Hugo', desc: 'Masculine · FR · grave', color: '#5CC8FF' },
  { key: 'emma', name: 'Emma', desc: 'Féminine · EN · claire', color: '#34D399' },
  { key: 'noah', name: 'Noah', desc: 'Masculine · EN · énergique', color: '#FFB74C' },
];
const TRACK_OPTS = [
  { key: 'uplift', name: 'Uplifting Beat', genre: 'Énergique', bpm: '128 BPM' },
  { key: 'lofi', name: 'Lo-Fi Chill', genre: 'Calme', bpm: '85 BPM' },
  { key: 'epic', name: 'Epic Cinematic', genre: 'Intense', bpm: '110 BPM' },
  { key: 'trap', name: 'Trap Motiv', genre: 'Puissant', bpm: '140 BPM' },
];
const TRACK_NAME: Record<string, string> = { uplift: 'Uplifting Beat', lofi: 'Lo-Fi Chill', epic: 'Epic Cinematic', trap: 'Trap Motiv' };
const ASPECT_OPTS: [string, string, string][] = [
  ['9:16', 'Vertical', 'Shorts / TikTok / Reels'],
  ['1:1', 'Carré', 'Feed Instagram'],
  ['4:5', 'Portrait', 'Feed vertical'],
];
const ED_TABS: [string, string, string][] = [
  ['script', 'Script', 'doc'],
  ['caption', 'Sous-titres', 'caption'],
  ['voice', 'Voix', 'mic'],
  ['music', 'Musique', 'music'],
  ['visual', 'Visuels', 'img'],
  ['format', 'Format & marque', 'crop'],
];

const fmt1 = (n: number) => `0:${String(Math.round(n)).padStart(2, '0')}`;
const fmtTime = (t: number) => `0:${String(Math.floor(t)).padStart(2, '0')}`;

interface DraftVideo {
  niche: string; // niche key, e.g. 'motivation'
  hook: string;
  script: string;
  sceneFulls: string[];
  platform: Platform;
}

function resolveEditingVideo(id: string | undefined, draft: DraftVideo | undefined, videos: ReturnType<typeof useVideos>['videos']): EditingVideo {
  if (id === 'draft' && draft) {
    return { hook: draft.hook, niche: nicheName(draft.niche), bg: '', plat: draft.platform, sceneFulls: draft.sceneFulls, script: draft.script };
  }
  if (id?.startsWith('seed-')) {
    const idx = Number(id.slice(5));
    const sv = SEED_VIDEOS[idx];
    if (sv) return { hook: sv.hook, niche: nicheName(sv.niche), bg: sv.bg, plat: sv.plat };
  }
  const real = videos.find((v) => v.id === id);
  if (real) {
    return { hook: real.hook, niche: nicheName(real.niche), bg: '', plat: real.platform, sceneFulls: real.scene_fulls, script: real.script };
  }
  return { hook: 'Personne ne viendra te sauver.', niche: nicheName('motivation'), bg: '', plat: 'both' };
}

export function Editor() {
  const { id } = useParams();
  const location = useLocation();
  const { videos } = useVideos();
  const draft = (location.state as any)?.draft as DraftVideo | undefined;
  const realVideo = videos.find((v) => v.id === id);

  const ev = useMemo(() => resolveEditingVideo(id, draft, videos), [id, draft, videos]);

  const [editorTab, setEditorTab] = useState('script');
  const [editorScript, setEditorScript] = useState(ev.script || '');
  const [capStyle, setCapStyle] = useState('karaoke');
  const [capPos, setCapPos] = useState('bas');
  const [edVoice, setEdVoice] = useState('lea');
  const [edTrack, setEdTrack] = useState('uplift');
  const [sceneDurs, setSceneDurs] = useState<number[]>(realVideo?.scene_durations ?? [3, 5, 6, 5, 4]);
  const [sceneTrans, setSceneTrans] = useState<TransitionType[]>((realVideo?.scene_transitions as TransitionType[]) ?? ['cut', 'fade', 'slide', 'zoom', 'fade']);
  const [edPlaying, setEdPlaying] = useState(false);
  const [edTime, setEdTime] = useState(0);
  const [edMuted, setEdMuted] = useState(false);
  const [edAspect, setEdAspect] = useState<'9:16' | '1:1' | '4:5'>('9:16');
  const [edLogo, setEdLogo] = useState(true);
  const [edFont, setEdFont] = useState('grotesk');
  const [edCapSize, setEdCapSize] = useState(100);
  const [edCapColor, setEdCapColor] = useState('#7C5CFF');
  const [edHighlight, setEdHighlight] = useState('#FFE45C');
  const [edFadeIn, setEdFadeIn] = useState(true);
  const [edFadeOut, setEdFadeOut] = useState(true);
  const [edIntro, setEdIntro] = useState(false);
  const [edOutro, setEdOutro] = useState(true);
  const [edSpeed, setEdSpeed] = useState(100);
  const [edPitch, setEdPitch] = useState(50);

  const playTimer = useRef<number | undefined>(undefined);
  const transResetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => {
    window.clearInterval(playTimer.current);
    window.clearTimeout(transResetTimer.current);
  }, []);

  const DUR = sceneDurs.reduce((a, b) => a + b, 0);

  const sf = (i: number) => ev.sceneFulls?.[i] ?? (i === 0 ? ev.hook : DEFAULT_SCENE_FULLS[i]);
  const SCENES = useMemo(() => {
    let acc = 0;
    return SCENE_META.map((m, i) => {
      const start = acc;
      const dur = sceneDurs[i];
      acc += dur;
      return { ...m, full: sf(i), start, end: acc, dur };
    });
  }, [sceneDurs, ev]);

  let actIdx = SCENES.findIndex((sc) => edTime >= sc.start && edTime < sc.end);
  if (actIdx < 0) actIdx = edTime >= DUR ? SCENES.length - 1 : 0;
  const act = SCENES[actIdx];
  const curTrans = sceneTrans[actIdx] || 'cut';

  const togglePlay = () => {
    if (edPlaying) {
      window.clearInterval(playTimer.current);
      setEdPlaying(false);
      return;
    }
    setEdTime((t) => (t >= DUR - 0.05 ? 0 : t));
    setEdPlaying(true);
    playTimer.current = window.setInterval(() => {
      setEdTime((t) => {
        const nt = t + 0.1;
        if (nt >= DUR) {
          window.clearInterval(playTimer.current);
          setEdPlaying(false);
          return DUR;
        }
        return nt;
      });
    }, 100);
  };

  const seekBar = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    setEdTime(pct * DUR);
  };

  const trimScene = (idx: number, delta: number) => {
    setSceneDurs((durs) => {
      const nd = [...durs];
      const partner = idx < nd.length - 1 ? idx + 1 : idx - 1;
      let d = Math.max(-(nd[idx] - 1), Math.min(nd[partner] - 1, delta));
      nd[idx] = +(nd[idx] + d).toFixed(1);
      nd[partner] = +(nd[partner] - d).toFixed(1);
      return nd;
    });
  };
  const resetTrim = () => setSceneDurs([3, 5, 6, 5, 4]);

  const sumBefore = (idx: number) => sceneDurs.slice(0, idx).reduce((a, b) => a + b, 0);
  const setTrans = (idx: number, type: TransitionType) => {
    setSceneTrans((a) => {
      const nd = [...a];
      nd[idx] = type;
      return nd;
    });
    setEdTime(0.001);
    window.clearTimeout(transResetTimer.current);
    transResetTimer.current = window.setTimeout(() => setEdTime(sumBefore(idx) + 0.05), 20);
  };

  const trimDown = (idx: number) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const track = (e.currentTarget as HTMLElement).parentElement!.parentElement as HTMLElement;
    const perSec = track.getBoundingClientRect().width / DUR;
    const startX = e.clientX;
    const base = [...sceneDurs];
    const move = (ev2: PointerEvent) => {
      let dsec = (ev2.clientX - startX) / perSec;
      const a = base[idx];
      const b = base[idx + 1];
      dsec = Math.max(-(a - 1), Math.min(b - 1, dsec));
      const nd = [...base];
      nd[idx] = +(a + dsec).toFixed(1);
      nd[idx + 1] = +(b - dsec).toFixed(1);
      setSceneDurs(nd);
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };

  const cs = edCapSize / 100;
  const capMap: Record<string, React.CSSProperties> = {
    karaoke: { background: edCapColor, color: '#fff', fontWeight: 800, fontSize: Math.round(13 * cs), padding: '4px 10px', borderRadius: 6, lineHeight: 1.5 },
    bold: { color: '#fff', fontWeight: 800, fontSize: Math.round(15 * cs), textShadow: '0 2px 8px rgba(0,0,0,.8)', WebkitTextStroke: '1px rgba(0,0,0,.5)' },
    neon: { color: edCapColor, fontWeight: 800, fontSize: Math.round(14 * cs), textShadow: `0 0 10px ${edCapColor}` },
    pill: { background: 'rgba(0,0,0,.7)', color: '#fff', fontWeight: 700, fontSize: Math.round(13 * cs), padding: '5px 12px', borderRadius: 20 },
  };

  // script stats
  const words = (editorScript || '').trim().split(/\s+/).filter(Boolean).length;
  const estDur = Math.max(1, Math.round(words / 2.6));
  const hookLen = ((editorScript || '').split('\n')[0] || '').length;
  const hookScore = hookLen > 0 && hookLen <= 45 ? 92 : hookLen <= 70 ? 68 : 40;
  const hookLabel = hookScore >= 85 ? 'Excellent' : hookScore >= 60 ? 'Correct' : 'À raccourcir';
  const hookColor = hookScore >= 85 ? '#34D399' : hookScore >= 60 ? '#FFB74C' : '#FF7A7A';

  const trackColors: Record<string, string> = { Visuel: '#7C5CFF', Voix: '#9D6BFF', 'Sous-titres': '#34D399', Musique: '#FFB74C' };
  const timelineTracks: [string, number[]][] = [
    ['Visuel', SCENES.map((s) => s.dur)],
    ['Voix', SCENES.map((s) => s.dur)],
    ['Sous-titres', SCENES.map((s) => s.dur)],
    ['Musique', [DUR]],
  ];
  const ruler = [0, 5, 10, 15, 20].filter((s) => s <= DUR + 4).map((sec) => ({ label: `0:${String(sec).padStart(2, '0')}`, left: (sec / DUR) * 100 + '%' }));
  const prog = edTime / DUR;
  const aspectCss = { '9:16': '9 / 16', '1:1': '1 / 1', '4:5': '4 / 5' }[edAspect];

  return (
    <div style={{ animation: 'fadeUp .35s ease both', display: 'grid', gridTemplateColumns: '320px 1fr', gap: 26, alignItems: 'start' }}>
      {/* canvas */}
      <div style={{ position: 'sticky', top: 96 }}>
        <div style={{ position: 'relative', aspectRatio: aspectCss, borderRadius: 22, overflow: 'hidden', border: '1px solid rgba(255,255,255,.12)', background: '#0A0A0F', boxShadow: '0 26px 60px rgba(0,0,0,.5)', transition: 'aspect-ratio .3s' }}>
          <div key={actIdx + '-' + curTrans} style={{ position: 'absolute', inset: 0, background: act.bg, animation: TRANS_ANIM[curTrans] }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.18),rgba(0,0,0,.58))' }} />
            <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: 'rgba(124,92,255,.7)', padding: '3px 9px', borderRadius: 20 }}>◆ {act.label}</span>
              <PlatformBadge plat={ev.plat} />
            </div>
            {actIdx === 0 && (
              <div style={{ position: 'absolute', left: 16, right: 16, top: '44%', transform: 'translateY(-50%)', textAlign: 'center', fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: 22, lineHeight: 1.12, color: '#fff', textShadow: '0 3px 16px rgba(0,0,0,.55)' }}>
                {ev.hook}
              </div>
            )}
            <div style={{ position: 'absolute', left: 16, right: 16, bottom: capPos === 'bas' ? 52 : 'auto', top: capPos === 'haut' ? '18%' : capPos === 'centre' ? '50%' : 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <span style={capMap[capStyle]}>{act.full}</span>
            </div>
          </div>
          {edLogo && <div style={{ position: 'absolute', top: 52, right: 14, fontFamily: 'Manrope', fontWeight: 700, fontSize: 11, color: '#fff', opacity: 0.75, letterSpacing: '.02em' }}>⚡ Cadence</div>}
          <div style={{ position: 'absolute', bottom: 14, left: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'flex', color: '#fff' }}>
              <Icon name="music" size={15} />
            </span>
            <span style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{TRACK_NAME[edTrack]}</span>
          </div>
          <button onClick={() => setEdMuted((m) => !m)} style={{ position: 'absolute', bottom: 12, right: 12, width: 30, height: 30, borderRadius: 9, border: 'none', background: 'rgba(0,0,0,.45)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={edMuted ? 'mute' : 'volume'} size={15} />
          </button>
        </div>

        {/* scrubber */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
          <button onClick={togglePlay} style={{ width: 40, height: 40, borderRadius: '50%', background: '#7C5CFF', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none', boxShadow: '0 6px 18px rgba(124,92,255,.4)' }}>
            <Icon name={edPlaying ? 'pause' : 'play'} size={18} />
          </button>
          <div onClick={seekBar} style={{ flex: 1, height: 14, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ flex: 1, height: 6, borderRadius: 10, background: 'rgba(255,255,255,.12)', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${prog * 100}%`, borderRadius: 10, background: 'linear-gradient(90deg,#7C5CFF,#9D6BFF)' }} />
              <div style={{ position: 'absolute', left: `${prog * 100}%`, top: '50%', transform: 'translate(-50%,-50%)', width: 14, height: 14, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,.4)' }} />
            </div>
          </div>
          <span style={{ fontSize: 12, color: '#8A8A9C', fontVariantNumeric: 'tabular-nums', flex: 'none' }}>
            {fmtTime(edTime)} / {fmtTime(DUR)}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 14 }}>
          <button style={{ flex: 1, background: 'rgba(255,255,255,.05)', color: '#C9C9D6', border: '1px solid rgba(255,255,255,.1)', padding: 10, borderRadius: 11, fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Aperçu plein écran</button>
          <button style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: 'linear-gradient(135deg,#7C5CFF,#9D6BFF)', color: '#fff', border: 'none', padding: 10, borderRadius: 11, fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 8px 20px rgba(124,92,255,.35)' }}>
            Exporter MP4
          </button>
        </div>
      </div>

      {/* editing panels */}
      <div>
        <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid rgba(255,255,255,.08)', marginBottom: 20, overflowX: 'auto' }}>
          {ED_TABS.map(([k, l, ic]) => (
            <button
              key={k}
              onClick={() => setEditorTab(k)}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 13px', background: 'none', border: 'none', borderBottom: `2px solid ${editorTab === k ? '#7C5CFF' : 'transparent'}`, color: editorTab === k ? '#F3F3F6' : '#8A8A9C', fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, cursor: 'pointer', marginBottom: -1, whiteSpace: 'nowrap' }}
            >
              <span style={{ display: 'flex' }}>
                <Icon name={ic as any} size={15} />
              </span>
              {l}
            </button>
          ))}
        </div>

        {editorTab === 'script' && (
          <div style={{ animation: 'fadeUp .25s ease both' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Mots', value: String(words) },
                { label: 'Durée estimée', value: `~0:${String(estDur).padStart(2, '0')}` },
                { label: 'Scènes', value: String(SCENES.length) },
              ].map((st) => (
                <div key={st.label} style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '12px 14px', background: 'rgba(255,255,255,.02)' }}>
                  <div style={{ fontSize: 11.5, color: '#8A8A9C', fontWeight: 600 }}>{st.label}</div>
                  <div style={{ fontFamily: 'Manrope', fontSize: 19, fontWeight: 600, marginTop: 3 }}>{st.value}</div>
                </div>
              ))}
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '14px 16px', background: 'rgba(255,255,255,.02)', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 8 }}>
                <span style={{ fontWeight: 700 }}>Force du hook</span>
                <span style={{ fontWeight: 700, color: hookColor }}>{hookLabel}</span>
              </div>
              <div style={{ height: 7, borderRadius: 8, background: 'rgba(255,255,255,.06)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 8, background: hookColor, width: `${hookScore}%`, transition: 'width .3s' }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <label style={{ fontSize: 13, fontWeight: 700 }}>Script complet</label>
              <span style={{ fontSize: 11.5, color: '#7C5CFF', background: 'rgba(124,92,255,.14)', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>✨ Généré par IA</span>
            </div>
            <textarea
              value={editorScript}
              onChange={(e) => setEditorScript(e.target.value)}
              style={{ width: '100%', minHeight: 150, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 14, padding: 16, color: '#F3F3F6', fontSize: 14, lineHeight: 1.6, resize: 'vertical' }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(124,92,255,.14)', color: '#A78BFA', border: '1px solid rgba(124,92,255,.3)', padding: '10px 16px', borderRadius: 11, fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                <Icon name="sparkles" size={16} /> Régénérer
              </button>
              <button style={{ background: 'rgba(255,255,255,.04)', color: '#C9C9D6', border: '1px solid rgba(255,255,255,.1)', padding: '10px 16px', borderRadius: 11, fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Raccourcir</button>
              <button style={{ background: 'rgba(255,255,255,.04)', color: '#C9C9D6', border: '1px solid rgba(255,255,255,.1)', padding: '10px 16px', borderRadius: 11, fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Traduire</button>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, margin: '22px 0 12px' }}>Découpage en scènes</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SCENES.map((sc, i) => (
                <div
                  key={sc.label}
                  onClick={() => setEdTime(sc.start + 0.01)}
                  style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '11px 13px', borderRadius: 11, cursor: 'pointer', background: i === actIdx ? 'rgba(124,92,255,.1)' : 'rgba(255,255,255,.02)', border: `1px solid ${i === actIdx ? 'rgba(124,92,255,.4)' : 'rgba(255,255,255,.07)'}` }}
                >
                  <span style={{ width: 26, height: 26, borderRadius: 8, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Manrope', fontWeight: 700, fontSize: 12, background: i === actIdx ? '#7C5CFF' : 'rgba(255,255,255,.06)', color: i === actIdx ? '#fff' : '#8A8A9C' }}>{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{sc.full}</div>
                    <div style={{ fontSize: 11.5, color: '#8A8A9C', marginTop: 2 }}>{sc.label}</div>
                  </div>
                  <span style={{ fontSize: 11.5, color: '#7E7E92', fontVariantNumeric: 'tabular-nums', flex: 'none' }}>
                    {fmt1(sc.start)} – {fmt1(sc.end)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {editorTab === 'caption' && (
          <div style={{ animation: 'fadeUp .25s ease both' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Style des sous-titres</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
              {CAP_STYLE_OPTS.map(([k, l]) => (
                <button key={k} onClick={() => setCapStyle(k)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 18, borderRadius: 14, cursor: 'pointer', background: '#111118', border: `1px solid ${capStyle === k ? 'rgba(124,92,255,.6)' : 'rgba(255,255,255,.09)'}` }}>
                  <span style={CAP_PREVIEW[k]}>Aa</span>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: '#B9B9C8' }}>{l}</span>
                </button>
              ))}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, margin: '20px 0 10px' }}>Police</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {CAP_FONT_OPTS.map(([k, l]) => (
                <button key={k} onClick={() => setEdFont(k)} style={chipStyle(edFont === k)}>
                  {l}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, margin: '20px 0 10px' }}>Taille · {edCapSize}%</div>
            <input type="range" min={70} max={150} value={edCapSize} onChange={(e) => setEdCapSize(+e.target.value)} style={{ width: '100%', accentColor: '#7C5CFF' }} />
            <div style={{ display: 'flex', gap: 30, marginTop: 20 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Couleur du texte</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {CAP_COLORS.map((c) => (
                    <span key={c} onClick={() => setEdCapColor(c)} style={{ width: 30, height: 30, borderRadius: 9, cursor: 'pointer', background: c, border: `2px solid ${edCapColor === c ? '#fff' : 'rgba(255,255,255,.15)'}`, boxShadow: edCapColor === c ? '0 0 0 2px #7C5CFF' : 'none', display: 'inline-block' }} />
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Surbrillance</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {HI_COLORS.map((c) => (
                    <span key={c} onClick={() => setEdHighlight(c)} style={{ width: 30, height: 30, borderRadius: 9, cursor: 'pointer', background: c, border: `2px solid ${edHighlight === c ? '#fff' : 'rgba(255,255,255,.15)'}`, boxShadow: edHighlight === c ? '0 0 0 2px #7C5CFF' : 'none', display: 'inline-block' }} />
                  ))}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, margin: '22px 0 10px' }}>Position</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {CAP_POS_OPTS.map(([k, l]) => (
                <button key={k} onClick={() => setCapPos(k)} style={chipStyle(capPos === k)}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}

        {editorTab === 'voice' && (
          <div style={{ animation: 'fadeUp .25s ease both' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Voix off</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {VOICE_OPTS.map((v) => (
                <div key={v.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, cursor: 'pointer', background: 'rgba(255,255,255,.02)', border: `1px solid ${edVoice === v.key ? 'rgba(124,92,255,.5)' : 'rgba(255,255,255,.08)'}` }}>
                  <button onClick={() => setEdVoice(v.key)} style={{ width: 36, height: 36, borderRadius: 10, background: v.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flex: 'none', border: 'none', cursor: 'pointer' }}>
                    <Icon name="mic" size={16} />
                  </button>
                  <div onClick={() => setEdVoice(v.key)} style={{ flex: 1, textAlign: 'left', cursor: 'pointer' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>{v.name}</div>
                    <div style={{ fontSize: 11.5, color: '#8A8A9C' }}>{v.desc}</div>
                  </div>
                  <button style={{ width: 30, height: 30, borderRadius: 9, border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.04)', color: '#A78BFA', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }} title="Écouter un extrait">
                    <Icon name="play" size={13} />
                  </button>
                  {edVoice === v.key ? (
                    <span style={{ display: 'flex', color: '#7C5CFF', flex: 'none' }}>
                      <Icon name="check" size={18} />
                    </span>
                  ) : (
                    <span style={{ width: 18 }} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
                <span>Vitesse</span>
                <span style={{ color: '#8A8A9C' }}>{edSpeed}%</span>
              </div>
              <input type="range" min={80} max={120} value={edSpeed} onChange={(e) => setEdSpeed(+e.target.value)} style={{ width: '100%', accentColor: '#7C5CFF' }} />
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
                <span>Tonalité</span>
                <span style={{ color: '#8A8A9C' }}>{edPitch}%</span>
              </div>
              <input type="range" min={0} max={100} value={edPitch} onChange={(e) => setEdPitch(+e.target.value)} style={{ width: '100%', accentColor: '#7C5CFF' }} />
            </div>
          </div>
        )}

        {editorTab === 'music' && (
          <div style={{ animation: 'fadeUp .25s ease both' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Musique de fond</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {TRACK_OPTS.map((m) => (
                <div key={m.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, cursor: 'pointer', background: 'rgba(255,255,255,.02)', border: `1px solid ${edTrack === m.key ? 'rgba(124,92,255,.5)' : 'rgba(255,255,255,.08)'}` }}>
                  <button onClick={() => setEdTrack(m.key)} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(124,92,255,.16)', color: '#A78BFA', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', border: 'none', cursor: 'pointer' }}>
                    <Icon name="music" size={15} />
                  </button>
                  <div onClick={() => setEdTrack(m.key)} style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>{m.name}</div>
                    <div style={{ fontSize: 11.5, color: '#8A8A9C' }}>
                      {m.genre} · {m.bpm}
                    </div>
                  </div>
                  <span style={{ flex: 'none' }}>
                    <MiniWave active={edTrack === m.key} />
                  </span>
                  {edTrack === m.key ? (
                    <span style={{ display: 'flex', color: '#7C5CFF', flex: 'none' }}>
                      <Icon name="check" size={18} />
                    </span>
                  ) : (
                    <span style={{ width: 18 }} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Volume musique</div>
              <input type="range" min={0} max={100} defaultValue={35} style={{ width: '100%', accentColor: '#7C5CFF' }} />
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 18 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setEdFadeIn((v) => !v)}>
                <span style={toggleTrackStyle(edFadeIn)}>
                  <span style={toggleKnobStyle(edFadeIn)} />
                </span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Fondu d'entrée</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setEdFadeOut((v) => !v)}>
                <span style={toggleTrackStyle(edFadeOut)}>
                  <span style={toggleKnobStyle(edFadeOut)} />
                </span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Fondu de sortie</span>
              </label>
            </div>
          </div>
        )}

        {editorTab === 'visual' && (
          <div style={{ animation: 'fadeUp .25s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Séquences visuelles</div>
              <span style={{ fontSize: 11.5, color: '#8A8A9C' }}>Clique une scène pour l'aperçu</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
              {SCENES.map((sc, i) => (
                <div key={sc.label} onClick={() => setEdTime(sc.start + 0.01)} style={{ aspectRatio: '9/16', borderRadius: 11, background: sc.bg, position: 'relative', overflow: 'hidden', cursor: 'pointer', border: `2px solid ${i === actIdx ? '#7C5CFF' : 'rgba(255,255,255,.1)'}` }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent,rgba(0,0,0,.4))' }} />
                  <span style={{ position: 'absolute', top: 5, right: 5, fontSize: 8, fontWeight: 700, color: '#fff', background: sc.src === 'IA' ? 'rgba(124,92,255,.85)' : 'rgba(0,0,0,.6)', padding: '2px 5px', borderRadius: 5 }}>{sc.src}</span>
                  <span style={{ position: 'absolute', bottom: 5, left: 6, fontSize: 9, fontWeight: 700, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,.6)' }}>{sc.label}</span>
                </div>
              ))}
            </div>
            <button style={{ width: '100%', marginTop: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(124,92,255,.14)', color: '#A78BFA', border: '1px dashed rgba(124,92,255,.4)', padding: 12, borderRadius: 12, fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              <Icon name="sparkles" size={16} /> Générer de nouveaux visuels IA
            </button>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button style={{ flex: 1, background: 'rgba(255,255,255,.04)', color: '#C9C9D6', border: '1px solid rgba(255,255,255,.1)', padding: 11, borderRadius: 11, fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Importer un média</button>
              <button style={{ flex: 1, background: 'rgba(255,255,255,.04)', color: '#C9C9D6', border: '1px solid rgba(255,255,255,.1)', padding: 11, borderRadius: 11, fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Banque d'images</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '24px 0 6px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="scissors" size={16} /> Découpe des scènes
              </div>
              <button onClick={resetTrim} style={{ background: 'none', border: 'none', color: '#7E7E92', fontFamily: 'Manrope', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                Réinitialiser
              </button>
            </div>
            <p style={{ fontSize: 12, color: '#8A8A9C', margin: '0 0 12px' }}>Glisse les poignées entre les scènes pour ajuster leur durée, ou utilise − / +.</p>
            <div style={{ display: 'flex', gap: 4, alignItems: 'stretch', padding: '4px 0' }}>
              {SCENES.map((sc, i) => (
                <div
                  key={sc.label}
                  onClick={() => setEdTime(sc.start + 0.01)}
                  title={sc.label}
                  style={{ position: 'relative', flex: sc.dur, minWidth: 34, height: 56, borderRadius: 9, background: sc.bg, cursor: 'pointer', border: `2px solid ${i === actIdx ? '#fff' : 'rgba(255,255,255,.14)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}
                >
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent,rgba(0,0,0,.35))', borderRadius: 7 }} />
                  <span style={{ position: 'relative', fontSize: 10, fontWeight: 700, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,.7)', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 4px' }}>{sc.label}</span>
                  <span style={{ position: 'relative', fontSize: 11, fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums', textShadow: '0 1px 3px rgba(0,0,0,.7)' }}>{sc.dur.toFixed(1).replace(/\.0$/, '')}s</span>
                  <span style={{ position: 'absolute', bottom: 4, display: 'flex', gap: 6, zIndex: 2 }}>
                    <button onClick={(e) => { e.stopPropagation(); trimScene(i, -0.5); }} style={{ width: 18, height: 18, borderRadius: 5, border: 'none', background: 'rgba(0,0,0,.5)', color: '#fff', fontWeight: 800, fontSize: 12, lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      −
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); trimScene(i, 0.5); }} style={{ width: 18, height: 18, borderRadius: 5, border: 'none', background: 'rgba(0,0,0,.5)', color: '#fff', fontWeight: 800, fontSize: 12, lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      +
                    </button>
                  </span>
                  {i < SCENES.length - 1 && (
                    <div onPointerDown={trimDown(i)} style={{ position: 'absolute', top: 0, bottom: 0, right: -6, width: 14, cursor: 'col-resize', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ width: 4, height: 26, borderRadius: 3, background: '#fff', boxShadow: '0 0 6px rgba(0,0,0,.5)' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: 11.5, color: '#7E7E92', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>Durée totale · {fmt1(DUR)}</div>

            <div style={{ fontSize: 13, fontWeight: 700, margin: '24px 0 4px' }}>Transitions entre scènes</div>
            <p style={{ fontSize: 12, color: '#8A8A9C', margin: '0 0 12px' }}>Choisis l'effet à l'entrée de chaque scène. L'aperçu se rejoue à la sélection.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SCENES.slice(1).map((sc, k) => {
                const i = k + 1;
                return (
                  <div key={sc.label} style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: '10px 12px', background: 'rgba(255,255,255,.02)' }}>
                    <div style={{ width: 120, flex: 'none', fontSize: 12, fontWeight: 600, color: '#B9B9C8', display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{SCENES[i - 1].label}</span>
                      <span style={{ color: '#5A5A6C', flex: 'none' }}>→</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sc.label}</span>
                    </div>
                    <div style={{ flex: 1, display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {TRANS_OPTS.map(([type, label]) => (
                        <button
                          key={type}
                          onClick={() => setTrans(i, type)}
                          style={{ padding: '6px 11px', borderRadius: 9, cursor: 'pointer', fontFamily: 'Manrope', fontWeight: 600, fontSize: 12, border: `1px solid ${sceneTrans[i] === type ? 'rgba(124,92,255,.55)' : 'rgba(255,255,255,.1)'}`, background: sceneTrans[i] === type ? 'rgba(124,92,255,.18)' : 'transparent', color: sceneTrans[i] === type ? '#A78BFA' : '#8A8A9C' }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {editorTab === 'format' && (
          <div style={{ animation: 'fadeUp .25s ease both' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Format d'export</div>
            <div style={{ display: 'flex', gap: 12 }}>
              {ASPECT_OPTS.map(([k, l, d]) => (
                <button key={k} onClick={() => setEdAspect(k as any)} style={{ flex: 1, padding: 14, borderRadius: 13, cursor: 'pointer', textAlign: 'left', background: edAspect === k ? 'rgba(124,92,255,.1)' : 'rgba(255,255,255,.02)', border: `1px solid ${edAspect === k ? 'rgba(124,92,255,.5)' : 'rgba(255,255,255,.09)'}` }}>
                  <div style={{ width: 28, height: k === '9:16' ? 40 : k === '1:1' ? 28 : 35, borderRadius: 5, background: edAspect === k ? '#7C5CFF' : 'rgba(255,255,255,.12)', marginBottom: 10 }} />
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>
                    {k} · {l}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#8A8A9C', marginTop: 2 }}>{d}</div>
                </button>
              ))}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, margin: '22px 0 12px' }}>Marque</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: 14, background: 'rgba(255,255,255,.02)' }} onClick={() => setEdLogo((v) => !v)}>
                <span style={toggleTrackStyle(edLogo)}>
                  <span style={toggleKnobStyle(edLogo)} />
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>Filigrane / logo</div>
                  <div style={{ fontSize: 12, color: '#8A8A9C' }}>Affiche « ⚡ Cadence » en haut à droite</div>
                </div>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: 14, background: 'rgba(255,255,255,.02)' }} onClick={() => setEdIntro((v) => !v)}>
                <span style={toggleTrackStyle(edIntro)}>
                  <span style={toggleKnobStyle(edIntro)} />
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>Intro animée (0,5s)</div>
                  <div style={{ fontSize: 12, color: '#8A8A9C' }}>Logo animé au démarrage</div>
                </div>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: 14, background: 'rgba(255,255,255,.02)' }} onClick={() => setEdOutro((v) => !v)}>
                <span style={toggleTrackStyle(edOutro)}>
                  <span style={toggleKnobStyle(edOutro)} />
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>Call-to-action final</div>
                  <div style={{ fontSize: 12, color: '#8A8A9C' }}>« Abonne-toi » sur la dernière scène</div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* timeline */}
        <div style={{ marginTop: 26, border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 16, background: 'rgba(255,255,255,.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: '#8A8A9C', fontWeight: 700, letterSpacing: '.03em' }}>TIMELINE</span>
            <span style={{ fontSize: 11.5, color: '#7E7E92', fontVariantNumeric: 'tabular-nums' }}>
              {fmtTime(edTime)} / {fmtTime(DUR)}
            </span>
          </div>
          <div style={{ position: 'relative', paddingLeft: 78 }}>
            <div style={{ position: 'relative', height: 16, marginBottom: 4 }}>
              {ruler.map((r) => (
                <span key={r.label} style={{ position: 'absolute', left: r.left, fontSize: 10, color: '#5A5A6C', transform: 'translateX(-2px)' }}>
                  {r.label}
                </span>
              ))}
            </div>
            <div style={{ position: 'absolute', top: 16, bottom: 0, left: `${prog * 100}%`, marginLeft: 78, width: 2, background: '#9D6BFF', boxShadow: '0 0 8px #9D6BFF', zIndex: 2, pointerEvents: 'none' }}>
              <span style={{ position: 'absolute', top: -5, left: -4, width: 10, height: 10, borderRadius: '50%', background: '#9D6BFF' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 2 }}>
            {timelineTracks.map(([label, segs]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 68, fontSize: 11, color: '#8A8A9C', fontWeight: 600, flex: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 3, background: trackColors[label] }} />
                  {label}
                </span>
                <div style={{ flex: 1, display: 'flex', gap: 4 }}>
                  {segs.map((w, i) => (
                    <span key={i} style={{ flex: w, height: 22, borderRadius: 5, background: trackColors[label], opacity: 0.4 + (i % 3) * 0.2 }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

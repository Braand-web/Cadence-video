import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { WaveBars, chipStyle } from '../components/common';
import { NICHES, STAGES, genContent } from '../data/niches';
import { useVideos } from '../lib/VideosContext';
import type { ReferenceFile } from '../types';

type PipeState = { running: boolean; idx: number; pcts: number[]; done: boolean };
const EMPTY_PIPE: PipeState = { running: false, idx: 0, pcts: [0, 0, 0, 0, 0], done: false };

const STYLE_OPTS: [string, string][] = [
  ['minimal', 'Minimal'],
  ['cine', 'Cinématique'],
  ['retro', 'Rétro'],
  ['bold', 'Bold Text'],
  ['neon', 'Néon'],
];
const VOICE_OPTS: [string, string][] = [
  ['lea', 'Léa · FR'],
  ['hugo', 'Hugo · FR'],
  ['emma', 'Emma · EN'],
  ['noah', 'Noah · EN'],
];
const LANG_OPTS: [string, string][] = [
  ['fr', 'Français'],
  ['en', 'English'],
  ['es', 'Español'],
];

export function CreateFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addVideo } = useVideos();
  const presetNiche = (location.state as { niche?: string } | null)?.niche;

  const [step, setStep] = useState(0);
  const [niche, setNiche] = useState(presetNiche || 'motivation');
  const [videoIdea, setVideoIdea] = useState('');
  const [refs, setRefs] = useState<ReferenceFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const [perDay, setPerDay] = useState(3);
  const [times, setTimes] = useState<Record<string, boolean>>({ '08:00': true, '12:00': false, '18:30': true, '21:00': false });
  const [style, setStyle] = useState('cine');
  const [voice, setVoice] = useState('lea');
  const [lang, setLang] = useState('fr');
  const [validate, setValidate] = useState(true);

  const [pipe, setPipe] = useState<PipeState>(EMPTY_PIPE);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearInterval(timerRef.current), []);

  const startPipe = () => {
    window.clearInterval(timerRef.current);
    setPipe({ running: true, idx: 0, pcts: [0, 0, 0, 0, 0], done: false });
    timerRef.current = window.setInterval(() => {
      setPipe((p) => {
        if (p.done) {
          window.clearInterval(timerRef.current);
          return p;
        }
        const pcts = [...p.pcts];
        const i = p.idx;
        pcts[i] = Math.min(100, pcts[i] + (7 + Math.random() * 15));
        let idx: number = p.idx;
        let done: boolean = p.done;
        let running: boolean = p.running;
        if (pcts[i] >= 100) {
          pcts[i] = 100;
          if (i < 4) idx = i + 1;
          else {
            done = true;
            running = false;
            window.clearInterval(timerRef.current);
          }
        }
        return { running, idx, pcts, done };
      });
    }, 190);
  };

  const next = () => {
    const ns = step + 1;
    setStep(ns);
    if (ns === 2) window.setTimeout(startPipe, 250);
  };
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const regenerate = () => {
    setPipe(EMPTY_PIPE);
    window.setTimeout(startPipe, 150);
  };

  const addFiles = (fileList: FileList | null) => {
    const files = Array.from(fileList || []).slice(0, 10);
    files.forEach((f) => {
      const isImg = (f.type || '').startsWith('image');
      const isVid = (f.type || '').startsWith('video');
      if (!isImg && !isVid) return;
      if (isImg) {
        const rd = new FileReader();
        rd.onload = () => setRefs((r) => [...r, { name: f.name, type: 'image', url: rd.result as string }]);
        rd.readAsDataURL(f);
      } else {
        const url = URL.createObjectURL(f);
        setRefs((r) => [...r, { name: f.name, type: 'video', url }]);
      }
    });
  };
  const removeRef = (idx: number) => setRefs((r) => r.filter((_, i) => i !== idx));

  const toggleTime = (k: string) => setTimes((t) => ({ ...t, [k]: !t[k] }));

  const nicheObj = NICHES.find((n) => n.key === niche)!;
  const gen = genContent(niche, videoIdea);
  const p = pipe;
  const overall = Math.round(p.pcts.reduce((a, b) => a + b, 0) / 5);

  const preview = {
    dim: p.idx >= 2 || p.done ? 0.55 : 0.9,
    chrome: p.pcts[0] > 20 || p.idx >= 1 || p.done ? 1 : 0.15,
    hook: p.pcts[0] > 40 || p.idx >= 1 || p.done ? 1 : 0,
    hookScale: p.pcts[0] > 40 || p.idx >= 1 || p.done ? 1 : 0.9,
    wave: p.idx === 1 && p.running ? 1 : 0,
    subs: p.idx >= 3 || p.done ? 1 : 0,
    subLine: p.done ? 'sans effort.' : 'chaque jour…',
    music: p.idx >= 3 || p.done ? 1 : 0,
    play: p.done ? 1 : 0,
  };

  const addToQueue = async () => {
    await addVideo({
      niche,
      hook: gen.hook,
      script: gen.scriptText,
      sceneFulls: gen.sceneFulls,
      platform: 'both',
      status: validate ? 'review' : 'scheduled',
      source: gen.fromIdea ? 'idea' : 'niche',
      ideaText: gen.fromIdea ? videoIdea.trim() : null,
    });
    navigate('/app/queue');
  };

  const editGenerated = () => {
    navigate('/app/editor/draft', {
      state: {
        draft: { niche, hook: gen.hook, script: gen.scriptText, sceneFulls: gen.sceneFulls, platform: 'both' },
      },
    });
  };

  const stepDefs = ['Niche', 'Réglages', 'Génération', 'Résultat'];
  const stepShown = Math.min(step, 3);

  return (
    <div style={{ animation: 'fadeUp .35s ease both', maxWidth: 1040, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 30 }}>
        {stepDefs.map((label, i) => {
          const done = i < stepShown;
          const active = i === stepShown;
          return (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 11,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Manrope',
                  fontWeight: 700,
                  fontSize: 15,
                  flex: 'none',
                  background: done ? '#34D399' : active ? 'linear-gradient(135deg,#7C5CFF,#9D6BFF)' : 'rgba(255,255,255,.06)',
                  color: done ? '#04160E' : active ? '#fff' : '#7E7E92',
                  border: `1px solid ${active || done ? 'transparent' : 'rgba(255,255,255,.1)'}`,
                }}
              >
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: '#7E7E92', fontWeight: 600 }}>ÉTAPE {i + 1}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: active || done ? '#F3F3F6' : '#7E7E92' }}>{label}</div>
              </div>
              {i < 3 && <div style={{ flex: 1, height: 2, borderRadius: 2, background: done ? '#34D399' : 'rgba(255,255,255,.1)', margin: '0 6px' }} />}
            </div>
          );
        })}
      </div>

      {step === 0 && (
        <div style={{ animation: 'fadeUp .3s ease both' }}>
          <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: 22, margin: '0 0 4px' }}>Choisis ta niche</h2>
          <p style={{ color: '#8A8A9C', margin: '0 0 22px', fontSize: 14 }}>L'IA générera des scripts adaptés à cette thématique, tous les jours.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {NICHES.map((n) => {
              const selected = niche === n.key;
              return (
                <button
                  key={n.key}
                  onClick={() => setNiche(n.key)}
                  style={{
                    position: 'relative',
                    textAlign: 'left',
                    padding: 20,
                    borderRadius: 16,
                    cursor: 'pointer',
                    fontFamily: 'Manrope',
                    transition: 'transform .15s,border-color .15s',
                    background: selected ? 'rgba(124,92,255,.1)' : 'rgba(255,255,255,.02)',
                    border: `1px solid ${selected ? 'rgba(124,92,255,.5)' : 'rgba(255,255,255,.09)'}`,
                  }}
                >
                  <div style={{ width: 46, height: 46, borderRadius: 13, background: n.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Icon name={n.icon as any} size={22} />
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: 16, marginTop: 14 }}>{n.name}</div>
                  <div style={{ fontSize: 12.5, color: '#8A8A9C', marginTop: 3, lineHeight: 1.35 }}>{n.desc}</div>
                  {selected && (
                    <span style={{ position: 'absolute', top: 14, right: 14, display: 'flex', color: '#7C5CFF' }}>
                      <Icon name="check" size={18} strokeWidth={2.4} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '30px 0 18px' }}>
            <span style={{ height: 1, flex: 1, background: 'rgba(255,255,255,.08)' }} />
            <span style={{ fontSize: 12, color: '#7E7E92', fontWeight: 600, letterSpacing: '.04em' }}>OU DÉCRIS TON IDÉE</span>
            <span style={{ height: 1, flex: 1, background: 'rgba(255,255,255,.08)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 18, alignItems: 'start' }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                Ton idée de vidéo <span style={{ color: '#7E7E92', fontWeight: 500 }}>· optionnel</span>
              </label>
              <textarea
                value={videoIdea}
                onChange={(e) => setVideoIdea(e.target.value)}
                placeholder="Ex : 3 erreurs que font les débutants en muscu, ton direct et cash, avec des exemples concrets…"
                style={{ width: '100%', minHeight: 120, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 14, padding: '14px 16px', color: '#F3F3F6', fontSize: 14, lineHeight: 1.55, resize: 'vertical' }}
              />
              <div style={{ fontSize: 12, color: '#7E7E92', marginTop: 8, lineHeight: 1.5 }}>💡 Plus tu es précis (angle, ton, exemples, public visé), plus le script collera à ta vision. Cadence combine ton idée avec la niche choisie.</div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                Références <span style={{ color: '#7E7E92', fontWeight: 500 }}>· optionnel</span>
              </label>
              <label
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  addFiles(e.dataTransfer.files);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!dragOver) setDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  border: `1.5px dashed ${dragOver ? '#7C5CFF' : 'rgba(255,255,255,.18)'}`,
                  borderRadius: 16,
                  padding: 26,
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: dragOver ? 'rgba(124,92,255,.08)' : 'rgba(255,255,255,.02)',
                  transition: '.15s',
                }}
              >
                <input type="file" accept="image/*,video/*" multiple onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} style={{ display: 'none' }} />
                <span style={{ color: '#7C5CFF', display: 'flex' }}>
                  <Icon name="uploadc" size={22} />
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#C9C9D6' }}>Glisse des images ou vidéos</span>
                <span style={{ fontSize: 11.5, color: '#7E7E92' }}>ou clique pour parcourir · JPG, PNG, MP4</span>
              </label>
              {refs.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
                  {refs.map((r, i) => (
                    <div key={i} style={{ position: 'relative', width: 74, height: 74, borderRadius: 12, overflow: 'hidden', flex: 'none', border: '1px solid rgba(255,255,255,.12)', background: '#14141B', backgroundImage: r.type === 'image' ? `url(${r.url})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                      {r.type === 'video' && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, color: '#A78BFA', background: '#1A1A24', padding: 4 }}>
                          <span style={{ display: 'flex' }}>
                            <Icon name="film" size={20} />
                          </span>
                          <span style={{ fontSize: 8, color: '#8A8A9C', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
                        </div>
                      )}
                      <button onClick={() => removeRef(i)} style={{ position: 'absolute', top: 3, right: 3, width: 20, height: 20, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,.65)', color: '#fff', fontSize: 13, lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 26 }}>
            <button onClick={next} style={{ background: 'linear-gradient(135deg,#7C5CFF,#9D6BFF)', color: '#fff', border: 'none', padding: '12px 26px', borderRadius: 12, fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 8px 24px rgba(124,92,255,.35)' }}>
              Continuer →
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div style={{ animation: 'fadeUp .3s ease both' }}>
          <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: 22, margin: '0 0 4px' }}>Réglages de l'automatisation</h2>
          <p style={{ color: '#8A8A9C', margin: '0 0 22px', fontSize: 14 }}>Définis le rythme et le style. Modifiable à tout moment.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 20, background: 'rgba(255,255,255,.02)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Vidéos par jour</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
                <span style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 34, fontWeight: 600, color: '#A78BFA' }}>{perDay}</span>
                <span style={{ color: '#8A8A9C', fontSize: 13 }}>vidéo(s) / jour</span>
              </div>
              <input type="range" min={1} max={10} value={perDay} onChange={(e) => setPerDay(+e.target.value)} style={{ width: '100%', accentColor: '#7C5CFF' }} />
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 20, background: 'rgba(255,255,255,.02)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Horaires de publication</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {Object.keys(times).map((t) => (
                  <button key={t} onClick={() => toggleTime(t)} style={chipStyle(times[t])}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 20, background: 'rgba(255,255,255,.02)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Style visuel</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {STYLE_OPTS.map(([k, l]) => (
                  <button key={k} onClick={() => setStyle(k)} style={chipStyle(style === k)}>
                    {l}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, margin: '18px 0 12px' }}>Voix off</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {VOICE_OPTS.map(([k, l]) => (
                  <button key={k} onClick={() => setVoice(k)} style={chipStyle(voice === k)}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 20, background: 'rgba(255,255,255,.02)', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Langue</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {LANG_OPTS.map(([k, l]) => (
                    <button key={k} onClick={() => setLang(k)} style={chipStyle(lang === k)}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginTop: 'auto' }} onClick={() => setValidate((v) => !v)}>
                <span style={{ position: 'relative', width: 44, height: 25, borderRadius: 20, flex: 'none', transition: 'background .2s', display: 'inline-block', background: validate ? '#7C5CFF' : 'rgba(255,255,255,.15)' }}>
                  <span style={{ position: 'absolute', top: 3, left: validate ? 22 : 3, width: 19, height: 19, borderRadius: '50%', background: '#fff', transition: 'left .2s' }} />
                </span>
                <span>
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 700 }}>Valider avant de publier</span>
                  <span style={{ display: 'block', fontSize: 12, color: '#8A8A9C' }}>Chaque vidéo attend ton feu vert</span>
                </span>
              </label>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 26 }}>
            <button onClick={prev} style={{ background: 'rgba(255,255,255,.05)', color: '#C9C9D6', border: '1px solid rgba(255,255,255,.1)', padding: '12px 22px', borderRadius: 12, fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              ← Retour
            </button>
            <button onClick={next} style={{ background: 'linear-gradient(135deg,#7C5CFF,#9D6BFF)', color: '#fff', border: 'none', padding: '12px 26px', borderRadius: 12, fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 8px 24px rgba(124,92,255,.35)' }}>
              Générer la 1ʳᵉ vidéo →
            </button>
          </div>
        </div>
      )}

      {step >= 2 && (
        <div style={{ animation: 'fadeUp .3s ease both', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32, alignItems: 'start' }}>
          <div>
            <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: 22, margin: '0 0 4px' }}>{p.done ? 'Ta vidéo est prête 🎬' : 'Génération en cours…'}</h2>
            <p style={{ color: '#8A8A9C', margin: '0 0 16px', fontSize: 14 }}>{p.done ? 'Cadence répètera ce processus automatiquement selon ton planning.' : `Pipeline IA · ${overall}% — hook, voix, visuels, montage, export.`}</p>
            {gen.fromIdea && (
              <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start', border: '1px solid rgba(124,92,255,.3)', background: 'rgba(124,92,255,.08)', borderRadius: 12, padding: '12px 14px', marginBottom: 20 }}>
                <span style={{ display: 'flex', color: '#A78BFA', flex: 'none', marginTop: 1 }}>
                  <Icon name="sparkles" size={16} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', marginBottom: 2 }}>Script basé sur ton idée</div>
                  <div style={{ fontSize: 12.5, color: '#B9B9C8', lineHeight: 1.4 }}>« {videoIdea.trim()} »</div>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {STAGES.map((stg, i) => {
                const active = p.idx === i && !p.done && p.running;
                const done = p.pcts[i] >= 100;
                return (
                  <div
                    key={stg.key}
                    style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: 14, borderRadius: 14, border: `1px solid ${active ? 'rgba(124,92,255,.35)' : 'rgba(255,255,255,.07)'}`, background: active ? 'rgba(124,92,255,.06)' : 'rgba(255,255,255,.015)', transition: '.2s' }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 11,
                        flex: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: '.2s',
                        background: done ? '#34D399' : active ? 'rgba(124,92,255,.2)' : 'rgba(255,255,255,.05)',
                        color: done ? '#04160E' : active ? '#A78BFA' : '#7E7E92',
                        animation: active ? 'pulseDot 1.4s ease-in-out infinite' : undefined,
                      }}
                    >
                      <Icon name={done ? 'check' : (stg.icon as any)} size={18} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: done || active ? '#F3F3F6' : '#8A8A9C' }}>{stg.name}</span>
                        <span style={{ fontSize: 12, color: '#8A8A9C' }}>{done ? 'Terminé' : active ? 'En cours…' : 'En attente'}</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#8A8A9C', marginTop: 1 }}>{stg.desc}</div>
                      <div style={{ height: 5, borderRadius: 10, background: 'rgba(255,255,255,.08)', marginTop: 9, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 10, background: 'linear-gradient(90deg,#7C5CFF,#9D6BFF)', width: `${Math.round(p.pcts[i])}%`, transition: 'width .18s linear' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {p.done && (
              <>
                <div style={{ marginTop: 26, border: '1px solid rgba(52,211,153,.3)', background: 'rgba(52,211,153,.08)', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, animation: 'fadeUp .4s ease both' }}>
                  <span style={{ width: 36, height: 36, borderRadius: 10, background: '#34D399', color: '#04160E', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    <Icon name="check" size={18} strokeWidth={2.4} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Vidéo prête — export MP4 · 1080×1920</div>
                    <div style={{ fontSize: 12.5, color: '#8A8A9C' }}>Ouvre l'éditeur pour peaufiner, ou ajoute-la directement à la file.</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
                  <button onClick={addToQueue} style={{ background: 'linear-gradient(135deg,#7C5CFF,#9D6BFF)', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: 12, fontWeight: 700, fontSize: 14, fontFamily: 'Manrope', cursor: 'pointer', boxShadow: '0 8px 24px rgba(124,92,255,.35)' }}>
                    Ajouter à la file →
                  </button>
                  <button onClick={editGenerated} style={{ background: 'rgba(255,255,255,.05)', color: '#C9C9D6', border: '1px solid rgba(255,255,255,.1)', padding: '12px 22px', borderRadius: 12, fontWeight: 700, fontSize: 14, fontFamily: 'Manrope', cursor: 'pointer' }}>
                    Ouvrir l'éditeur
                  </button>
                  <button onClick={regenerate} style={{ background: 'rgba(255,255,255,.05)', color: '#C9C9D6', border: '1px solid rgba(255,255,255,.1)', padding: '12px 22px', borderRadius: 12, fontWeight: 700, fontSize: 14, fontFamily: 'Manrope', cursor: 'pointer' }}>
                    ↻ Régénérer
                  </button>
                </div>
              </>
            )}
          </div>
          <div style={{ position: 'sticky', top: 96 }}>
            <div style={{ position: 'relative', aspectRatio: '9/16', borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,255,255,.12)', background: nicheObj.bg, boxShadow: '0 30px 70px rgba(0,0,0,.5)' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.12),rgba(0,0,0,.6))', opacity: preview.dim, transition: 'opacity .4s' }} />
              <div style={{ position: 'absolute', top: 14, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: preview.chrome, transition: 'opacity .4s' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: 'rgba(0,0,0,.45)', padding: '3px 9px', borderRadius: 20 }}>{nicheObj.name}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: 'rgba(0,0,0,.45)', padding: '3px 9px', borderRadius: 20 }}>9:16</span>
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 16,
                  right: 16,
                  top: '48%',
                  textAlign: 'center',
                  fontFamily: 'Space Grotesk,sans-serif',
                  fontWeight: 700,
                  fontSize: 22,
                  lineHeight: 1.1,
                  color: '#fff',
                  textShadow: '0 3px 18px rgba(0,0,0,.55)',
                  opacity: preview.hook,
                  transform: `translateY(-50%) scale(${preview.hookScale})`,
                  transition: 'opacity .45s,transform .45s',
                }}
              >
                {gen.hook}
              </div>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 78, display: 'flex', justifyContent: 'center', gap: 3, height: 26, alignItems: 'flex-end', opacity: preview.wave, transition: 'opacity .4s' }}>
                <WaveBars />
              </div>
              <div style={{ position: 'absolute', left: 16, right: 16, bottom: 40, textAlign: 'center', opacity: preview.subs, transition: 'opacity .4s' }}>
                <span style={{ background: '#7C5CFF', color: '#fff', fontWeight: 800, fontSize: 13, padding: '4px 10px', borderRadius: 6, lineHeight: 1.5 }}>{preview.subLine}</span>
              </div>
              <div style={{ position: 'absolute', bottom: 14, left: 14, display: 'flex', alignItems: 'center', gap: 6, opacity: preview.music, transition: 'opacity .4s' }}>
                <span style={{ display: 'flex', color: '#fff' }}>
                  <Icon name="music" size={15} />
                </span>
                <span style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>Uplifting Beat · 128 BPM</span>
              </div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: preview.play, transition: 'opacity .4s', pointerEvents: 'none' }}>
                <span style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,.9)', color: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 30px rgba(0,0,0,.4)' }}>
                  <Icon name="play" size={22} />
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: '#7E7E92' }}>Aperçu en temps réel</div>
          </div>
        </div>
      )}
    </div>
  );
}

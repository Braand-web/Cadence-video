import type { NicheDef } from '../types';

export const NICHES: NicheDef[] = [
  { key: 'motivation', name: 'Citations motivantes', desc: 'Punchlines qui claquent, ton inspirant.', icon: 'flame', bg: 'linear-gradient(135deg,#A56A00,#FF8A5C)', hook: 'Personne ne viendra te sauver.' },
  { key: 'facts', name: 'Faits insolites', desc: 'Le saviez-vous ? qui rend accro.', icon: 'brain', bg: 'linear-gradient(135deg,#5CC8FF,#2D3E9E)', hook: 'Ton cerveau brûle 20% de tes calories.' },
  { key: 'finance', name: 'Finance', desc: 'Argent, investissement, discipline.', icon: 'dollar', bg: 'linear-gradient(135deg,#34D399,#0EA5A5)', hook: 'Les riches ne budgètent pas. Ils font ça.' },
  { key: 'fitness', name: 'Fitness', desc: 'Routines, discipline, transformation.', icon: 'dumbbell', bg: 'linear-gradient(135deg,#FFB74C,#FF6B4C)', hook: '5 minutes > 1 heure le dimanche.' },
  { key: 'growth', name: 'Développement perso', desc: 'Habitudes, focus, mental.', icon: 'zap', bg: 'linear-gradient(135deg,#FF8A5C,#F05A28)', hook: 'Arrête de scroller. Lis ça.' },
  { key: 'tips', name: 'Astuces & vie pratique', desc: 'Hacks utiles du quotidien.', icon: 'spark', bg: 'linear-gradient(135deg,#F472B6,#A855F7)', hook: 'La règle des 2 minutes.' },
];

export const nicheByKey = (k: string) => NICHES.find((n) => n.key === k) ?? NICHES[0];
export const nicheName = (k: string) => nicheByKey(k).name;

export const DEFAULT_SCRIPT =
  "Personne ne viendra te sauver.\n\nÀ 6h du matin, pendant que le monde dort, c'est toi contre toi.\n\nChaque excuse que tu te donnes, quelqu'un d'autre l'ignore en ce moment même.\n\nAlors lève-toi. Commence. Aujourd'hui.";

export const DEFAULT_SCENE_FULLS = ['', "6h du matin. C'est toi contre toi.", "Chaque excuse, un autre l'ignore.", 'La discipline bat la motivation.', 'Alors lève-toi. Commence.'];

export const STAGES = [
  { key: 'script', name: 'Script', desc: 'Hook fort dans les 2 premières secondes', icon: 'doc' },
  { key: 'voice', name: 'Voix off', desc: 'Synthèse vocale naturelle (TTS)', icon: 'mic' },
  { key: 'visuals', name: 'Visuels', desc: 'Clips & images IA générés', icon: 'img' },
  { key: 'edit', name: 'Montage & sous-titres', desc: 'Format 9:16, sous-titres synchro, musique', icon: 'film' },
  { key: 'export', name: 'Export MP4', desc: 'Rendu final 1080×1920', icon: 'download' },
] as const;

// Builds a hook + scene script from a free-typed idea, falling back to the niche default.
export function hookFromIdea(idea: string): string {
  let h = (idea || '').trim().replace(/\s+/g, ' ');
  if (!h) return '';
  h = h.charAt(0).toUpperCase() + h.slice(1);
  if (h.length > 62) {
    h = h.slice(0, 60);
    const sp = h.lastIndexOf(' ');
    if (sp > 32) h = h.slice(0, sp);
    h += '…';
  } else if (!/[.!?…»]$/.test(h)) {
    h += '.';
  }
  return h;
}

export interface GeneratedContent {
  fromIdea: boolean;
  hook: string;
  sceneFulls: string[];
  scriptText: string;
}

export function genContent(nicheKey: string, ideaText: string): GeneratedContent {
  const n = nicheByKey(nicheKey);
  const idea = (ideaText || '').trim();
  if (!idea) {
    const fulls = [...DEFAULT_SCENE_FULLS];
    fulls[0] = n.hook;
    return { fromIdea: false, hook: n.hook, sceneFulls: fulls, scriptText: DEFAULT_SCRIPT };
  }
  const hook = hookFromIdea(idea);
  const listicle = /\b(\d+)\b/.test(idea);
  const sceneFulls = [
    hook,
    listicle ? 'Reste jusqu’au bout, le point n°2 change tout.' : 'La plupart des gens s’y prennent mal.',
    'Voici ce que presque personne ne t’explique.',
    'Applique ça et tu vois la différence en une semaine.',
    'Abonne-toi pour ne rien rater.',
  ];
  const scriptText = `${hook}\n\n${idea}\n\n${sceneFulls[2]}\n${sceneFulls[3]}\n\n${sceneFulls[4]}`;
  return { fromIdea: true, hook, sceneFulls, scriptText };
}

// Presentational library videos shown alongside the user's real (Supabase-backed)
// videos, so a fresh account isn't an empty dashboard. Mirrors BASE_VIDEOS from
// the design prototype. These are display-only and never written to the DB.
export interface SeedVideo {
  hook: string;
  niche: string;
  plat: 'yt' | 'tt' | 'both';
  status: 'published' | 'scheduled' | 'draft';
  bg: string;
  views?: string;
  likes?: string;
  when?: string;
  dur: string;
  rate?: string;
}

export const SEED_VIDEOS: SeedVideo[] = [
  { hook: 'Personne ne viendra te sauver.', niche: 'motivation', plat: 'yt', status: 'published', bg: 'linear-gradient(150deg,#9D6BFF,#7C2D6B)', views: '42,8K', likes: '3,1K', dur: '0:22', rate: '8,4%' },
  { hook: 'Ton cerveau brûle 20% de tes calories.', niche: 'facts', plat: 'tt', status: 'published', bg: 'linear-gradient(150deg,#5CC8FF,#2D3E9E)', views: '128K', likes: '9,4K', dur: '0:31', rate: '11,2%' },
  { hook: 'La règle des 2 minutes qui change tout.', niche: 'growth', plat: 'both', status: 'published', bg: 'linear-gradient(150deg,#A78BFA,#4C1D95)', views: '76,2K', likes: '5,8K', dur: '0:27', rate: '9,1%' },
  { hook: 'Les riches ne budgètent pas. Ils font ça.', niche: 'finance', plat: 'both', status: 'scheduled', bg: 'linear-gradient(150deg,#34D399,#065F46)', when: 'Demain · 08:00', dur: '0:29' },
  { hook: '5 minutes > 1 heure le dimanche.', niche: 'fitness', plat: 'yt', status: 'scheduled', bg: 'linear-gradient(150deg,#FFB74C,#7C2D12)', when: "Aujourd'hui · 18:30", dur: '0:19' },
  { hook: '1€ par jour = 400 000€. Voici comment.', niche: 'finance', plat: 'tt', status: 'scheduled', bg: 'linear-gradient(150deg,#0EA5A5,#134E4A)', when: 'Demain · 12:00', dur: '0:34' },
  { hook: 'Arrête de scroller. Lis ça.', niche: 'growth', plat: 'tt', status: 'draft', bg: 'linear-gradient(150deg,#F472B6,#831843)', dur: '0:24' },
  { hook: 'Le café à jeun ? Grosse erreur.', niche: 'facts', plat: 'yt', status: 'draft', bg: 'linear-gradient(150deg,#5CE0C8,#134E4A)', dur: '0:26' },
];

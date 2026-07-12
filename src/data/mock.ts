// Static mock data for screens whose real backing (analytics pipelines, billing
// provider, team/workspace management, referral program) is out of scope per the
// design brief — these were placeholders in the prototype and remain so here.

export const KPIS = [
  { label: 'Vues (30j)', value: '1,24M', delta: '+18,3%', deltaColor: '#34D399' },
  { label: 'Likes', value: '87,4K', delta: '+12,1%', deltaColor: '#34D399' },
  { label: 'Abonnés gagnés', value: '+4 208', delta: '+9,7%', deltaColor: '#34D399' },
  { label: "Taux d'engagement", value: '9,2%', delta: '-0,4%', deltaColor: '#FF7A7A' },
];

export const VIEWS_SERIES = [32, 45, 38, 52, 48, 61, 55, 70, 64, 78, 72, 88, 82, 96];
export const DAY_LABELS = ['J-13', '', '', 'J-10', '', '', 'J-7', '', '', 'J-4', '', '', 'J-1', 'Auj.'];

export const TOP_VIDEOS = [
  { rank: '1', bg: 'linear-gradient(150deg,#5CC8FF,#2D3E9E)', hook: 'Ton cerveau brûle 20% de tes calories.', niche: 'Faits insolites', views: '128K', rate: '11,2%' },
  { rank: '2', bg: 'linear-gradient(150deg,#FF8A5C,#C72B7A)', hook: 'La règle des 2 minutes qui change tout.', niche: 'Développement perso', views: '76,2K', rate: '9,1%' },
  { rank: '3', bg: 'linear-gradient(150deg,#A56A00,#7C2D12)', hook: 'Personne ne viendra te sauver.', niche: 'Citations motivantes', views: '42,8K', rate: '8,4%' },
];

export const BEST_TIMES = [
  { time: '08:00', pct: '92%', val: 'A+' },
  { time: '12:00', pct: '68%', val: 'B' },
  { time: '18:30', pct: '100%', val: 'A+' },
  { time: '21:00', pct: '84%', val: 'A' },
];

export const USAGE = [
  { label: 'Vidéos ce mois', val: '47 / 90', pct: '52%', color: 'linear-gradient(90deg,#F05A28,#A56A00)' },
  { label: 'Stockage', val: '6,2 / 20 Go', pct: '31%', color: 'linear-gradient(90deg,#34D399,#0EA5A5)' },
];

export const PLANS = [
  { id: 'starter', name: 'Starter', price: '0€', period: '/mois', feats: ['1 vidéo / jour', '1 réseau', 'Filigrane Cadence'], cur: false, popular: false },
  { id: 'creator', name: 'Creator', price: '19€', period: '/mois', feats: ['3 vidéos / jour', '2 réseaux', 'Sans filigrane', 'Voix premium'], cur: true, popular: true },
  { id: 'studio', name: 'Studio', price: '49€', period: '/mois', feats: ['10 vidéos / jour', 'Réseaux illimités', 'Visuels IA HD', 'Analytics avancés'], cur: false, popular: false },
];

export const INVOICES = [
  { date: '1 juil. 2026', amount: '19,00€', status: 'Payée' },
  { date: '1 juin 2026', amount: '19,00€', status: 'Payée' },
  { date: '1 mai 2026', amount: '19,00€', status: 'Payée' },
];

export interface HistoryItem {
  date: string;
  time: string;
  hook: string;
  niche: string;
  plat: 'yt' | 'tt' | 'both';
  bg: string;
  views: string;
  likes: string;
  ok: boolean;
}

export const HISTORY: HistoryItem[] = [
  { date: "Aujourd'hui", time: '08:00', hook: 'Personne ne viendra te sauver.', niche: 'motivation', plat: 'yt', bg: 'linear-gradient(150deg,#A56A00,#7C2D12)', views: '2,1K', likes: '184', ok: true },
  { date: "Aujourd'hui", time: '08:00', hook: 'Ton cerveau brûle 20% de tes calories.', niche: 'facts', plat: 'tt', bg: 'linear-gradient(150deg,#5CC8FF,#2D3E9E)', views: '5,4K', likes: '412', ok: true },
  { date: 'Hier', time: '21:00', hook: 'La règle des 2 minutes qui change tout.', niche: 'growth', plat: 'both', bg: 'linear-gradient(150deg,#FF8A5C,#C72B7A)', views: '18,9K', likes: '1,3K', ok: true },
  { date: 'Hier', time: '18:30', hook: '5 minutes > 1 heure le dimanche.', niche: 'fitness', plat: 'yt', bg: 'linear-gradient(150deg,#FFB74C,#7C2D12)', views: '7,2K', likes: '520', ok: true },
  { date: 'Hier', time: '12:00', hook: 'Le café à jeun ? Grosse erreur.', niche: 'facts', plat: 'tt', bg: 'linear-gradient(150deg,#5CE0C8,#134E4A)', views: '—', likes: '—', ok: false },
  { date: '9 juil.', time: '21:00', hook: '1€ par jour = 400 000€. Voici comment.', niche: 'finance', plat: 'both', bg: 'linear-gradient(150deg,#0EA5A5,#134E4A)', views: '42,8K', likes: '3,1K', ok: true },
  { date: '9 juil.', time: '08:00', hook: 'Arrête de scroller. Lis ça.', niche: 'growth', plat: 'tt', bg: 'linear-gradient(150deg,#F472B6,#831843)', views: '9,6K', likes: '740', ok: true },
  { date: '8 juil.', time: '18:30', hook: 'Les riches ne budgétent pas. Ils font ça.', niche: 'finance', plat: 'both', bg: 'linear-gradient(150deg,#34D399,#065F46)', views: '31,2K', likes: '2,4K', ok: true },
];

export const HIST_STATS = [
  { label: 'Publications totales', value: '312' },
  { label: 'Taux de réussite', value: '98,4%' },
  { label: 'Vues cumulées', value: '1,24M' },
  { label: 'Ce mois-ci', value: '31' },
];

export interface TrendItem {
  niche: string;
  badge: string;
  topic: string;
  hook: string;
  format: string;
  score: 'Potentiel élevé' | 'En hausse' | 'Stable';
  plat: 'yt' | 'tt' | 'both';
  bg: string;
}

export const TRENDS: TrendItem[] = [
  { niche: 'growth', badge: '+320%', topic: 'Routine 5-to-9 avant le 9-to-5', hook: '« Voilà ce que je fais avant 6h… »', format: 'Vlog rythmé + texte', score: 'Potentiel élevé', plat: 'both', bg: 'linear-gradient(135deg,#FF8A5C,#F05A28)' },
  { niche: 'finance', badge: '+240%', topic: "La psychologie de l'argent", hook: "« Les riches pensent l'inverse de toi. »", format: 'Talking head + b-roll', score: 'Potentiel élevé', plat: 'both', bg: 'linear-gradient(135deg,#34D399,#0EA5A5)' },
  { niche: 'facts', badge: '+180%', topic: 'Ce que le manque de sommeil te fait', hook: '« Dormir 5h fait ça à ton cerveau. »', format: 'Faits + visuels IA', score: 'En hausse', plat: 'tt', bg: 'linear-gradient(135deg,#5CC8FF,#2D3E9E)' },
  { niche: 'growth', badge: '+150%', topic: '3 habitudes des gens disciplinés', hook: '« La n°2 va te surprendre. »', format: 'Liste rythmée', score: 'En hausse', plat: 'yt', bg: 'linear-gradient(135deg,#F472B6,#A855F7)' },
  { niche: 'finance', badge: '+130%', topic: "Erreurs d'épargne avant 25 ans", hook: "« J'ai perdu 3 ans à cause de ça. »", format: 'Storytime', score: 'En hausse', plat: 'both', bg: 'linear-gradient(135deg,#FFB74C,#FF6B4C)' },
  { niche: 'motivation', badge: '+110%', topic: 'Stoïcisme pour la discipline', hook: '« Marc Aurèle avait tout compris. »', format: 'Citation + ambiance', score: 'Stable', plat: 'both', bg: 'linear-gradient(135deg,#A56A00,#7C2D12)' },
];

export const TREND_SOUNDS = [
  { name: 'Aesthetic Lo-Fi', uses: '1,2M vidéos' },
  { name: 'Epic Motivation', uses: '840K vidéos' },
  { name: 'Phonk Drift', uses: '2,1M vidéos' },
  { name: 'Calm Piano', uses: '560K vidéos' },
];

export const TREND_TAGS = ['#motivation', '#mindset', '#financeperso', '#saviezvous', '#discipline', '#morningroutine', '#investir', '#productivité'];

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  color: string;
  fixed?: string;
}

export const MEMBERS: TeamMember[] = [
  { id: 'you', name: 'Toi', email: 'creator@studio.co', color: 'linear-gradient(135deg,#A56A00,#F05A28)', fixed: 'Propriétaire' },
  { id: 'anna', name: 'Anna Diallo', email: 'anna@studio.co', color: 'linear-gradient(135deg,#34D399,#0EA5A5)' },
  { id: 'marc', name: 'Marc Petit', email: 'marc@studio.co', color: 'linear-gradient(135deg,#5CC8FF,#F05A28)' },
];

export const PENDING_INVITES = [{ email: 'jules@studio.co', role: 'Éditeur' }];

export const ROLE_LEGEND = [
  { r: 'Admin', d: 'Gère tout : équipe, facturation, publications.' },
  { r: 'Éditeur', d: 'Crée et édite les vidéos, sans accès facturation.' },
  { r: 'Lecteur', d: 'Consulte le contenu et les stats uniquement.' },
];

export const WORKSPACES = [
  { id: 'studio', name: 'Studio Créateur', handle: '@cadence.daily', plan: 'Creator', color: 'linear-gradient(135deg,#A56A00,#F05A28)' },
  { id: 'brandb', name: 'Fit Avec Marc', handle: '@fit.marc', plan: 'Studio', color: 'linear-gradient(135deg,#FFB74C,#FF6B4C)' },
  { id: 'brandc', name: 'Money Tips FR', handle: '@money.tips.fr', plan: 'Starter', color: 'linear-gradient(135deg,#34D399,#0EA5A5)' },
];

export const NETWORKS = [
  { name: 'YouTube Shorts', handle: '@cadence.daily', bg: '#FF0033', kind: 'yt' as const, connected: true },
  { name: 'TikTok', handle: '@cadence.daily', bg: '#000', kind: 'tt' as const, connected: true },
  { name: 'Instagram Reels', handle: 'Non connecté', bg: 'linear-gradient(135deg,#F472B6,#A855F7)', kind: 'img' as const, connected: false },
  { name: 'X (Twitter)', handle: 'Non connecté', bg: '#111', kind: 'spark' as const, connected: false },
];

export const REF_STATS = [
  { label: 'Amis invités', value: '8' },
  { label: 'Inscrits', value: '5' },
  { label: 'Mois offerts', value: '5' },
];
export const REF_PROGRESS = 5;
export const REF_GOAL = 10;
export const REFERRAL_CODE = 'cadence.video/r/CREATOR42';

export const NOTIF_PREF_DEFS = [
  { key: 'published', label: 'Vidéo publiée', desc: 'Quand une vidéo part en ligne' },
  { key: 'review', label: 'Vidéo à valider', desc: 'Quand une vidéo attend ton feu vert' },
  { key: 'failed', label: 'Échec de génération', desc: 'Si le pipeline rencontre une erreur' },
  { key: 'weekly', label: 'Rapport hebdomadaire', desc: 'Résumé des performances chaque lundi' },
  { key: 'product', label: 'Nouveautés produit', desc: 'Fonctionnalités et conseils Cadence' },
];

export const NOTIF_DEFS = [
  { u: true, c: '#34D399', ic: 'check' as const, title: 'Vidéo publiée sur YouTube Shorts', time: 'Il y a 2 h' },
  { u: true, c: '#FFB74C', ic: 'clock' as const, title: '1 vidéo attend ta validation', time: 'Il y a 5 h' },
  { u: false, c: '#F05A28', ic: 'film' as const, title: '3 vidéos générées cette nuit', time: 'Hier · 03:00' },
  { u: false, c: '#5CC8FF', ic: 'chart' as const, title: 'Ton rapport hebdomadaire est prêt', time: 'Lundi' },
];

export const CALENDAR_EVENTS_2026_06: Record<number, { c: string; h: string }[]> = {
  3: [{ c: '#34D399', h: 'Motivation' }],
  5: [{ c: '#34D399', h: 'Finance' }],
  8: [{ c: '#34D399', h: 'Fitness' }, { c: '#34D399', h: 'Faits' }],
  10: [{ c: '#F05A28', h: 'Finance' }, { c: '#FFB74C', h: 'Motivation' }],
  11: [{ c: '#F05A28', h: 'Fitness' }],
  12: [{ c: '#F05A28', h: 'Dev perso' }],
  14: [{ c: '#F05A28', h: 'Finance' }, { c: '#F05A28', h: 'Faits' }],
  16: [{ c: '#F05A28', h: 'Motivation' }],
  18: [{ c: '#F05A28', h: 'Fitness' }],
  20: [{ c: '#F05A28', h: 'Finance' }],
  22: [{ c: '#F05A28', h: 'Dev perso' }, { c: '#F05A28', h: 'Faits' }],
  25: [{ c: '#F05A28', h: 'Motivation' }],
};

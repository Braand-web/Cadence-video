import type { Video } from '../types';
import { SEED_VIDEOS } from '../data/seedVideos';
import { nicheByKey } from '../data/niches';

export interface DisplayVideo {
  id: string;
  hook: string;
  nicheKey: string;
  nicheName: string;
  plat: 'yt' | 'tt' | 'both';
  status: 'published' | 'scheduled' | 'draft' | 'review';
  bg: string;
  dur: string;
  views?: string;
  likes?: string;
  when?: string;
  rate?: string;
  isSeed: boolean;
  video?: Video;
}

function fmtDuration(seconds: number) {
  const s = Math.round(seconds);
  return `0:${String(s).padStart(2, '0')}`;
}

function fmtWhen(v: Video): string {
  if (v.status === 'review') return 'En attente de validation';
  if (v.scheduled_at) {
    const d = new Date(v.scheduled_at);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${isToday ? "Aujourd'hui" : 'Bientôt'} · ${hh}:${mm}`;
  }
  return 'Non programmé';
}

export function toDisplayVideo(v: Video): DisplayVideo {
  return {
    id: v.id,
    hook: v.hook,
    nicheKey: v.niche,
    nicheName: nicheByKey(v.niche).name,
    plat: v.platform,
    status: v.status,
    bg: v.bg || nicheByKey(v.niche).bg,
    dur: fmtDuration(v.duration_seconds),
    views: v.views != null ? String(v.views) : undefined,
    likes: v.likes != null ? String(v.likes) : undefined,
    when: fmtWhen(v),
    isSeed: false,
    video: v,
  };
}

export function seedLibrary(): DisplayVideo[] {
  return SEED_VIDEOS.map((v, i) => ({
    id: `seed-${i}`,
    hook: v.hook,
    nicheKey: v.niche,
    nicheName: nicheByKey(v.niche).name,
    plat: v.plat,
    status: v.status,
    bg: v.bg,
    dur: v.dur,
    views: v.views,
    likes: v.likes,
    when: v.when,
    rate: v.rate,
    isSeed: true,
  }));
}

export function mergeLibrary(videos: Video[]): DisplayVideo[] {
  return [...videos.map(toDisplayVideo), ...seedLibrary()];
}

export type Platform = 'yt' | 'tt' | 'both';
export type VideoStatus = 'draft' | 'scheduled' | 'review' | 'published';
export type TransitionType = 'cut' | 'fade' | 'slide' | 'zoom';

export interface Video {
  id: string;
  user_id: string;
  niche: string;
  hook: string;
  script: string;
  scene_fulls: string[];
  scene_durations: number[];
  scene_transitions: TransitionType[];
  platform: Platform;
  status: VideoStatus;
  source: 'niche' | 'idea';
  idea_text: string | null;
  caption_style: string;
  caption_position: string;
  voice: string;
  music_track: string;
  aspect_ratio: '9:16' | '1:1' | '4:5';
  duration_seconds: number;
  scheduled_at: string | null;
  published_at: string | null;
  views: number | null;
  likes: number | null;
  created_at: string;
  updated_at: string;
  // presentational-only fields for demo/seed videos not backed by a DB row
  bg?: string;
}

export interface Profile {
  id: string;
  studio_name: string;
  email: string | null;
  language: string;
  timezone: string;
  plan: 'starter' | 'creator' | 'studio';
  onboarded: boolean;
  connected_networks: { yt: boolean; tt: boolean };
  notif_prefs: Record<string, { e: boolean; p: boolean }>;
  default_validate_before_publish: boolean;
}

export interface NicheDef {
  key: string;
  name: string;
  desc: string;
  icon: string;
  bg: string;
  hook: string;
}

export interface ReferenceFile {
  name: string;
  type: 'image' | 'video';
  url: string;
}

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import type { Video } from '../types';
import { DEFAULT_SCENE_FULLS } from '../data/niches';

interface NewVideoInput {
  niche: string;
  hook: string;
  script: string;
  sceneFulls: string[];
  platform: Video['platform'];
  status: Video['status'];
  source: Video['source'];
  ideaText: string | null;
}

interface VideosContextValue {
  videos: Video[];
  loading: boolean;
  refresh: () => Promise<void>;
  addVideo: (input: NewVideoInput) => Promise<Video | null>;
  updateVideo: (id: string, patch: Partial<Video>) => Promise<void>;
  approveVideo: (id: string) => Promise<void>;
}

const VideosContext = createContext<VideosContextValue | null>(null);

export function VideosProvider({ children }: { children: ReactNode }) {
  const { user, demoMode } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setVideos([]);
      return;
    }
    setLoading(true);
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    setVideos((data as unknown as Video[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addVideo: VideosContextValue['addVideo'] = async (input) => {
    if (!user || demoMode) return null; // demo mode has no persistence — nothing to write
    const { data, error } = await supabase
      .from('videos')
      .insert({
        user_id: user.id,
        niche: input.niche,
        hook: input.hook,
        script: input.script,
        scene_fulls: input.sceneFulls.length ? input.sceneFulls : DEFAULT_SCENE_FULLS,
        platform: input.platform,
        status: input.status,
        source: input.source,
        idea_text: input.ideaText,
        scheduled_at: input.status === 'scheduled' ? new Date(Date.now() + 3 * 3600 * 1000).toISOString() : null,
      })
      .select()
      .single();
    if (error) {
      // eslint-disable-next-line no-console
      console.error('addVideo failed', error);
      return null;
    }
    const v = data as unknown as Video;
    setVideos((vs) => [v, ...vs]);
    return v;
  };

  const updateVideo: VideosContextValue['updateVideo'] = async (id, patch) => {
    if (!user || demoMode) {
      setVideos((vs) => vs.map((v) => (v.id === id ? { ...v, ...patch } : v)));
      return;
    }
    const { data } = await supabase.from('videos').update(patch).eq('id', id).select().maybeSingle();
    if (data) setVideos((vs) => vs.map((v) => (v.id === id ? (data as unknown as Video) : v)));
  };

  const approveVideo = async (id: string) => updateVideo(id, { status: 'scheduled', scheduled_at: new Date(Date.now() + 3 * 3600 * 1000).toISOString() });

  return <VideosContext.Provider value={{ videos, loading, refresh, addVideo, updateVideo, approveVideo }}>{children}</VideosContext.Provider>;
}

export function useVideos() {
  const ctx = useContext(VideosContext);
  if (!ctx) throw new Error('useVideos must be used within VideosProvider');
  return ctx;
}

-- Cadence core schema: profiles + videos, both scoped to the owning user via RLS.
-- Everything else in the app (analytics, trends, billing, team, referral) is
-- presentational/mock data in the frontend — see src/data/*.ts — since the
-- design's own scope explicitly kept social APIs, AI generation, and payments
-- as placeholders to wire up later.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles: one row per authenticated user, created automatically on signup.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  studio_name text not null default 'Studio Créateur',
  email text,
  language text not null default 'fr',
  timezone text not null default 'Europe/Paris (GMT+2)',
  plan text not null default 'creator' check (plan in ('starter', 'creator', 'studio')),
  onboarded boolean not null default false,
  connected_networks jsonb not null default '{"yt": false, "tt": false}'::jsonb,
  notif_prefs jsonb not null default '{
    "published": {"e": true, "p": true},
    "review": {"e": true, "p": true},
    "failed": {"e": true, "p": false},
    "weekly": {"e": true, "p": false},
    "product": {"e": false, "p": false}
  }'::jsonb,
  default_validate_before_publish boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are viewable by owner" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles are updatable by owner" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles are insertable by owner" on public.profiles
  for insert with check (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, studio_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'studio_name', 'Studio Créateur'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- videos: the core content object created by the create-flow / editor.
-- ---------------------------------------------------------------------------
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  niche text not null,
  hook text not null,
  script text not null default '',
  scene_fulls jsonb not null default '[]'::jsonb,
  scene_durations jsonb not null default '[3, 5, 6, 5, 4]'::jsonb,
  scene_transitions jsonb not null default '["cut", "fade", "slide", "zoom", "fade"]'::jsonb,
  platform text not null default 'both' check (platform in ('yt', 'tt', 'both')),
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'review', 'published')),
  source text not null default 'niche' check (source in ('niche', 'idea')),
  idea_text text,
  caption_style text not null default 'karaoke',
  caption_position text not null default 'bas',
  voice text not null default 'lea',
  music_track text not null default 'uplift',
  aspect_ratio text not null default '9:16',
  duration_seconds numeric not null default 23,
  scheduled_at timestamptz,
  published_at timestamptz,
  views bigint,
  likes bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.videos enable row level security;

create policy "videos are viewable by owner" on public.videos
  for select using (auth.uid() = user_id);
create policy "videos are insertable by owner" on public.videos
  for insert with check (auth.uid() = user_id);
create policy "videos are updatable by owner" on public.videos
  for update using (auth.uid() = user_id);
create policy "videos are deletable by owner" on public.videos
  for delete using (auth.uid() = user_id);

create index if not exists videos_user_id_idx on public.videos (user_id);
create index if not exists videos_status_idx on public.videos (status);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists videos_set_updated_at on public.videos;
create trigger videos_set_updated_at before update on public.videos
  for each row execute procedure public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- storage: per-user folder for reference images/videos uploaded in the
-- create flow (bucket must be created once via the Supabase dashboard/CLI:
-- `supabase storage create references`, or SQL insert into storage.buckets).
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('references', 'references', false)
on conflict (id) do nothing;

create policy "references are readable by owner"
  on storage.objects for select
  using (bucket_id = 'references' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "references are writable by owner"
  on storage.objects for insert
  with check (bucket_id = 'references' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "references are deletable by owner"
  on storage.objects for delete
  using (bucket_id = 'references' and (storage.foldername(name))[1] = auth.uid()::text);

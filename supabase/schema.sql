-- Run this in the Supabase SQL Editor (SQL Editor → New query) once, after
-- creating the project. Matches the Reel shape in src/shared/types.js.
--
-- Already have this table from before description/edit/delete/skip-rate
-- support was added? Run just this bit instead of the whole file:
--   alter table reels add column if not exists description text;
--   alter table reels rename column save_rate to skip_rate;
--   create policy "public update" on reels for update using (true) with check (true);
--   create policy "public delete" on reels for delete using (true);

create table if not exists reels (
  id uuid primary key default gen_random_uuid(),
  hook text not null,
  views integer not null default 0,
  share_rate double precision not null default 0,
  skip_rate double precision not null default 0,
  like_rate double precision not null default 0,
  follows_from_reel integer not null default 0,
  niche text not null,
  date_posted timestamptz not null default now(),
  thumbnail text,
  description text
);

alter table reels enable row level security;

-- This app is a client-side SPA with no auth, so the anon key needs direct
-- read/write access. Fine for a personal/local dashboard; revisit if this
-- ever gets a real login.
create policy "public read" on reels for select using (true);
create policy "public insert" on reels for insert with check (true);
create policy "public update" on reels for update using (true) with check (true);
create policy "public delete" on reels for delete using (true);

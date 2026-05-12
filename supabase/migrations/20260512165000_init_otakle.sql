create table if not exists public.characters (
  id text primary key,
  name text not null,
  anime text not null,
  genre text not null default '',
  debut_year integer not null default 0,
  studio text not null default '',
  role text not null default '',
  gender text not null default '',
  race text not null default '',
  debut_info text not null default '',
  image_url text not null default '',
  age_debut_group text not null default 'Desconocido',
  age_main_group text not null default 'Desconocido',
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists characters_active_idx on public.characters (active);
create index if not exists characters_anime_idx on public.characters (anime);
create index if not exists characters_name_idx on public.characters (name);

create table if not exists public.character_aliases (
  id bigint generated always as identity primary key,
  character_id text not null references public.characters(id) on delete cascade,
  alias text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (character_id, alias)
);

create index if not exists character_aliases_alias_idx on public.character_aliases (alias);

create table if not exists public.daily_challenges (
  challenge_date date not null,
  mode text not null check (mode in ('normal', 'easy')),
  character_id text not null references public.characters(id) on delete restrict,
  notes text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (challenge_date, mode)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists characters_set_updated_at on public.characters;
create trigger characters_set_updated_at
before update on public.characters
for each row
execute function public.set_updated_at();

drop trigger if exists daily_challenges_set_updated_at on public.daily_challenges;
create trigger daily_challenges_set_updated_at
before update on public.daily_challenges
for each row
execute function public.set_updated_at();

alter table public.characters enable row level security;
alter table public.character_aliases enable row level security;
alter table public.daily_challenges enable row level security;

drop policy if exists "Public read characters" on public.characters;
create policy "Public read characters"
on public.characters
for select
using (true);

drop policy if exists "Public read aliases" on public.character_aliases;
create policy "Public read aliases"
on public.character_aliases
for select
using (true);

drop policy if exists "Public read daily challenges" on public.daily_challenges;
create policy "Public read daily challenges"
on public.daily_challenges
for select
using (true);

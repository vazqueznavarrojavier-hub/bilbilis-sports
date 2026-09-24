-- Bílbilis Sports — modelo de datos propuesto para la siguiente fase.
-- No ejecutar todavía si se quiere mantener el prototipo sin backend.

create extension if not exists pgcrypto;

create table if not exists public.sports (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  icon text,
  sort_order integer not null default 0,
  active boolean not null default true
);

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null default 'Calatayud',
  address text,
  latitude numeric,
  longitude numeric,
  created_at timestamptz not null default now()
);

create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  sport_id uuid references public.sports(id) on delete set null,
  website text,
  instagram text,
  logo_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  scope text not null check (scope in ('local','international')),
  sport_id uuid references public.sports(id) on delete set null,
  club_id uuid references public.clubs(id) on delete set null,
  venue_id uuid references public.venues(id) on delete set null,
  competition text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  description text,
  image_url text,
  source_name text,
  source_url text,
  registration_url text,
  featured boolean not null default false,
  status text not null default 'published' check (status in ('draft','published','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_submissions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  contact_name text,
  contact_email text,
  sport text,
  starts_at timestamptz,
  venue text,
  description text,
  poster_url text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create index if not exists events_scope_starts_at_idx on public.events(scope, starts_at);
create index if not exists events_sport_starts_at_idx on public.events(sport_id, starts_at);
create index if not exists submissions_status_idx on public.event_submissions(status, created_at);

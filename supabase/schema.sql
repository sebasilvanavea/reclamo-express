-- Reclamo Express · esquema inicial
-- Ejecutar en Supabase → SQL Editor (una sola vez).

create extension if not exists "pgcrypto";

-- ---------- perfiles ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text,
  nombre      text,
  rut         text,
  telefono    text,
  ciudad      text,
  domicilio   text,
  plan        text not null default 'gratis',   -- gratis | pro | pyme
  plan_interes text,                             -- plan elegido en la landing (lista de espera)
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Si el esquema ya existía sin esta columna:
alter table public.profiles add column if not exists plan_interes text;

-- Crea el perfil al registrarse
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- casos ----------
create table if not exists public.cases (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references auth.users on delete cascade,
  categoria               text not null,           -- garantia | retracto | vuelo | cobro | servicio | telecom
  subtipo                 text,
  estado                  text not null default 'borrador',
                          -- borrador | enviada | acogida | parcial | rechazada | sin_respuesta | escalada | cerrada
  proveedor               text,
  proveedor_email         text,
  item                    text,
  datos                   jsonb not null default '{}'::jsonb,  -- todos los campos del formulario
  asunto                  text,
  carta                   text,
  texto_sernac            text,
  monto_reparacion        numeric,
  plazo_dias              int not null default 10,
  fecha_hecho             date,
  enviada_at              timestamptz,
  plazo_vence             date,
  respuesta               text,
  respondida_at           timestamptz,
  escalada_at             timestamptz,
  recordatorio_enviado_at timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists cases_user_idx on public.cases (user_id, created_at desc);
create index if not exists cases_vence_idx on public.cases (plazo_vence) where estado = 'enviada';

-- ---------- bitácora ----------
create table if not exists public.case_events (
  id          bigserial primary key,
  case_id     uuid not null references public.cases on delete cascade,
  user_id     uuid not null references auth.users on delete cascade,
  tipo        text not null,     -- creado | enviado | respuesta | escalado | nota | recordatorio
  detalle     text,
  created_at  timestamptz not null default now()
);

create index if not exists case_events_case_idx on public.case_events (case_id, created_at);

-- ---------- updated_at ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists cases_updated_at on public.cases;
create trigger cases_updated_at before update on public.cases
  for each row execute procedure public.set_updated_at();

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ---------- RLS: cada persona ve solo lo suyo ----------
alter table public.profiles    enable row level security;
alter table public.cases       enable row level security;
alter table public.case_events enable row level security;

drop policy if exists "perfil propio" on public.profiles;
create policy "perfil propio" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "casos propios" on public.cases;
create policy "casos propios" on public.cases
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "eventos propios" on public.case_events;
create policy "eventos propios" on public.case_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

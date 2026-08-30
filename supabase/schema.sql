-- Teranga Campus — à coller dans SQL Editor de Supabase (installation neuve).
-- Si vous avez déjà exécuté une version précédente, utilisez plutôt supabase/migration-v2.sql.
-- Puis : Authentication > Users > Add user (email + mot de passe).
-- Ensuite exécuter le bloc « Premier administrateur » en bas, avec l'UUID du user créé.

create extension if not exists "pgcrypto";

create table if not exists public.niveaux (
  id uuid primary key default gen_random_uuid(),
  nom text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  niveau_id uuid not null references public.niveaux (id) on delete cascade,
  semestre smallint not null check (semestre in (1, 2)),
  created_at timestamptz not null default now(),
  unique (niveau_id, semestre, nom)
);

create table if not exists public.matieres (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  niveau_id uuid not null references public.niveaux (id) on delete cascade,
  module_id uuid not null references public.modules (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (module_id, nom)
);

create type public.document_type as enum ('cours', 'td', 'flashcards', 'correction');

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  matiere_id uuid not null references public.matieres (id) on delete cascade,
  titre text not null,
  type public.document_type not null,
  fichier_url text not null,
  parent_id uuid references public.documents (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.niveaux enable row level security;
alter table public.modules enable row level security;
alter table public.matieres enable row level security;
alter table public.documents enable row level security;
alter table public.profiles enable row level security;

create policy "Lecture publique des niveaux"
  on public.niveaux for select
  using (true);

create policy "Lecture publique des modules"
  on public.modules for select
  using (true);

create policy "Lecture publique des matières"
  on public.matieres for select
  using (true);

create policy "Lecture publique des documents"
  on public.documents for select
  using (true);

create policy "Admin écrit les niveaux"
  on public.niveaux for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin écrit les modules"
  on public.modules for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin écrit les matières"
  on public.matieres for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin écrit les documents"
  on public.documents for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin lit son profil"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "Admin gère les profils"
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into public.niveaux (nom)
values ('Licence 1'), ('Licence 2'), ('Licence 3')
on conflict (nom) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  true,
  52428800,
  array['application/pdf']
)
on conflict (id) do nothing;

create policy "Lecture publique des PDF"
  on storage.objects for select
  using (bucket_id = 'documents');

create policy "Admin envoie des PDF"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'documents' and public.is_admin());

create policy "Admin remplace des PDF"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'documents' and public.is_admin())
  with check (bucket_id = 'documents' and public.is_admin());

create policy "Admin supprime des PDF"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'documents' and public.is_admin());

-- Premier administrateur :
-- 1. Authentication > Users > Add user
-- 2. Copier l'UUID du user, puis :
-- insert into public.profiles (id, role) values ('COLLER-UUID-ICI', 'admin');

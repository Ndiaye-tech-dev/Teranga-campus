-- Teranga Campus v2 — à exécuter si schema.sql a déjà été appliqué (version initiale).
-- Ajoute modules, semestres, plusieurs documents par matière, et les corrections de TD.

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  niveau_id uuid not null references public.niveaux (id) on delete cascade,
  semestre smallint not null check (semestre in (1, 2)),
  created_at timestamptz not null default now(),
  unique (niveau_id, semestre, nom)
);

alter table public.modules enable row level security;

drop policy if exists "Lecture publique des modules" on public.modules;
create policy "Lecture publique des modules"
  on public.modules for select
  using (true);

drop policy if exists "Admin écrit les modules" on public.modules;
create policy "Admin écrit les modules"
  on public.modules for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

alter table public.matieres add column if not exists module_id uuid references public.modules (id) on delete cascade;

insert into public.modules (nom, niveau_id, semestre)
select 'Module général', n.id, s.semestre
from public.niveaux n
cross join (values (1), (2)) as s(semestre)
on conflict (niveau_id, semestre, nom) do nothing;

update public.matieres m
set module_id = g.id
from public.modules g
where m.module_id is null
  and g.niveau_id = m.niveau_id
  and g.semestre = 1
  and g.nom = 'Module général';

alter table public.matieres alter column module_id set not null;

alter table public.matieres drop constraint if exists matieres_niveau_id_nom_key;
alter table public.matieres drop constraint if exists matieres_module_id_nom_key;
alter table public.matieres add constraint matieres_module_id_nom_key unique (module_id, nom);

alter table public.documents add column if not exists matiere_id uuid references public.matieres (id) on delete cascade;
alter table public.documents add column if not exists titre text;
alter table public.documents add column if not exists parent_id uuid references public.documents (id) on delete cascade;

update public.documents d
set
  matiere_id = c.matiere_id,
  titre = coalesce(d.titre, c.titre)
from public.cours c
where d.cours_id = c.id
  and d.matiere_id is null;

update public.documents
set titre = coalesce(nullif(titre, ''), initcap(type::text))
where titre is null or titre = '';

alter table public.documents drop constraint if exists documents_cours_id_type_key;
alter table public.documents alter column cours_id drop not null;

delete from public.documents where matiere_id is null;
alter table public.documents alter column matiere_id set not null;
alter table public.documents alter column titre set not null;

alter type public.document_type add value if not exists 'correction';

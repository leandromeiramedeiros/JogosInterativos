-- Placar dos Jogos Interativos
-- Cole este arquivo no Supabase: SQL Editor → New query → Run.

create table if not exists public.placar (
  id         bigint generated always as identity primary key,
  jogo       text        not null check (jogo ~ '^[a-z0-9-]{1,40}$'),
  nome       text        not null check (char_length(btrim(nome)) between 1 and 20),
  pontos     integer     not null check (pontos between 1 and 50000),
  nivel      text                 check (char_length(nivel) <= 40),
  criado_em  timestamptz not null default now()
);

create index if not exists placar_jogo_pontos on public.placar (jogo, pontos desc, criado_em);
create index if not exists placar_jogo_data   on public.placar (jogo, criado_em desc);

-- Qualquer visitante pode ler o placar e enviar uma pontuação.
-- Ninguém pode editar nem apagar pelo site (só você, pelo painel do Supabase).
alter table public.placar enable row level security;

drop policy if exists "placar: leitura publica" on public.placar;
create policy "placar: leitura publica" on public.placar
  for select to anon, authenticated using (true);

drop policy if exists "placar: envio publico" on public.placar;
create policy "placar: envio publico" on public.placar
  for insert to anon, authenticated with check (true);

grant select, insert on public.placar to anon, authenticated;

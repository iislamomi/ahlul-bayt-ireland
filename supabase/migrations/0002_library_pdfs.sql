-- Library PDFs: a public-read bucket that only the service role can write to,
-- plus a record of what was written so uploads can be rate limited and reviewed.
--
-- The bucket's own size and MIME constraints are enforced by Storage itself,
-- which matters: they hold even if a future caller reaches the bucket by some
-- path the Edge Function does not control.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('library-pdfs', 'library-pdfs', true, 26214400, array['application/pdf'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Read is granted by the bucket being public. Write is granted to nobody:
-- storage.objects has RLS on by default and no policy here names anon or
-- authenticated, so the anon key in app.js cannot place a file. The service
-- role bypasses RLS, which is why upload-pdf is the only way in.
--
-- Deliberately absent: a permissive insert policy. The in-app admin screen is a
-- client-side gate (see README, Known gaps), so any policy naming anon would be
-- a policy naming everyone, and the mosque's own storage address is exactly the
-- place a forged document would be most believed.

create table if not exists public.library_pdfs (
  id           uuid primary key default gen_random_uuid(),
  path         text        not null unique,
  url          text        not null,
  bytes        integer     not null,
  filename     text,
  install_hash text,
  created_at   timestamptz not null default now()
);

create index if not exists library_pdfs_install_recent
  on public.library_pdfs (install_hash, created_at desc);

alter table public.library_pdfs enable row level security;
-- No policies: the table is for the Edge Function and the dashboard. The upload
-- count of an installation is not something a reader needs to be able to read.

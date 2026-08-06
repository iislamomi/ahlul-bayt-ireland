-- Audio joins PDFs in storage, and the upload ledger learns to tell them apart.
--
-- A separate bucket rather than a wider MIME list on the existing one: the size
-- ceilings are genuinely different (a recitation of Jawshan Kabeer runs an hour),
-- and a bucket that accepts both is a bucket where a 60 MB limit silently applies
-- to PDFs too.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('library-audio', 'library-audio', true, 62914560,
        array['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/x-m4a', 'audio/aac',
              'audio/ogg', 'audio/wav', 'audio/x-wav', 'audio/webm'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Write is granted to nobody here too. Uploads are gated by upload-media, which
-- holds the service role and hands the browser a short-lived signed URL rather
-- than carrying the bytes itself — an Edge Function has a request body limit,
-- and an hour of audio is on the wrong side of it.

alter table public.library_pdfs
  add column if not exists kind   text not null default 'pdf',
  add column if not exists bucket text not null default 'library-pdfs';

-- Rows written before this migration are all PDFs in the PDF bucket, which is
-- exactly what the defaults say, so no backfill is needed.

comment on table public.library_pdfs is
  'Upload ledger for library-pdfs and library-audio: the audit trail and the rate-limit counter. Named for its first use.';

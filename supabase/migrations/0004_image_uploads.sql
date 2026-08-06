-- Logos, and anything else small and visual, get a bucket of their own.
--
-- The alternative was the existing habit of resizing an image to a data URL and
-- storing it inside the `content` row. That row is fetched on every app start,
-- so each logo kept there is paid for by every reader on every launch. A logo is
-- small but there is one per business, and the row is already carrying billboard
-- artwork.
--
-- 5 MB is deliberately far above what a resized logo needs: the client shrinks
-- before uploading, and this is the ceiling for a mistake, not the target.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('library-images', 'library-images', true, 5242880,
        array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Write is granted to nobody, as with the other two buckets. upload-media holds
-- the service role and hands out a signed URL for one path.
--
-- image/svg+xml is on the list because a logo is exactly the thing most likely to
-- arrive as one. It is worth knowing what that admits: an SVG is a document, and
-- one served from this project's own address could carry script. Every use in the
-- app renders it through an <img>, which does not execute script — but anyone
-- opening the file's URL directly is opening it as a page. Drop it from this list
-- if that trade is not wanted; PNG covers every real logo.

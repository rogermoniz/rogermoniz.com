-- =============================================================================
-- Articles come in two layouts, and the original site treats them differently:
-- a feature runs a wider column with overlaid captions on its pictures, while a
-- standard article is a narrower reading column with plain full width images.
-- =============================================================================

alter table pages
  add column if not exists template text not null default 'standard';

alter table pages
  drop constraint if exists pages_template_check;

alter table pages
  add constraint pages_template_check check (template in ('standard', 'feature'));

update pages set template = 'feature' where slug = 'blog/octobre-rose-2025';

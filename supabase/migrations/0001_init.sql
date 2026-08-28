-- =============================================================================
-- rogermoniz.com — content schema
--
-- Every page on the site is assembled from these tables. The design is
-- normalised so each field is editable on its own row in the Supabase table
-- editor; only genuinely recursive prose (article bodies, inline emphasis)
-- is stored as jsonb, because it has no flat shape.
--
-- Read access is public: this is a public website. Nothing here is writable
-- by the anon key, so the site can only ever read.
-- =============================================================================

-- ---------- site wide ---------------------------------------------------------

create table if not exists site_settings (
  id            smallint primary key default 1 check (id = 1),
  name          text not null,
  location      text not null,
  email         text not null,
  phone         text not null,
  phone_display text not null,
  instagram     text not null,
  logo_path     text not null
);

create table if not exists nav_items (
  id           bigint generated always as identity primary key,
  group_key    text not null check (group_key in ('primary', 'legal', 'prestations')),
  label        text not null,
  href         text not null,
  parent_label text,
  position     integer not null
);

create table if not exists footer_images (
  id       bigint generated always as identity primary key,
  position integer not null,
  path     text not null,
  alt      text not null default ''
);

-- ---------- pages -------------------------------------------------------------

create table if not exists pages (
  slug            text primary key,
  route           text not null unique,
  kind            text not null check (kind in ('home', 'prestation', 'article', 'legal', 'standalone')),
  meta_title      text not null,
  preloader_label text,
  sort_order      integer not null default 0
);

-- ---------- heroes ------------------------------------------------------------

create table if not exists hero_marquee (
  page_slug text primary key references pages (slug) on delete cascade,
  eyebrow   text,
  title     text,
  subtitle  text
);

create table if not exists hero_marquee_images (
  id        bigint generated always as identity primary key,
  page_slug text not null references pages (slug) on delete cascade,
  speed     text not null check (speed in ('up', 'down', 'up-slow', 'down-slow')),
  position  integer not null,
  path      text not null,
  alt       text not null default ''
);

create table if not exists article_hero (
  page_slug    text primary key references pages (slug) on delete cascade,
  category     text,
  date_label   text,
  reading_time text,
  title        text,
  image_path   text,
  image_alt    text not null default '',
  scroll_label text not null default 'Scroll',
  share_label  text
);

create table if not exists about_hero (
  page_slug    text primary key references pages (slug) on delete cascade,
  eyebrow      text,
  title_lines  text[] not null default '{}',
  tag          text,
  lead         text,
  scroll_label text
);

create table if not exists about_hero_backgrounds (
  id        bigint generated always as identity primary key,
  page_slug text not null references pages (slug) on delete cascade,
  theme     text not null check (theme in ('light', 'dark')),
  path      text not null,
  alt       text not null default '',
  focal     text
);

-- ---------- shared section pieces ---------------------------------------------

-- One row per titled section: welcome, prestations, reviews, faq, process,
-- pricing, portfolio, featured, articles, filters, intro...
create table if not exists section_headings (
  page_slug   text not null references pages (slug) on delete cascade,
  section_key text not null,
  eyebrow     text,
  title       text,
  subtitle    text,
  primary key (page_slug, section_key)
);

create table if not exists faq_entries (
  id        bigint generated always as identity primary key,
  page_slug text not null references pages (slug) on delete cascade,
  position  integer not null,
  question  text not null,
  answer    text not null
);

create table if not exists cta_blocks (
  page_slug text primary key references pages (slug) on delete cascade,
  title     text,
  subtitle  text
);

create table if not exists cta_lead_paragraphs (
  id        bigint generated always as identity primary key,
  page_slug text not null references pages (slug) on delete cascade,
  position  integer not null,
  body      text not null
);

create table if not exists cta_links (
  id        bigint generated always as identity primary key,
  page_slug text not null references pages (slug) on delete cascade,
  position  integer not null,
  href      text not null,
  label     text not null,
  variant   text not null default 'outline' check (variant in ('outline', 'solid'))
);

-- ---------- editorial prose ---------------------------------------------------

-- Article and legal bodies. `blocks` is the typed block list the renderer
-- consumes; it is recursive (figures inside groups, columns inside duos) and
-- has no flat table shape.
create table if not exists rich_sections (
  id        bigint generated always as identity primary key,
  page_slug text not null references pages (slug) on delete cascade,
  anchor    text,
  variant   text,
  position  integer not null,
  blocks    jsonb not null
);

create table if not exists toc_entries (
  id        bigint generated always as identity primary key,
  page_slug text not null references pages (slug) on delete cascade,
  position  integer not null,
  href      text not null,
  label     text not null
);

create table if not exists article_meta (
  id        bigint generated always as identity primary key,
  page_slug text not null references pages (slug) on delete cascade,
  position  integer not null,
  label     text not null,
  value     text not null
);

create table if not exists read_next_cards (
  id          bigint generated always as identity primary key,
  page_slug   text not null references pages (slug) on delete cascade,
  position    integer not null,
  href        text,
  badge       text,
  path        text,
  alt         text not null default '',
  title       text,
  description text
);

-- ---------- prestation pages --------------------------------------------------

create table if not exists vision_blocks (
  page_slug text primary key references pages (slug) on delete cascade,
  kind      text not null check (kind in ('split', 'stacked')),
  eyebrow   text,
  heading   text
);

create table if not exists vision_paragraphs (
  id        bigint generated always as identity primary key,
  page_slug text not null references pages (slug) on delete cascade,
  position  integer not null,
  body      text not null
);

create table if not exists vision_images (
  id        bigint generated always as identity primary key,
  page_slug text not null references pages (slug) on delete cascade,
  position  integer not null,
  path      text not null,
  alt       text not null default ''
);

create table if not exists process_steps (
  id          bigint generated always as identity primary key,
  page_slug   text not null references pages (slug) on delete cascade,
  position    integer not null,
  num         text not null,
  title       text not null,
  description text not null
);

create table if not exists pricing_blocks (
  page_slug text primary key references pages (slug) on delete cascade,
  kind      text not null check (kind in ('cards', 'quote')),
  cta_label text,
  cta_href  text
);

create table if not exists pricing_cards (
  id          bigint generated always as identity primary key,
  page_slug   text not null references pages (slug) on delete cascade,
  position    integer not null,
  featured    boolean not null default false,
  tag         text,
  badge       text,
  title       text not null,
  description text,
  price       text not null,
  cta_label   text not null,
  cta_href    text not null
);

create table if not exists pricing_features (
  id       bigint generated always as identity primary key,
  card_id  bigint not null references pricing_cards (id) on delete cascade,
  position integer not null,
  body     text not null
);

-- 'intro' sits above the grid, 'footnote' below it, 'lead' is the quote variant.
create table if not exists pricing_notes (
  id        bigint generated always as identity primary key,
  page_slug text not null references pages (slug) on delete cascade,
  placement text not null check (placement in ('intro', 'footnote', 'lead')),
  position  integer not null,
  body      text not null
);

create table if not exists gallery_items (
  id        bigint generated always as identity primary key,
  page_slug text not null references pages (slug) on delete cascade,
  kind      text not null check (kind in ('bento', 'trio')),
  position  integer not null,
  span      text,
  path      text not null,
  alt       text not null default ''
);

-- ---------- home --------------------------------------------------------------

create table if not exists home_welcome (
  page_slug  text primary key references pages (slug) on delete cascade,
  image_path text not null,
  image_alt  text not null default ''
);

create table if not exists home_welcome_paragraphs (
  id       bigint generated always as identity primary key,
  position integer not null,
  body     text not null
);

create table if not exists prestation_teasers (
  id          bigint generated always as identity primary key,
  position    integer not null,
  index_label text not null,
  title       text not null,
  description text not null,
  href        text not null,
  cta_label   text not null,
  path        text not null,
  alt         text not null default ''
);

create table if not exists reviews (
  id           bigint generated always as identity primary key,
  position     integer not null,
  name         text not null,
  date_label   text not null,
  avatar_path  text not null,
  avatar_alt   text not null default '',
  stars        smallint not null check (stars between 1 and 5),
  quote        text not null
);

-- ---------- contact -----------------------------------------------------------

create table if not exists contact_info (
  id        bigint generated always as identity primary key,
  page_slug text not null references pages (slug) on delete cascade,
  position  integer not null,
  label     text not null,
  href      text,
  value     text,
  note      text
);

create table if not exists contact_form (
  page_slug       text primary key references pages (slug) on delete cascade,
  success_message text not null
);

create table if not exists contact_subject_options (
  id       bigint generated always as identity primary key,
  position integer not null,
  value    text not null,
  label    text not null
);

-- ---------- blog and events ---------------------------------------------------

create table if not exists blog_cover (
  page_slug text primary key references pages (slug) on delete cascade,
  href      text not null,
  flag      text,
  path      text not null,
  alt       text not null default '',
  meta      text,
  title     text,
  excerpt   text,
  cta_label text
);

create table if not exists blog_filters (
  id       bigint generated always as identity primary key,
  position integer not null,
  value    text not null,
  label    text not null
);

create table if not exists article_cards (
  id          bigint generated always as identity primary key,
  page_slug   text not null references pages (slug) on delete cascade,
  position    integer not null,
  href        text not null,
  date_label  text,
  badge       text,
  path        text,
  alt         text not null default '',
  title       text,
  description text,
  cta_label   text not null default 'Lire',
  category    text
);

create table if not exists event_featured (
  page_slug text primary key references pages (slug) on delete cascade,
  badge     text,
  path      text not null,
  alt       text not null default '',
  cta_href  text not null,
  cta_label text not null
);

create table if not exists event_featured_paragraphs (
  id       bigint generated always as identity primary key,
  position integer not null,
  body     text not null
);

create table if not exists event_featured_stats (
  id       bigint generated always as identity primary key,
  position integer not null,
  label    text not null,
  value    text not null
);

-- ---------- à propos ----------------------------------------------------------

create table if not exists about_story (
  page_slug   text primary key references pages (slug) on delete cascade,
  image_path  text not null,
  image_alt   text not null default '',
  image_focal text
);

-- Bold runs inside the bio mean these paragraphs are span lists, not plain text.
create table if not exists about_story_paragraphs (
  id       bigint generated always as identity primary key,
  position integer not null,
  spans    jsonb not null
);

create table if not exists about_figures (
  id       bigint generated always as identity primary key,
  position integer not null,
  value    text not null,
  label    text not null
);

create table if not exists about_strip (
  id       bigint generated always as identity primary key,
  position integer not null,
  path     text not null,
  alt      text not null default ''
);

create table if not exists about_close (
  page_slug text primary key references pages (slug) on delete cascade,
  quote     text not null,
  name      text not null
);

-- ---------- carte cadeau ------------------------------------------------------

create table if not exists gift_intro (
  page_slug text primary key references pages (slug) on delete cascade,
  lead      jsonb not null
);

create table if not exists gift_steps (
  id       bigint generated always as identity primary key,
  position integer not null,
  label    text not null
);

create table if not exists gift_packages (
  id          bigint generated always as identity primary key,
  position    integer not null,
  value       text not null,
  price       text not null,
  is_default  boolean not null default false,
  title       text not null,
  description text not null
);

create table if not exists gift_deliveries (
  id          bigint generated always as identity primary key,
  position    integer not null,
  value       text not null,
  is_default  boolean not null default false,
  title       text not null,
  description text not null,
  price       text not null
);

create table if not exists gift_form (
  page_slug       text primary key references pages (slug) on delete cascade,
  submit_label    text not null,
  success_message text not null,
  card_brand      text not null,
  card_caption    text not null
);

-- ---------- indexes -----------------------------------------------------------

create index if not exists hero_marquee_images_page_idx on hero_marquee_images (page_slug, speed, position);
create index if not exists rich_sections_page_idx        on rich_sections (page_slug, position);
create index if not exists toc_entries_page_idx          on toc_entries (page_slug, position);
create index if not exists faq_entries_page_idx          on faq_entries (page_slug, position);
create index if not exists gallery_items_page_idx        on gallery_items (page_slug, position);
create index if not exists pricing_cards_page_idx        on pricing_cards (page_slug, position);
create index if not exists pricing_features_card_idx     on pricing_features (card_id, position);
create index if not exists process_steps_page_idx        on process_steps (page_slug, position);
create index if not exists article_cards_page_idx        on article_cards (page_slug, position);
create index if not exists cta_links_page_idx            on cta_links (page_slug, position);

-- ---------- row level security ------------------------------------------------
-- Public website: everyone may read, nobody may write through the API.

do $$
declare t text;
begin
  foreach t in array array[
    'site_settings','nav_items','footer_images','pages','hero_marquee','hero_marquee_images',
    'article_hero','about_hero','about_hero_backgrounds','section_headings','faq_entries',
    'cta_blocks','cta_lead_paragraphs','cta_links','rich_sections','toc_entries','article_meta',
    'read_next_cards','vision_blocks','vision_paragraphs','vision_images','process_steps',
    'pricing_blocks','pricing_cards','pricing_features','pricing_notes','gallery_items',
    'home_welcome','home_welcome_paragraphs','prestation_teasers','reviews','contact_info',
    'contact_form','contact_subject_options','blog_cover','blog_filters','article_cards',
    'event_featured','event_featured_paragraphs','event_featured_stats','about_story',
    'about_story_paragraphs','about_figures','about_strip','about_close','gift_intro',
    'gift_steps','gift_packages','gift_deliveries','gift_form'
  ]
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists %I on %I', t || '_public_read', t);
    execute format('create policy %I on %I for select using (true)', t || '_public_read', t);
  end loop;
end $$;

-- Payments through Stripe Checkout, for the gift card and for the priced
-- prestations. This is the order book: one row per checkout session, written
-- by the site with the secret key and never readable with the publishable one.

begin;

create table if not exists orders (
  id              bigint generated always as identity primary key,
  session_id      text not null unique,
  payment_intent  text,
  kind            text not null check (kind in ('gift', 'prestation')),
  page_slug       text not null,
  status          text not null default 'pending'
                  check (status in ('pending', 'paid', 'processing', 'failed', 'expired')),
  item_value      text not null,
  item_title      text not null,
  option_value    text,
  option_title    text,
  amount_total    integer not null check (amount_total >= 0),
  currency        text not null default 'eur',
  customer_name   text not null,
  email           text not null,
  phone           text,
  recipient       text,
  address         text,
  postal          text,
  city            text,
  message         text not null default '',
  created_at      timestamptz not null default now(),
  paid_at         timestamptz,
  fulfilled_at    timestamptz
);

create index if not exists orders_created_idx on orders (created_at desc);

-- No policy on purpose: with row level security on and nothing granting a
-- read, the publishable key sees an empty table. The secret key bypasses it.
alter table orders enable row level security;
revoke all on orders from anon, authenticated;

-- The gift form now takes payment, so its button and its confirmation say so.
update gift_form
   set submit_label = 'Payer et commander',
       success_message = 'Votre paiement est confirmé et Stripe vous envoie un reçu par email. Je vous recontacte très vite pour finaliser votre carte cadeau.'
 where page_slug = 'carte-cadeau';

insert into section_headings (page_slug, section_key, eyebrow, title, subtitle)
values ('carte-cadeau', 'thanks', 'Commande confirmée', 'Merci !', 'Votre carte cadeau est en route')
on conflict (page_slug, section_key) do nothing;

-- Every priced prestation gets a booking page and a thank you heading.
insert into section_headings (page_slug, section_key, eyebrow, title, subtitle)
select page_slug, 'booking', 'Réservation', 'Réserver ma séance', 'Choisissez votre formule et réglez en ligne, je vous contacte ensuite pour fixer la date'
  from pricing_blocks where kind = 'cards'
on conflict (page_slug, section_key) do nothing;

insert into section_headings (page_slug, section_key, eyebrow, title, subtitle)
select page_slug, 'thanks', 'Séance réservée', 'Merci !', 'Votre paiement est confirmé et Stripe vous envoie un reçu. Je vous contacte très vite par email ou téléphone pour fixer la date de votre séance.'
  from pricing_blocks where kind = 'cards'
on conflict (page_slug, section_key) do nothing;

-- Each formula's button opens the booking page with that formula chosen.
update pricing_cards c
   set cta_href = '/reserver/' || c.page_slug || '/?formule=' || c.id
  from pricing_blocks b
 where b.page_slug = c.page_slug and b.kind = 'cards';

commit;

import json, sys

C = json.load(open('/tmp/content.json'))
out = []
W = out.append

def q(v):
    """SQL literal."""
    if v is None: return 'null'
    if isinstance(v, bool): return 'true' if v else 'false'
    if isinstance(v, (int, float)): return str(v)
    return "'" + str(v).replace("'", "''") + "'"

def jb(v):
    return "'" + json.dumps(v, ensure_ascii=False).replace("'", "''") + "'::jsonb"

def arr(vals):
    inner = ', '.join(q(v) for v in vals)
    return f"array[{inner}]::text[]"

def insert(table, cols, rows):
    if not rows: return
    W(f"insert into {table} ({', '.join(cols)}) values")
    W(',\n'.join('  (' + ', '.join(r) + ')' for r in rows) + ';')
    W('')

HOME_SLUG = 'index'
HOME_TITLE = 'Bienvenue | Roger Moniz Photographe à Nice'

W("-- Generated from the site's own content modules. Re-runnable: it clears")
W("-- every content table first, so the database always matches the site.")
W('begin;')
W('')
W("truncate table " + ", ".join([
 'site_settings','nav_items','footer_images','pages','hero_marquee','hero_marquee_images',
 'article_hero','about_hero','about_hero_backgrounds','section_headings','faq_entries',
 'cta_blocks','cta_lead_paragraphs','cta_links','rich_sections','toc_entries','article_meta',
 'read_next_cards','vision_blocks','vision_paragraphs','vision_images','process_steps',
 'pricing_blocks','pricing_cards','pricing_features','pricing_notes','gallery_items',
 'home_welcome','home_welcome_paragraphs','prestation_teasers','reviews','contact_info',
 'contact_form','contact_subject_options','blog_cover','blog_filters','article_cards',
 'event_featured','event_featured_paragraphs','event_featured_stats','about_story',
 'about_story_paragraphs','about_figures','about_strip','about_close','gift_intro',
 'gift_steps','gift_packages','gift_deliveries','gift_form']) + " restart identity cascade;")
W('')

# ---- site ----
s = C['siteIdentity']
insert('site_settings', ['id','name','location','email','phone','phone_display','instagram','logo_path'],
       [[ '1', q(s['name']), q(s['location']), q(s['email']), q(s['phone']), q(s['phoneDisplay']), q(s['instagram']), q(s['logo']) ]])

nav = []
pos = 0
for item in C['primaryNav']:
    nav.append([q('primary'), q(item['label']), q(item['href']), 'null', str(pos)]); pos += 1
    for child in item.get('children') or []:
        nav.append([q('prestations'), q(child['label']), q(child['href']), q(item['label']), str(pos)]); pos += 1
for i, item in enumerate(C['legalNav']):
    nav.append([q('legal'), q(item['label']), q(item['href']), 'null', str(i)])
insert('nav_items', ['group_key','label','href','parent_label','position'], nav)

insert('footer_images', ['position','path','alt'],
       [[str(i), q(p), q('')] for i, p in enumerate(C['footerMarquee'])])

# ---- pages ----
pages_rows = []
order = 0
def page_row(slug, route, kind, title, preloader):
    global order
    pages_rows.append([q(slug), q(route), q(kind), q(title), q(preloader), str(order)])
    order += 1

page_row(HOME_SLUG, '/', 'home', HOME_TITLE, 'Roger Moniz')
for slug, p in C['prestations'].items():
    page_row(slug, '/' + slug, 'prestation', p['metaTitle'], p['preloaderLabel'])
for key, p in C['editorial'].items():
    page_row(p['route'].lstrip('/'), p['route'], p['kind'], p['metaTitle'], p['preloaderLabel'])
for slug, p in C['pages'].items():
    page_row(slug, '/' + slug, 'standalone', p['metaTitle'], p['preloaderLabel'])
insert('pages', ['slug','route','kind','meta_title','preloader_label','sort_order'], pages_rows)

def ed_slug(p): return p['route'].lstrip('/')

# ---- heroes ----
hm, hmi = [], []
def add_marquee(slug, hero):
    hm.append([q(slug), q(hero.get('eyebrow')), q(hero.get('title')), q(hero.get('subtitle'))])
    for col in hero['columns']:
        for i, img in enumerate(col['images']):
            hmi.append([q(slug), q(col['speed']), str(i), q(img['path']), q(img['alt'])])

add_marquee(HOME_SLUG, C['home']['hero'])
for slug, p in C['prestations'].items(): add_marquee(slug, p['hero'])
for key, p in C['editorial'].items():
    if p['kind'] == 'legal': add_marquee(ed_slug(p), p['hero'])
for slug, p in C['pages'].items():
    if slug != 'a-propos': add_marquee(slug, p['hero'])
insert('hero_marquee', ['page_slug','eyebrow','title','subtitle'], hm)
insert('hero_marquee_images', ['page_slug','speed','position','path','alt'], hmi)

ah = []
for key, p in C['editorial'].items():
    if p['kind'] != 'article': continue
    h = p['hero']
    ah.append([q(ed_slug(p)), q(h['category']), q(h['date']), q(h['readingTime']), q(h['title']),
               q(h['path']), q(h['alt']), q(h['scrollLabel']), q(p['meta']['shareLabel'])])
insert('article_hero', ['page_slug','category','date_label','reading_time','title','image_path','image_alt','scroll_label','share_label'], ah)

ab = C['pages']['a-propos']['hero']
insert('about_hero', ['page_slug','eyebrow','title_lines','tag','lead','scroll_label'],
       [[q('a-propos'), q(ab['eyebrow']), arr(ab['titleLines']), q(ab['tag']), q(ab['lead']), q(ab['scrollLabel'])]])
insert('about_hero_backgrounds', ['page_slug','theme','path','alt','focal'],
       [[q('a-propos'), q(b['theme']), q(b['path']), q(b['alt']), q(b['focal'])] for b in ab['backgrounds']])

# ---- section headings ----
sh = []
def heading(slug, key, eyebrow=None, title=None, subtitle=None):
    if eyebrow is None and title is None and subtitle is None: return
    sh.append([q(slug), q(key), q(eyebrow), q(title), q(subtitle)])

h = C['home']
heading(HOME_SLUG, 'welcome', h['welcome']['eyebrow'], h['welcome']['title'], h['welcome']['subtitle'])
heading(HOME_SLUG, 'prestations', h['prestations']['heading'].get('eyebrow'), h['prestations']['heading']['title'], h['prestations']['heading'].get('subtitle'))
heading(HOME_SLUG, 'reviews', h['reviews']['heading'].get('eyebrow'), h['reviews']['heading']['title'], h['reviews']['heading'].get('subtitle'))
heading(HOME_SLUG, 'faq', h['faq']['heading'].get('eyebrow'), h['faq']['heading']['title'], h['faq']['heading'].get('subtitle'))

for slug, p in C['prestations'].items():
    heading(slug, 'process', p['process'].get('eyebrow'), p['process']['title'], p['process'].get('subtitle'))
    heading(slug, 'pricing', p['pricing'].get('eyebrow'), p['pricing']['title'], p['pricing'].get('subtitle'))
    heading(slug, 'portfolio', p['portfolio'].get('eyebrow'), p['portfolio']['title'], p['portfolio'].get('subtitle'))

c = C['pages']['contact']
heading('contact', 'form', c['formEyebrow'], c['formTitle'], c['formSubtitle'])
heading('contact', 'faq', c['faq'].get('eyebrow'), c['faq']['title'], c['faq'].get('subtitle'))

b = C['pages']['blog']
heading('blog', 'featured', None, b['featuredIntro'], None)
heading('blog', 'filters', None, b['filterHead'], None)
heading('blog', 'articles', None, b['articlesIntro'], None)

e = C['pages']['events']
heading('events', 'featured', e['featured']['eyebrow'], e['featured']['title'], e['featured']['subtitle'])
heading('events', 'list', e['listEyebrow'], e['listTitle'], e['listSubtitle'])
heading('events', 'faq', e['faq'].get('eyebrow'), e['faq']['title'], e['faq'].get('subtitle'))

a = C['pages']['a-propos']
heading('a-propos', 'story', a['story']['eyebrow'], a['story']['title'], None)
heading('a-propos', 'process', a['process'].get('eyebrow'), a['process']['title'], a['process'].get('subtitle'))

g = C['pages']['carte-cadeau']
heading('carte-cadeau', 'intro', g['intro']['eyebrow'], g['intro']['title'], g['intro']['subtitle'])
heading('carte-cadeau', 'faq', g['faq'].get('eyebrow'), g['faq']['title'], g['faq'].get('subtitle'))
insert('section_headings', ['page_slug','section_key','eyebrow','title','subtitle'], sh)

# ---- faq ----
faq = []
def add_faq(slug, entries):
    for i, en in enumerate(entries):
        faq.append([q(slug), str(i), q(en['question']), q(en['answer'])])
add_faq(HOME_SLUG, h['faq']['entries'])
for slug in ('contact','events','carte-cadeau'):
    add_faq(slug, C['pages'][slug]['faq']['entries'])
insert('faq_entries', ['page_slug','position','question','answer'], faq)

# ---- cta ----
cb, clp, cl = [], [], []
def add_links(slug, links):
    for i, l in enumerate(links):
        cl.append([q(slug), str(i), q(l['href']), q(l['label']), q(l['variant'])])

add_links(HOME_SLUG, [{'href': h['cta']['href'], 'label': h['cta']['label'], 'variant': 'outline'}])
for slug, p in C['prestations'].items():
    if p.get('ctaHeading'):
        cb.append([q(slug), q(p['ctaHeading']['title']), q(p['ctaHeading'].get('subtitle'))])
    for i, line in enumerate(p.get('ctaLead') or []):
        clp.append([q(slug), str(i), q(line)])
    add_links(slug, p['cta'])
for key, p in C['editorial'].items():
    if not p.get('cta'): continue
    slug = ed_slug(p)
    cb.append([q(slug), q(p['cta']['title']), 'null'])
    if p['cta'].get('lead'): clp.append([q(slug), '0', q(p['cta']['lead'])])
    add_links(slug, p['cta']['links'])
add_links('a-propos', a['cta'])
insert('cta_blocks', ['page_slug','title','subtitle'], cb)
insert('cta_lead_paragraphs', ['page_slug','position','body'], clp)
insert('cta_links', ['page_slug','position','href','label','variant'], cl)

# ---- editorial prose ----
rs, toc, am, rn = [], [], [], []
for key, p in C['editorial'].items():
    slug = ed_slug(p)
    for i, sec in enumerate(p['sections']):
        rs.append([q(slug), q(sec.get('id')), q(sec.get('variant')), str(i), jb(sec['blocks'])])
    for i, t in enumerate(p['toc']):
        toc.append([q(slug), str(i), q(t['href']), q(t['label'])])
    if p['kind'] == 'article':
        for i, m in enumerate(p['meta']['blocks']):
            am.append([q(slug), str(i), q(m['label']), q(m['value'])])
        if p.get('readNext'):
            for i, cd in enumerate(p['readNext']['cards']):
                rn.append([q(slug), str(i), q(cd['href']), q(cd['badge']), q(cd['path']), q(cd['alt']), q(cd['title']), q(cd['description'])])
insert('rich_sections', ['page_slug','anchor','variant','position','blocks'], rs)
insert('toc_entries', ['page_slug','position','href','label'], toc)
insert('article_meta', ['page_slug','position','label','value'], am)
insert('read_next_cards', ['page_slug','position','href','badge','path','alt','title','description'], rn)
# read-next section title lives with the other headings
W("insert into section_headings (page_slug, section_key, title) values")
rows = [f"  ({q(ed_slug(p))}, {q('read_next')}, {q(p['readNext']['title'])})"
        for p in C['editorial'].values() if p.get('readNext')]
W(',\n'.join(rows) + ";")
W('')

# ---- prestations ----
vb, vp, vi, ps, pb, pn, gi = [], [], [], [], [], [], []
card_rows, feature_blocks = [], []
for slug, p in C['prestations'].items():
    v = p['vision']
    vb.append([q(slug), q(v['kind']), q(v['eyebrow']), q(v['heading'])])
    for i, para in enumerate(v['paragraphs']): vp.append([q(slug), str(i), q(para)])
    for i, img in enumerate(v['images']): vi.append([q(slug), str(i), q(img['path']), q(img['alt'])])
    for i, st in enumerate(p['process']['steps']):
        ps.append([q(slug), str(i), q(st['num']), q(st['title']), q(st['description'])])
    pr = p['pricing']
    pb.append([q(slug), q(pr['kind']), q(pr.get('ctaLabel')), q(pr.get('ctaHref'))])
    for placement in ('intro','footnote','lead'):
        for i, line in enumerate(pr.get(placement) or []):
            pn.append([q(slug), q(placement), str(i), q(line)])
    for i, cd in enumerate(pr.get('cards') or []):
        card_rows.append([q(slug), str(i), q(cd['featured']), q(cd['tag']), q(cd['badge']),
                          q(cd['title']), q(cd['description']), q(cd['price']), q(cd['ctaLabel']), q(cd['ctaHref'])])
        feature_blocks.append((slug, i, cd['features']))
    po = p['portfolio']
    for i, it in enumerate(po['items']):
        gi.append([q(slug), q(po['kind']), str(i), q(it['span']), q(it['image']['path']), q(it['image']['alt'])])

insert('vision_blocks', ['page_slug','kind','eyebrow','heading'], vb)
insert('vision_paragraphs', ['page_slug','position','body'], vp)
insert('vision_images', ['page_slug','position','path','alt'], vi)
insert('process_steps', ['page_slug','position','num','title','description'], ps)
insert('pricing_blocks', ['page_slug','kind','cta_label','cta_href'], pb)
insert('pricing_cards', ['page_slug','position','featured','tag','badge','title','description','price','cta_label','cta_href'], card_rows)
insert('pricing_notes', ['page_slug','placement','position','body'], pn)
insert('gallery_items', ['page_slug','kind','position','span','path','alt'], gi)

# features reference their card by (page_slug, position)
if feature_blocks:
    W('-- Card features, matched to their card by page and position.')
    for slug, idx, feats in feature_blocks:
        for i, f in enumerate(feats):
            W(f"insert into pricing_features (card_id, position, body) select id, {i}, {q(f)} "
              f"from pricing_cards where page_slug = {q(slug)} and position = {idx};")
    W('')

# ---- home ----
w = h['welcome']
insert('home_welcome', ['page_slug','image_path','image_alt'],
       [[q(HOME_SLUG), q(w['image']['path']), q(w['image']['alt'])]])
insert('home_welcome_paragraphs', ['position','body'],
       [[str(i), q(x)] for i, x in enumerate(w['paragraphs'])])
insert('prestation_teasers', ['position','index_label','title','description','href','cta_label','path','alt'],
       [[str(i), q(t['index']), q(t['title']), q(t['description']), q(t['href']), q(t['ctaLabel']),
         q(t['image']['path']), q(t['image']['alt'])] for i, t in enumerate(h['prestations']['slides'])])
insert('reviews', ['position','name','date_label','avatar_path','avatar_alt','stars','quote'],
       [[str(i), q(r['name']), q(r['date']), q(r['avatar']['path']), q(r['avatar']['alt']), str(r['stars']), q(r['text'])]
        for i, r in enumerate(h['reviews']['items'])])

# ---- contact ----
insert('contact_info', ['page_slug','position','label','href','value','note'],
       [[q('contact'), str(i), q(b_['label']), q(b_['href']), q(b_['value']), q(b_['note'])] for i, b_ in enumerate(c['info'])])
insert('contact_form', ['page_slug','success_message'], [[q('contact'), q(c['formSuccess'])]])
insert('contact_subject_options', ['position','value','label'],
       [[str(i), q(o['value']), q(o['label'])] for i, o in enumerate(c['subjectOptions']) if o['value']])

# ---- blog / events ----
cov = b['cover']
insert('blog_cover', ['page_slug','href','flag','path','alt','meta','title','excerpt','cta_label'],
       [[q('blog'), q(cov['href']), q(cov['flag']), q(cov['path']), q(cov['alt']), q(cov['meta']),
         q(cov['title']), q(cov['excerpt']), q(cov['ctaLabel'])]])
insert('blog_filters', ['position','value','label'],
       [[str(i), q(f['value']), q(f['label'])] for i, f in enumerate(b['filters'])])

cards = []
for slug in ('blog','events'):
    for i, cd in enumerate(C['pages'][slug]['cards']):
        cards.append([q(slug), str(i), q(cd['href']), q(cd.get('date')), q(cd['badge']), q(cd['path']),
                      q(cd['alt']), q(cd['title']), q(cd['description']), q(cd['ctaLabel']), q(cd.get('category'))])
insert('article_cards', ['page_slug','position','href','date_label','badge','path','alt','title','description','cta_label','category'], cards)

f = e['featured']
insert('event_featured', ['page_slug','badge','path','alt','cta_href','cta_label'],
       [[q('events'), q(f['badge']), q(f['path']), q(f['alt']), q(f['ctaHref']), q(f['ctaLabel'])]])
insert('event_featured_paragraphs', ['position','body'],
       [[str(i), q(x)] for i, x in enumerate(f['paragraphs'])])
insert('event_featured_stats', ['position','label','value'],
       [[str(i), q(st['label']), q(st['value'])] for i, st in enumerate(f['stats'])])

# ---- about ----
st_ = a['story']
insert('about_story', ['page_slug','image_path','image_alt','image_focal'],
       [[q('a-propos'), q(st_['image']['path']), q(st_['image']['alt']), q(st_['image'].get('focal'))]])
insert('about_story_paragraphs', ['position','spans'],
       [[str(i), jb(sp)] for i, sp in enumerate(st_['paragraphs'])])
insert('about_figures', ['position','value','label'],
       [[str(i), q(x['value']), q(x['label'])] for i, x in enumerate(a['figures'])])
insert('about_strip', ['position','path','alt'],
       [[str(i), q(x['path']), q(x['alt'])] for i, x in enumerate(a['strip'])])
insert('about_close', ['page_slug','quote','name'], [[q('a-propos'), q(a['close']['quote']), q(a['close']['name'])]])
insert('process_steps', ['page_slug','position','num','title','description'],
       [[q('a-propos'), str(i), q(s_['num']), q(s_['title']), q(s_['description'])] for i, s_ in enumerate(a['process']['steps'])])

# ---- gift ----
insert('gift_intro', ['page_slug','lead'], [[q('carte-cadeau'), jb(g['intro']['lead'])]])
insert('gift_steps', ['position','label'], [[str(i), q(x)] for i, x in enumerate(g['steps'])])
insert('gift_packages', ['position','value','price','is_default','title','description'],
       [[str(i), q(p_['value']), q(p_['price']), q(p_['checked']), q(p_['title']), q(p_['description'])] for i, p_ in enumerate(g['packages'])])
insert('gift_deliveries', ['position','value','is_default','title','description','price'],
       [[str(i), q(d['value']), q(d['checked']), q(d['title']), q(d['description']), q(d['price'])] for i, d in enumerate(g['deliveries'])])
insert('gift_form', ['page_slug','submit_label','success_message','card_brand','card_caption'],
       [[q('carte-cadeau'), q(g['submitLabel']), q(g['formSuccess']), q(g['cardLabels']['brand']), q(g['cardLabels']['caption'])]])

W('commit;')
open('supabase/seed.sql', 'w').write('\n'.join(out))
print(f"seed.sql: {len(out)} lines")

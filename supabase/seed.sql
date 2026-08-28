-- Generated from the site's own content modules. Re-runnable: it clears
-- every content table first, so the database always matches the site.
begin;

truncate table site_settings, nav_items, footer_images, pages, hero_marquee, hero_marquee_images, article_hero, about_hero, about_hero_backgrounds, section_headings, faq_entries, cta_blocks, cta_lead_paragraphs, cta_links, rich_sections, toc_entries, article_meta, read_next_cards, vision_blocks, vision_paragraphs, vision_images, process_steps, pricing_blocks, pricing_cards, pricing_features, pricing_notes, gallery_items, home_welcome, home_welcome_paragraphs, prestation_teasers, reviews, contact_info, contact_form, contact_subject_options, blog_cover, blog_filters, article_cards, event_featured, event_featured_paragraphs, event_featured_stats, about_story, about_story_paragraphs, about_figures, about_strip, about_close, gift_intro, gift_steps, gift_packages, gift_deliveries, gift_form restart identity cascade;

insert into site_settings (id, name, location, email, phone, phone_display, instagram, logo_path) values
  (1, 'Roger Moniz', 'Photographe · Nice & Côte d''Azur', 'contact@rogermoniz.com', '+33647936098', '06 47 93 60 98', 'https://www.instagram.com/roger.moniz.photographe/', 'https://res.cloudinary.com/dfbuajiyj/image/upload/v1781367819/R_3_xb3j2t_hqcxbt.webp');

insert into nav_items (group_key, label, href, parent_label, position) values
  ('primary', 'Prestations', '/portrait', null, 0),
  ('prestations', 'Portrait', '/portrait', 'Prestations', 1),
  ('prestations', 'Amour de Soi', '/amour-de-soi', 'Prestations', 2),
  ('prestations', 'Fantaisie', '/fantaisie', 'Prestations', 3),
  ('prestations', 'Corporate', '/corporate', 'Prestations', 4),
  ('prestations', 'Grossesse', '/grossesse', 'Prestations', 5),
  ('prestations', 'In The Box', '/in-the-box', 'Prestations', 6),
  ('prestations', 'Evénementiel', '/evenementiel', 'Prestations', 7),
  ('prestations', 'Packshot', '/packshot', 'Prestations', 8),
  ('primary', 'Events', '/events', null, 9),
  ('primary', 'Blog', '/blog', null, 10),
  ('primary', 'À propos', '/a-propos', null, 11),
  ('primary', 'Contact', '/contact', null, 12),
  ('legal', 'Mentions légales', '/mentions-legales', null, 0),
  ('legal', 'CGV', '/cgv', null, 1),
  ('legal', 'Confidentialité', '/confidentialite', null, 2);

insert into footer_images (position, path, alt) values
  (0, 'https://res.cloudinary.com/dfbuajiyj/image/upload/f_auto,q_auto,w_500/v1779962864/OPPLR_2026_Marion_7_wmt1q9.webp', ''),
  (1, 'https://res.cloudinary.com/dfbuajiyj/image/upload/f_auto,q_auto,w_500/v1779962892/Fantaisie_20_d4p7y7.webp', ''),
  (2, 'https://res.cloudinary.com/dfbuajiyj/image/upload/f_auto,q_auto,w_500/v1779963169/Myl%C3%A8ne-18_nqlixh.webp', ''),
  (3, 'https://res.cloudinary.com/dfbuajiyj/image/upload/f_auto,q_auto,w_500/v1779963334/Evenement_8_gjmdf9.webp', ''),
  (4, 'https://res.cloudinary.com/dfbuajiyj/image/upload/f_auto,q_auto,w_500/v1779963384/Shooting_in_the_box_1_wabrhi.webp', ''),
  (5, 'https://res.cloudinary.com/dfbuajiyj/image/upload/f_auto,q_auto,w_500/v1779962865/OPPLR_2026_Marion_10_gww0li.webp', ''),
  (6, 'https://res.cloudinary.com/dfbuajiyj/image/upload/f_auto,q_auto,w_500/v1779963171/Myl%C3%A8ne-29_f6qop1.webp', ''),
  (7, 'https://res.cloudinary.com/dfbuajiyj/image/upload/f_auto,q_auto,w_500/v1779962892/Fantaisie_21_abq3xn.webp', '');

insert into pages (slug, route, kind, meta_title, preloader_label, sort_order) values
  ('index', '/', 'home', 'Bienvenue | Roger Moniz Photographe à Nice', 'Roger Moniz', 0),
  ('portrait', '/portrait', 'prestation', 'Prestation Portrait | Roger Moniz Studio', 'PORTRAIT', 1),
  ('amour-de-soi', '/amour-de-soi', 'prestation', 'Prestation Amour de soi | Roger Moniz Studio', 'Amour de soi', 2),
  ('fantaisie', '/fantaisie', 'prestation', 'Prestation Fantaisie | Roger Moniz Studio', 'Fantaisie', 3),
  ('corporate', '/corporate', 'prestation', 'Prestation Corporate | Roger Moniz Studio', 'CORPORATE', 4),
  ('grossesse', '/grossesse', 'prestation', 'Prestation Grossesse | Roger Moniz Studio', 'Grossesse', 5),
  ('in-the-box', '/in-the-box', 'prestation', 'Prestation In The Box | Roger Moniz Studio', 'In The Box', 6),
  ('evenementiel', '/evenementiel', 'prestation', 'Prestation Evénementiel | Roger Moniz Studio', 'Evenementiel', 7),
  ('packshot', '/packshot', 'prestation', 'Prestation Packshot | Roger Moniz Studio', 'Packshot', 8),
  ('blog/octobre-rose-2025', '/blog/octobre-rose-2025', 'article', 'Octobre Rose 2025 | Roger Moniz Photographe à Nice', 'ROGER MONIZ', 9),
  ('blog/shooting-ehpad', '/blog/shooting-ehpad', 'article', 'Shooting en EHPAD | Roger Moniz Photographe à Nice', 'ROGER MONIZ', 10),
  ('blog/trois-lieux-magiques-a-nice', '/blog/trois-lieux-magiques-a-nice', 'article', 'Trois lieux magiques à Nice pour un shooting photo | Roger Moniz Photographe à Nice', 'ROGER MONIZ', 11),
  ('events/on-pose-pour-le-rose', '/events/on-pose-pour-le-rose', 'article', 'On pose pour le rose | Roger Moniz Photographe à Nice', 'ROGER MONIZ', 12),
  ('cgv', '/cgv', 'legal', 'Conditions Générales de Ventes | Roger Moniz Photographe à Nice', 'ROGER MONIZ', 13),
  ('confidentialite', '/confidentialite', 'legal', 'Politique de Confidentialité | Roger Moniz Photographe à Nice', 'ROGER MONIZ', 14),
  ('mentions-legales', '/mentions-legales', 'legal', 'Mentions Légales | Roger Moniz Photographe à Nice', 'ROGER MONIZ', 15),
  ('contact', '/contact', 'standalone', 'Contact | Roger Moniz Photographe à Nice', 'ROGER MONIZ', 16),
  ('blog', '/blog', 'standalone', 'Blog | Roger Moniz Photographe à Nice', 'ROGER MONIZ', 17),
  ('events', '/events', 'standalone', 'Evénement | Roger Moniz Photographe à Nice', 'Events', 18),
  ('a-propos', '/a-propos', 'standalone', 'À Propos | Roger Moniz Studio', 'ROGER MONIZ', 19),
  ('carte-cadeau', '/carte-cadeau', 'standalone', 'Carte Cadeau | Roger Moniz Photographe à Nice', 'CARTE CADEAU', 20);

insert into hero_marquee (page_slug, eyebrow, title, subtitle) values
  ('index', 'Photographe à nice', 'Roger Moniz', 'L''Art Avant Tout'),
  ('portrait', 'Prestation', 'Portrait', 'Se voir, simplement.'),
  ('amour-de-soi', 'Prestation', 'Amour de soi', 'Une expérience photographique pour se retrouver'),
  ('fantaisie', 'Prestation', 'Fantaisie', 'Incarnez le personnage que vous portez en vous.'),
  ('corporate', 'Prestation', 'Corporate', 'Votre image, votre marque.'),
  ('grossesse', 'Prestation', 'Grossesse', 'Votre corps raconte déjà une histoire.'),
  ('in-the-box', 'Prestation', 'In The Box', 'Prêt à vous amuser ?'),
  ('evenementiel', 'Prestation', 'Evénementiel', 'Pour tous vos moments.'),
  ('packshot', 'Prestation', 'Packshot', 'Et si vos produits donnaient envie au premier regard ?'),
  ('cgv', 'Informations Légales', 'Conditions Générales', 'De Vente'),
  ('confidentialite', 'Informations Légales', 'Politique De', 'Confidentialité'),
  ('mentions-legales', 'Informations Légales', 'Mentions Légales', 'Et Confidentialité'),
  ('contact', 'Le Studio', 'Contact', null),
  ('blog', 'Journal', 'Blog', 'Chroniques & Coulisses'),
  ('events', 'En ce moment', 'Events', 'Tout savoir sur les prochains événements'),
  ('carte-cadeau', 'Toujours un bon choix', 'Carte Cadeau', 'Offrir, s''offrir ou se faire un offrir une séance');

insert into hero_marquee_images (page_slug, speed, position, path, alt) values
  ('index', 'up', 0, 'v1779962864/OPPLR_2026_Marion_7_wmt1q9.webp', 'Roger Moniz'),
  ('index', 'up', 1, 'v1779962890/Fantaisie_17_kwjvgl.webp', 'Roger Moniz'),
  ('index', 'up', 2, 'v1781177281/Am%C3%A9lie_Grossesse-4_dvyafe.webp', 'Roger Moniz'),
  ('index', 'up', 3, 'v1779963021/Portrait_16_qu6imy.webp', 'Roger Moniz'),
  ('index', 'down', 0, 'v1779962856/Amour_de_soi_6_qun48b.webp', 'Roger Moniz'),
  ('index', 'down', 1, 'v1779962891/Fantaisie_19_xcpaou.webp', 'Roger Moniz'),
  ('index', 'down', 2, 'v1779963355/Grossesse_8_boag72.webp', 'Roger Moniz'),
  ('index', 'down', 3, 'v1779962862/OPPLR_2026_Emilie_8_wy8qay.webp', 'Roger Moniz'),
  ('index', 'up-slow', 0, 'v1779962856/Amour_de_soi_8_wwgluz.webp', 'Roger Moniz'),
  ('index', 'up-slow', 1, 'v1779963162/Myl%C3%A8ne-2_beehdc.webp', 'Roger Moniz'),
  ('index', 'up-slow', 2, 'v1779963267/Portrait_29_zpqldx.webp', 'Roger Moniz'),
  ('index', 'up-slow', 3, 'v1779962882/Fantaisie_2_eavcyy.webp', 'Roger Moniz'),
  ('index', 'down-slow', 0, 'v1781181386/Produits_-_Les_Fumades-9_zpp7fw.webp', 'Roger Moniz'),
  ('index', 'down-slow', 1, 'v1779962887/Fantaisie_11_i3lfas.webp', 'Roger Moniz'),
  ('index', 'down-slow', 2, 'v1779963360/Grossesse_11_hhxgws.webp', 'Roger Moniz'),
  ('index', 'down-slow', 3, 'v1779963329/Evenement_5_uvlf0l.webp', 'Roger Moniz'),
  ('portrait', 'up', 0, 'v1779963128/Portrait_23_rwqfif.webp', 'Roger Moniz'),
  ('portrait', 'up', 1, 'v1779962925/Portrait_12_x6w9tu.webp', 'Roger Moniz'),
  ('portrait', 'up', 2, 'v1779962923/Portrait_9_yavopq.webp', 'Roger Moniz'),
  ('portrait', 'up', 3, 'v1779962922/Portrait_7_iqnsvx.webp', 'Roger Moniz'),
  ('portrait', 'down', 0, 'v1779963169/Myl%C3%A8ne-18_nqlixh.webp', 'Roger Moniz'),
  ('portrait', 'down', 1, 'v1779962924/Portrait_10_bjwrwl.webp', 'Roger Moniz'),
  ('portrait', 'down', 2, 'v1779962921/Portrait_1_n2r1ls.webp', 'Roger Moniz'),
  ('portrait', 'down', 3, 'v1779963000/Portrait_15_okf9jk.webp', 'Roger Moniz'),
  ('portrait', 'up-slow', 0, 'v1779962924/Portrait_11_chxpsa.webp', 'Roger Moniz'),
  ('portrait', 'up-slow', 1, 'v1779963040/Portrait_18_bnwc8w.webp', 'Roger Moniz'),
  ('portrait', 'up-slow', 2, 'v1779963162/Myl%C3%A8ne-2_beehdc.webp', 'Roger Moniz'),
  ('portrait', 'up-slow', 3, 'v1779962999/Portrait_14_qnmsfw.webp', 'Roger Moniz'),
  ('portrait', 'down-slow', 0, 'v1779963164/Myl%C3%A8ne-7_ffgl1b.webp', 'Roger Moniz'),
  ('portrait', 'down-slow', 1, 'v1779963022/Portrait_17_okc6dd.webp', 'Roger Moniz'),
  ('portrait', 'down-slow', 2, 'v1779962922/Portrait_8_wuaopt.webp', 'Roger Moniz'),
  ('portrait', 'down-slow', 3, 'v1779963167/Myl%C3%A8ne-13_x9mxrx.webp', 'Roger Moniz'),
  ('amour-de-soi', 'up', 0, 'v1779962857/Amour_de_soi_10_ijnza6.webp', 'Roger Moniz'),
  ('amour-de-soi', 'up', 1, 'v1779962856/Amour_de_soi_9_wr4i7i.webp', 'Roger Moniz'),
  ('amour-de-soi', 'up', 2, 'v1779962865/OPPLR_2026_Marion_10_gww0li.webp', 'Roger Moniz'),
  ('amour-de-soi', 'up', 3, 'v1779962858/Amour_de_soi_12_c7uwaw.webp', 'Roger Moniz'),
  ('amour-de-soi', 'down', 0, 'v1779962856/Amour_de_soi_6_qun48b.webp', 'Roger Moniz'),
  ('amour-de-soi', 'down', 1, 'v1779962858/Amour_de_soi_11_z8vk5o.webp', 'Roger Moniz'),
  ('amour-de-soi', 'down', 2, 'v1779962860/Amour_de_soi_16_fuqakv.webp', 'Roger Moniz'),
  ('amour-de-soi', 'down', 3, 'v1779962863/OPPLR_2026_Julie_7_trljxv.webp', 'Roger Moniz'),
  ('amour-de-soi', 'up-slow', 0, 'v1779962856/Amour_de_soi_7_hwr1ar.webp', 'Roger Moniz'),
  ('amour-de-soi', 'up-slow', 1, 'v1779962855/Amour_de_soi_3_c25dv1.webp', 'Roger Moniz'),
  ('amour-de-soi', 'up-slow', 2, 'v1779962861/OPPLR_2026_Emilie_7_hrccsd.webp', 'Roger Moniz'),
  ('amour-de-soi', 'up-slow', 3, 'v1779962855/Amour_de_soi_2_qdw9cg.webp', 'Roger Moniz'),
  ('amour-de-soi', 'down-slow', 0, 'v1779962860/OPPLR_2026_Emilie_1_m5auxg.webp', 'Roger Moniz'),
  ('amour-de-soi', 'down-slow', 1, 'v1779962859/Amour_de_soi_14_n3bg9c.webp', 'Roger Moniz'),
  ('amour-de-soi', 'down-slow', 2, 'v1779962863/OPPLR_2026_Julie_2_wev8ty.webp', 'Roger Moniz'),
  ('amour-de-soi', 'down-slow', 3, 'v1779962864/OPPLR_2026_Marion_7_wmt1q9.webp', 'Roger Moniz'),
  ('fantaisie', 'up', 0, 'v1779962891/Fantaisie_18_mrob4s.webp', 'Roger Moniz'),
  ('fantaisie', 'up', 1, 'v1779962888/Fantaisie_12_sbevtn.webp', 'Roger Moniz'),
  ('fantaisie', 'up', 2, 'v1779962887/Fantaisie_10_axwvax.webp', 'Roger Moniz'),
  ('fantaisie', 'up', 3, 'v1779962884/Fantaisie_5_kibbfg.webp', 'Roger Moniz'),
  ('fantaisie', 'down', 0, 'v1779962891/Fantaisie_19_xcpaou.webp', 'Roger Moniz'),
  ('fantaisie', 'down', 1, 'v1779962888/Fantaisie_13_eceppy.webp', 'Roger Moniz'),
  ('fantaisie', 'down', 2, 'v1779962882/Fantaisie_1_dvfldv.webp', 'Roger Moniz'),
  ('fantaisie', 'down', 3, 'v1779962884/Fantaisie_4_arf7s1.webp', 'Roger Moniz'),
  ('fantaisie', 'up-slow', 0, 'v1779962883/Fantaisie_3_jol6cr.webp', 'Roger Moniz'),
  ('fantaisie', 'up-slow', 1, 'v1779962885/Fantaisie_7_y76mvn.webp', 'Roger Moniz'),
  ('fantaisie', 'up-slow', 2, 'v1779962889/Fantaisie_15_xsl6rh.webp', 'Roger Moniz'),
  ('fantaisie', 'up-slow', 3, 'v1779962892/Fantaisie_21_abq3xn.webp', 'Roger Moniz'),
  ('fantaisie', 'down-slow', 0, 'v1779962887/Fantaisie_10_axwvax.webp', 'Roger Moniz'),
  ('fantaisie', 'down-slow', 1, 'v1779962884/Fantaisie_6_jjmhdh.webp', 'Roger Moniz'),
  ('fantaisie', 'down-slow', 2, 'v1779962890/Fantaisie_17_kwjvgl.webp', 'Roger Moniz'),
  ('fantaisie', 'down-slow', 3, 'v1779962892/Fantaisie_20_d4p7y7.webp', 'Roger Moniz'),
  ('corporate', 'up', 0, 'v1784666956/Chlo%C3%A9_Organiz_Om-4_ogtjqp.webp', 'Roger Moniz'),
  ('corporate', 'up', 1, 'v1779963269/Portrait_31_tnfsqm.webp', 'Roger Moniz'),
  ('corporate', 'up', 2, 'v1784666957/Chlo%C3%A9_Organiz_Om-12_ojuq4i.webp', 'Roger Moniz'),
  ('corporate', 'up', 3, 'v1779963267/Portrait_29_zpqldx.webp', 'Roger Moniz'),
  ('corporate', 'down', 0, 'v1779963265/Portrait_28_yxuyjh.webp', 'Roger Moniz'),
  ('corporate', 'down', 1, 'v1784666955/Chlo%C3%A9_Organiz_Om_gaayhx.webp', 'Roger Moniz'),
  ('corporate', 'down', 2, 'v1779963263/Portrait_26_raxrj7.webp', 'Roger Moniz'),
  ('corporate', 'down', 3, 'v1784666958/Chlo%C3%A9_Organiz_Om-15_ml03g6.webp', 'Roger Moniz'),
  ('corporate', 'up-slow', 0, 'v1784666955/Chlo%C3%A9_Organiz_Om_gaayhx.webp', 'Roger Moniz'),
  ('corporate', 'up-slow', 1, 'v1779963270/Portrait_32_zhvstd.webp', 'Roger Moniz'),
  ('corporate', 'up-slow', 2, 'v1784666956/Chlo%C3%A9_Organiz_Om-2_ltlgg4.webp', 'Roger Moniz'),
  ('corporate', 'up-slow', 3, 'v1779963268/Portrait_30_trhbsa.webp', 'Roger Moniz'),
  ('corporate', 'down-slow', 0, 'v1784666956/Chlo%C3%A9_Organiz_Om-4_ogtjqp.webp', 'Roger Moniz'),
  ('corporate', 'down-slow', 1, 'v1779963265/Portrait_28_yxuyjh.webp', 'Roger Moniz'),
  ('corporate', 'down-slow', 2, 'v1784666959/Chlo%C3%A9_Organiz_Om-20_oudy35.webp', 'Roger Moniz'),
  ('corporate', 'down-slow', 3, 'v1779963263/Portrait_26_raxrj7.webp', 'Roger Moniz'),
  ('grossesse', 'up', 0, 'v1781177283/Cécile_grossesse-16_vwopq9.webp', 'Roger Moniz'),
  ('grossesse', 'up', 1, 'v1781177282/Amélie_Grossesse-14_cqrmep.webp', 'Roger Moniz'),
  ('grossesse', 'up', 2, 'v1781177281/Amélie_Grossesse-17_fjftlo.webp', 'Roger Moniz'),
  ('grossesse', 'up', 3, 'v1779963362/Grossesse_12_g09bk1.webp', 'Roger Moniz'),
  ('grossesse', 'down', 0, 'v1781177283/Cécile_grossesse-13_miguco.webp', 'Roger Moniz'),
  ('grossesse', 'down', 1, 'v1779963351/Grossesse_5_j37drb.webp', 'Roger Moniz'),
  ('grossesse', 'down', 2, 'v1779963355/Grossesse_8_boag72.webp', 'Roger Moniz'),
  ('grossesse', 'down', 3, 'v1781177282/Cécile_grossesse-10_euhrjg.webp', 'Roger Moniz'),
  ('grossesse', 'up-slow', 0, 'v1781177281/Amélie_Grossesse-10_ouqzol.webp', 'Roger Moniz'),
  ('grossesse', 'up-slow', 1, 'v1781177280/Amélie_Grossesse-7_atv7p6.webp', 'Roger Moniz'),
  ('grossesse', 'up-slow', 2, 'v1781177280/Cécile_grossesse-17_o5egqu.webp', 'Roger Moniz'),
  ('grossesse', 'up-slow', 3, 'v1779963360/Grossesse_11_hhxgws.webp', 'Roger Moniz'),
  ('grossesse', 'down-slow', 0, 'v1779963350/Grossesse_4_dfqvbf.webp', 'Roger Moniz'),
  ('grossesse', 'down-slow', 1, 'v1779963348/Grossesse_3_xnu7ne.webp', 'Roger Moniz'),
  ('grossesse', 'down-slow', 2, 'v1781177281/Amélie_Grossesse-6_djimkf.webp', 'Roger Moniz'),
  ('grossesse', 'down-slow', 3, 'v1781177283/Cécile_grossesse-16_vwopq9.webp', 'Roger Moniz'),
  ('in-the-box', 'up', 0, 'v1781795005/3_lgstcj.webp', 'Shooting in the box'),
  ('in-the-box', 'down', 0, 'v1781795005/1_azpjtw.webp', 'Shooting in the box'),
  ('in-the-box', 'up-slow', 0, 'v1781795005/2_yvdv6u.webp', 'Shooting in the box'),
  ('in-the-box', 'down-slow', 0, 'v1781795005/3_lgstcj.webp', 'Shooting in the box'),
  ('evenementiel', 'up', 0, 'v1781111042/Bégo_Sandy_Giulia_ra0siw.webp', 'Roger Moniz'),
  ('evenementiel', 'up', 1, 'v1779963332/Evenement_7_tyzdhd.webp', 'Roger Moniz'),
  ('evenementiel', 'up', 2, 'v1779963337/Evenement_10_vl12fw.webp', 'Roger Moniz'),
  ('evenementiel', 'up', 3, 'v1779963331/Evenement_6_xasjxb.webp', 'Roger Moniz'),
  ('evenementiel', 'down', 0, 'v1779963337/Evenement_10_vl12fw.webp', 'Roger Moniz'),
  ('evenementiel', 'down', 1, 'v1779963331/Evenement_6_xasjxb.webp', 'Roger Moniz'),
  ('evenementiel', 'down', 2, 'v1779963335/Evenement_9_bvelzp.webp', 'Roger Moniz'),
  ('evenementiel', 'down', 3, 'v1781512648/Soir%C3%A9e_entrepreneurs_28.05.26-7_riiemd.webp', 'Roger Moniz'),
  ('evenementiel', 'up-slow', 0, 'v1779963335/Evenement_9_bvelzp.webp', 'Roger Moniz'),
  ('evenementiel', 'up-slow', 1, 'v1779963329/Evenement_5_uvlf0l.webp', 'Roger Moniz'),
  ('evenementiel', 'up-slow', 2, 'v1779963334/Evenement_8_gjmdf9.webp', 'Roger Moniz'),
  ('evenementiel', 'up-slow', 3, 'v1781111042/Bégo_Sandy_Giulia_ra0siw.webp', 'Roger Moniz'),
  ('evenementiel', 'down-slow', 0, 'v1779963334/Evenement_8_gjmdf9.webp', 'Roger Moniz'),
  ('evenementiel', 'down-slow', 1, 'v1781111042/Bégo_Sandy_Giulia_ra0siw.webp', 'Roger Moniz'),
  ('evenementiel', 'down-slow', 2, 'v1779963332/Evenement_7_tyzdhd.webp', 'Roger Moniz'),
  ('evenementiel', 'down-slow', 3, 'v1779963337/Evenement_10_vl12fw.webp', 'Roger Moniz'),
  ('packshot', 'up', 0, 'v1781181746/Amour_Pastel_7_zpd9lh.webp', 'Roger Moniz'),
  ('packshot', 'up', 1, 'v1781181386/Amour_Pastel_10_yn5pdg.webp', 'Roger Moniz'),
  ('packshot', 'up', 2, 'v1781181347/Produits_-_Les_Fumades-15_yod3ac.webp', 'Roger Moniz'),
  ('packshot', 'up', 3, 'v1781181337/Amour_Pastel_16_bnncf9.webp', 'Roger Moniz'),
  ('packshot', 'down', 0, 'v1779963600/Amour_Pastel_6_errjbv.webp', 'Roger Moniz'),
  ('packshot', 'down', 1, 'v1781181386/Produits_-_Les_Fumades-9_zpp7fw.webp', 'Roger Moniz'),
  ('packshot', 'down', 2, 'v1781181346/Produits_-_Les_Fumades-14_zwe0mh.webp', 'Roger Moniz'),
  ('packshot', 'down', 3, 'v1779963425/Packshot_10_buts1e.webp', 'Roger Moniz'),
  ('packshot', 'up-slow', 0, 'v1781181437/Amour_Pastel_13_fmzllz.webp', 'Roger Moniz'),
  ('packshot', 'up-slow', 1, 'v1781181363/Produits_-_Les_Fumades-17_jtrhx9.webp', 'Roger Moniz'),
  ('packshot', 'up-slow', 2, 'v1781181344/Produits_-_Les_Fumades-13_qdnfxf.webp', 'Roger Moniz'),
  ('packshot', 'up-slow', 3, 'v1781181333/Produits_-_Les_Fumades-8_t8injd.webp', 'Roger Moniz'),
  ('packshot', 'down-slow', 0, 'v1781181391/Amour_Pastel_12_xnusnf.webp', 'Roger Moniz'),
  ('packshot', 'down-slow', 1, 'v1781181350/Produits_-_Les_Fumades-16_zrcrbn.webp', 'Roger Moniz'),
  ('packshot', 'down-slow', 2, 'v1781181340/Produits_-_Les_Fumades-12_fcjysb.webp', 'Roger Moniz'),
  ('packshot', 'down-slow', 3, 'v1781181327/Produits_-_Les_Fumades-7_fvloxs.webp', 'Roger Moniz'),
  ('cgv', 'up', 0, 'v1779962884/Fantaisie_5_kibbfg.webp', 'Roger Moniz'),
  ('cgv', 'up', 1, 'v1779963022/Portrait_17_okc6dd.webp', 'Roger Moniz'),
  ('cgv', 'up', 2, 'v1779962858/Amour_de_soi_12_c7uwaw.webp', 'Roger Moniz'),
  ('cgv', 'up', 3, 'v1781181289/Amour_Pastel_17_pumvur.webp', 'Roger Moniz'),
  ('cgv', 'down', 0, 'v1779963357/Grossesse_9_t918s7.webp', 'Roger Moniz'),
  ('cgv', 'down', 1, 'v1779962884/Fantaisie_4_arf7s1.webp', 'Roger Moniz'),
  ('cgv', 'down', 2, 'v1779963021/Portrait_16_qu6imy.webp', 'Roger Moniz'),
  ('cgv', 'down', 3, 'v1779962858/Amour_de_soi_11_z8vk5o.webp', 'Roger Moniz'),
  ('cgv', 'up-slow', 0, 'v1781181311/Amour_Pastel_20_jys6hu.webp', 'Roger Moniz'),
  ('cgv', 'up-slow', 1, 'v1779963355/Grossesse_8_boag72.webp', 'Roger Moniz'),
  ('cgv', 'up-slow', 2, 'v1779962883/Fantaisie_3_jol6cr.webp', 'Roger Moniz'),
  ('cgv', 'up-slow', 3, 'v1779963000/Portrait_15_okf9jk.webp', 'Roger Moniz'),
  ('cgv', 'down-slow', 0, 'v1779962858/Amour_de_soi_13_ojwulh.webp', 'Roger Moniz'),
  ('cgv', 'down-slow', 1, 'v1781181297/Amour_Pastel_19_gw0qhi.webp', 'Roger Moniz'),
  ('cgv', 'down-slow', 2, 'v1779963354/Grossesse_7_kf2vb4.webp', 'Roger Moniz'),
  ('cgv', 'down-slow', 3, 'v1779962882/Fantaisie_1_dvfldv.webp', 'Roger Moniz'),
  ('confidentialite', 'up', 0, 'v1781181276/Produits_-_Les_Fumades-32_vvvuv3.webp', 'Roger Moniz'),
  ('confidentialite', 'up', 1, 'v1779963351/Grossesse_5_j37drb.webp', 'Roger Moniz'),
  ('confidentialite', 'up', 2, 'v1779963350/Grossesse_4_dfqvbf.webp', 'Roger Moniz'),
  ('confidentialite', 'up', 3, 'v1779963348/Grossesse_3_xnu7ne.webp', 'Roger Moniz'),
  ('confidentialite', 'down', 0, 'v1779962857/Amour_de_soi_10_ijnza6.webp', 'Roger Moniz'),
  ('confidentialite', 'down', 1, 'v1781181255/Produits_-_Les_Fumades-25_kleh4x.webp', 'Roger Moniz'),
  ('confidentialite', 'down', 2, 'v1781181255/Amour_Pastel_5_rqv0bb.webp', 'Roger Moniz'),
  ('confidentialite', 'down', 3, 'v1781181245/Produits_-_Les_Fumades-31_xajbsm.webp', 'Roger Moniz'),
  ('confidentialite', 'up-slow', 0, 'v1779962999/Portrait_14_qnmsfw.webp', 'Roger Moniz'),
  ('confidentialite', 'up-slow', 1, 'v1779962856/Amour_de_soi_9_wr4i7i.webp', 'Roger Moniz'),
  ('confidentialite', 'up-slow', 2, 'v1779962856/Amour_de_soi_4_h8smse.webp', 'Roger Moniz'),
  ('confidentialite', 'up-slow', 3, 'v1779962856/Amour_de_soi_8_wwgluz.webp', 'Roger Moniz'),
  ('confidentialite', 'down-slow', 0, 'v1779962882/Fantaisie_2_eavcyy.webp', 'Roger Moniz'),
  ('confidentialite', 'down-slow', 1, 'v1779962965/Portrait_13_lhkevr.webp', 'Roger Moniz'),
  ('confidentialite', 'down-slow', 2, 'v1779962925/Portrait_12_x6w9tu.webp', 'Roger Moniz'),
  ('confidentialite', 'down-slow', 3, 'v1779962924/Portrait_11_chxpsa.webp', 'Roger Moniz'),
  ('mentions-legales', 'up', 0, 'v1781181243/Produits_-_Les_Fumades-30_dbsa7i.webp', 'Roger Moniz'),
  ('mentions-legales', 'up', 1, 'v1781181240/Amour_Pastel_3_ynjthu.webp', 'Roger Moniz'),
  ('mentions-legales', 'up', 2, 'v1779962856/Amour_de_soi_7_hwr1ar.webp', 'Roger Moniz'),
  ('mentions-legales', 'up', 3, 'v1779962922/Portrait_7_iqnsvx.webp', 'Roger Moniz'),
  ('mentions-legales', 'down', 0, 'v1779962856/Amour_de_soi_5_a7w08s.webp', 'Roger Moniz'),
  ('mentions-legales', 'down', 1, 'v1779962856/Amour_de_soi_6_qun48b.webp', 'Roger Moniz'),
  ('mentions-legales', 'down', 2, 'v1779962922/Portrait_8_wuaopt.webp', 'Roger Moniz'),
  ('mentions-legales', 'down', 3, 'v1781181059/Produits_-_Les_Fumades-20_yy5gz6.webp', 'Roger Moniz'),
  ('mentions-legales', 'up-slow', 0, 'v1779962924/Portrait_10_bjwrwl.webp', 'Roger Moniz'),
  ('mentions-legales', 'up-slow', 1, 'v1779962923/Portrait_9_yavopq.webp', 'Roger Moniz'),
  ('mentions-legales', 'up-slow', 2, 'v1781181216/Produits_-_Les_Fumades-22_lovqx5.webp', 'Roger Moniz'),
  ('mentions-legales', 'up-slow', 3, 'v1779962855/Amour_de_soi_2_qdw9cg.webp', 'Roger Moniz'),
  ('mentions-legales', 'down-slow', 0, 'v1779963345/Grossesse_1_ez6wt7.webp', 'Roger Moniz'),
  ('mentions-legales', 'down-slow', 1, 'v1781181237/Produits_-_Les_Fumades-24_xgif2o.webp', 'Roger Moniz'),
  ('mentions-legales', 'down-slow', 2, 'v1779962855/Amour_de_soi_3_c25dv1.webp', 'Roger Moniz'),
  ('mentions-legales', 'down-slow', 3, 'v1779962922/Portrait_2_fmywmr.webp', 'Roger Moniz'),
  ('contact', 'up', 0, 'v1779963165/Mylène-10_fwkk6x.webp', 'Roger Moniz'),
  ('contact', 'up', 1, 'v1779962862/OPPLR_2026_Julie_1_muroow.webp', 'Roger Moniz'),
  ('contact', 'up', 2, 'v1781181346/Produits_-_Les_Fumades-14_zwe0mh.webp', 'Roger Moniz'),
  ('contact', 'up', 3, 'v1781177281/Amélie_Grossesse-6_djimkf.webp', 'Roger Moniz'),
  ('contact', 'down', 0, 'v1779962889/Fantaisie_15_xsl6rh.webp', 'Roger Moniz'),
  ('contact', 'down', 1, 'v1779963164/Mylène-7_ffgl1b.webp', 'Roger Moniz'),
  ('contact', 'down', 2, 'v1779962862/OPPLR_2026_Emilie_10_yqlnk9.webp', 'Roger Moniz'),
  ('contact', 'down', 3, 'v1781181344/Produits_-_Les_Fumades-13_qdnfxf.webp', 'Roger Moniz'),
  ('contact', 'up-slow', 0, 'v1781177281/Amélie_Grossesse-10_ouqzol.webp', 'Roger Moniz'),
  ('contact', 'up-slow', 1, 'v1779962888/Fantaisie_14_hkqeew.webp', 'Roger Moniz'),
  ('contact', 'up-slow', 2, 'v1779963163/Mylène-3_wptzyi.webp', 'Roger Moniz'),
  ('contact', 'up-slow', 3, 'v1779962862/OPPLR_2026_Emilie_8_wy8qay.webp', 'Roger Moniz'),
  ('contact', 'down-slow', 0, 'v1781181347/Produits_-_Les_Fumades-15_yod3ac.webp', 'Roger Moniz'),
  ('contact', 'down-slow', 1, 'v1781177281/Amélie_Grossesse-5_sv1vwn.webp', 'Roger Moniz'),
  ('contact', 'down-slow', 2, 'v1779962888/Fantaisie_13_eceppy.webp', 'Roger Moniz'),
  ('contact', 'down-slow', 3, 'v1779963162/Mylène-2_beehdc.webp', 'Roger Moniz'),
  ('blog', 'up', 0, 'v1779963561/Blog_Octobre_Rose_8_rdzgmq.webp', 'Roger Moniz'),
  ('blog', 'up', 1, 'v1779963530/Blog_EHPAD_1_xa5i8j.webp', 'Roger Moniz'),
  ('blog', 'up', 2, 'v1779963548/Blog_Octobre_Rose_2_ecgh2b.webp', 'Roger Moniz'),
  ('blog', 'up', 3, 'v1779963540/Blog_EHPAD_6_x5fa0w.webp', 'Roger Moniz'),
  ('blog', 'down', 0, 'v1779963534/Blog_EHPAD_3_umlt8i.webp', 'Roger Moniz'),
  ('blog', 'down', 1, 'v1779963553/Blog_Octobre_Rose_4_cxfeg8.webp', 'Roger Moniz'),
  ('blog', 'down', 2, 'v1779963542/Blog_EHPAD_7_j2jkpu.webp', 'Roger Moniz'),
  ('blog', 'down', 3, 'v1779963546/Blog_Octobre_Rose_1_yu8ntv.webp', 'Roger Moniz'),
  ('blog', 'up-slow', 0, 'v1779963561/Blog_Octobre_Rose_8_rdzgmq.webp', 'Roger Moniz'),
  ('blog', 'up-slow', 1, 'v1779963530/Blog_EHPAD_1_xa5i8j.webp', 'Roger Moniz'),
  ('blog', 'up-slow', 2, 'v1779963548/Blog_Octobre_Rose_2_ecgh2b.webp', 'Roger Moniz'),
  ('blog', 'up-slow', 3, 'v1779963540/Blog_EHPAD_6_x5fa0w.webp', 'Roger Moniz'),
  ('blog', 'down-slow', 0, 'v1779963534/Blog_EHPAD_3_umlt8i.webp', 'Roger Moniz'),
  ('blog', 'down-slow', 1, 'v1779963553/Blog_Octobre_Rose_4_cxfeg8.webp', 'Roger Moniz'),
  ('blog', 'down-slow', 2, 'v1779963542/Blog_EHPAD_7_j2jkpu.webp', 'Roger Moniz'),
  ('blog', 'down-slow', 3, 'v1779963546/Blog_Octobre_Rose_1_yu8ntv.webp', 'Roger Moniz'),
  ('events', 'up', 0, 'v1779962864/OPPLR_2026_Marion_7_wmt1q9.webp', 'Roger Moniz'),
  ('events', 'up', 1, 'v1779962890/Fantaisie_17_kwjvgl.webp', 'Roger Moniz'),
  ('events', 'up', 2, 'v1781177281/Am%C3%A9lie_Grossesse-4_dvyafe.webp', 'Roger Moniz'),
  ('events', 'up', 3, 'v1779963021/Portrait_16_qu6imy.webp', 'Roger Moniz'),
  ('events', 'down', 0, 'v1779962856/Amour_de_soi_6_qun48b.webp', 'Roger Moniz'),
  ('events', 'down', 1, 'v1779962891/Fantaisie_19_xcpaou.webp', 'Roger Moniz'),
  ('events', 'down', 2, 'v1779963355/Grossesse_8_boag72.webp', 'Roger Moniz'),
  ('events', 'down', 3, 'v1779962862/OPPLR_2026_Emilie_8_wy8qay.webp', 'Roger Moniz'),
  ('events', 'up-slow', 0, 'v1779962856/Amour_de_soi_8_wwgluz.webp', 'Roger Moniz'),
  ('events', 'up-slow', 1, 'v1779963162/Myl%C3%A8ne-2_beehdc.webp', 'Roger Moniz'),
  ('events', 'up-slow', 2, 'v1779963267/Portrait_29_zpqldx.webp', 'Roger Moniz'),
  ('events', 'up-slow', 3, 'v1779962882/Fantaisie_2_eavcyy.webp', 'Roger Moniz'),
  ('events', 'down-slow', 0, 'v1781181386/Produits_-_Les_Fumades-9_zpp7fw.webp', 'Roger Moniz'),
  ('events', 'down-slow', 1, 'v1779962887/Fantaisie_11_i3lfas.webp', 'Roger Moniz'),
  ('events', 'down-slow', 2, 'v1779963360/Grossesse_11_hhxgws.webp', 'Roger Moniz'),
  ('events', 'down-slow', 3, 'v1779963329/Evenement_5_uvlf0l.webp', 'Roger Moniz'),
  ('carte-cadeau', 'up', 0, 'v1779962860/OPPLR_2026_Emilie_2_nvwapd.webp', 'Roger Moniz'),
  ('carte-cadeau', 'up', 1, 'v1781181327/Produits_-_Les_Fumades-7_fvloxs.webp', 'Roger Moniz'),
  ('carte-cadeau', 'up', 2, 'v1779963360/Grossesse_11_hhxgws.webp', 'Roger Moniz'),
  ('carte-cadeau', 'up', 3, 'v1779962884/Fantaisie_6_jjmhdh.webp', 'Roger Moniz'),
  ('carte-cadeau', 'down', 0, 'v1779963126/Portrait_21_rulxfk.webp', 'Roger Moniz'),
  ('carte-cadeau', 'down', 1, 'v1779962860/OPPLR_2026_Emilie_1_m5auxg.webp', 'Roger Moniz'),
  ('carte-cadeau', 'down', 2, 'v1781181319/Amour_Pastel_4_ob9o09.webp', 'Roger Moniz'),
  ('carte-cadeau', 'down', 3, 'v1779963359/Grossesse_10_qfucbv.webp', 'Roger Moniz'),
  ('carte-cadeau', 'up-slow', 0, 'v1779962886/Fantaisie_8_ngwsof.webp', 'Roger Moniz'),
  ('carte-cadeau', 'up-slow', 1, 'v1779963126/Portrait_20_tr9rqa.webp', 'Roger Moniz'),
  ('carte-cadeau', 'up-slow', 2, 'v1779962859/Amour_de_soi_15_avgjys.webp', 'Roger Moniz'),
  ('carte-cadeau', 'up-slow', 3, 'v1781181316/Amour_Pastel_11_jmcbjw.webp', 'Roger Moniz'),
  ('carte-cadeau', 'down-slow', 0, 'v1779963362/Grossesse_12_g09bk1.webp', 'Roger Moniz'),
  ('carte-cadeau', 'down-slow', 1, 'v1779962885/Fantaisie_7_y76mvn.webp', 'Roger Moniz'),
  ('carte-cadeau', 'down-slow', 2, 'v1779963125/Portrait_19_k3hgwj.webp', 'Roger Moniz'),
  ('carte-cadeau', 'down-slow', 3, 'v1779962859/Amour_de_soi_14_n3bg9c.webp', 'Roger Moniz');

insert into article_hero (page_slug, category, date_label, reading_time, title, image_path, image_alt, scroll_label, share_label) values
  ('blog/octobre-rose-2025', 'Prévention', '15 Octobre 2025', '3 min de lecture', 'Octobre Rose 2025', 'v1781600583/3Q5A9296-Modifier-2_shaiwm.webp', 'Octobre Rose — en parler, c''est déjà agir', 'Scroll', 'Partager'),
  ('blog/shooting-ehpad', 'Reportage', '16 Juin 2026', '4 min de lecture', 'Shooting en EHPAD', 'v1779963530/Blog_EHPAD_1_xa5i8j.webp', 'Shooting en EHPAD, portrait d''une résidente', 'Scroll', 'Partager'),
  ('blog/trois-lieux-magiques-a-nice', 'Conseils Pro', '8 Avril 2026', '5 min de lecture', 'Trois lieux magiques à Nice', 'v1779962889/Fantaisie_15_xsl6rh.webp', 'Shooting photo en extérieur à Nice', 'Scroll', 'Partager'),
  ('events/on-pose-pour-le-rose', 'Événement', '10 Octobre 2026', '3 min de lecture', 'On Pose pour le Rose', 'v1779962862/OPPLR_2026_Emilie_8_wy8qay.webp', 'On Pose pour le Rose 2026 : événement photo solidaire contre le cancer du sein', 'Scroll', 'Partager');

insert into about_hero (page_slug, eyebrow, title_lines, tag, lead, scroll_label) values
  ('a-propos', 'Photographe d''émotions', array['Roger', 'Moniz']::text[], 'Derrière l''objectif.', 'Photographe à Nice, je m’attache à révéler ce qui rend chaque personne unique, avec justesse, bienveillance et au plus près de l''émotion.', 'Défiler');

insert into about_hero_backgrounds (page_slug, theme, path, alt, focal) values
  ('a-propos', 'light', 'v1781110534/RogerHD-55_kiaxao.webp', 'Roger Moniz, photographe', '50% 18%'),
  ('a-propos', 'dark', 'v1781348488/varuu_vfteur.png', 'Roger Moniz, photographe', '50% 18%');

insert into section_headings (page_slug, section_key, eyebrow, title, subtitle) values
  ('index', 'welcome', 'Bienvenue', 'Créons ensemble', 'votre projet photographique.'),
  ('index', 'prestations', 'Ce que je propose', 'Prestations', 'Conçues pour vous sublimer'),
  ('index', 'reviews', 'Témoignages', 'Avis Clients', 'Promis ce sont des vrais'),
  ('index', 'faq', 'Faq', 'Des Questions ?', 'Voici mes réponses'),
  ('portrait', 'process', 'L''Expérience', 'Pour tous les moments', 'de la vie.'),
  ('portrait', 'pricing', 'Mes Tarifs', 'Votre histoire,', '3 formules.'),
  ('portrait', 'portfolio', 'Galerie', 'Plus de photos', 'Portrait'),
  ('amour-de-soi', 'process', 'L''Expérience', 'Une expérience', 'pensée pour vous.'),
  ('amour-de-soi', 'pricing', 'Mes Tarifs', 'Votre histoire,', '3 formules.'),
  ('amour-de-soi', 'portfolio', 'Archives', 'Plus de photos', 'Amour de soi'),
  ('fantaisie', 'process', 'L''Expérience', 'Un moment', 'hors du temps.'),
  ('fantaisie', 'pricing', 'Mes Tarifs', 'Votre histoire,', '3 formules.'),
  ('fantaisie', 'portfolio', 'Archives', 'Plus de photos', 'Fantaisie'),
  ('corporate', 'process', 'L''Expérience', 'Pensé pour votre', 'communication.'),
  ('corporate', 'pricing', 'Mes Tarifs', 'Votre histoire,', '3 formules.'),
  ('corporate', 'portfolio', 'Galerie', 'Plus de photos', 'Corporate'),
  ('grossesse', 'process', 'L''Expérience', 'S’offrir un souvenir,', 'avant que tout ne change.'),
  ('grossesse', 'pricing', 'Mes Tarifs', 'Votre histoire,', '3 formules.'),
  ('grossesse', 'portfolio', 'Archives', 'Plus de photos', 'Grossesse'),
  ('in-the-box', 'process', 'L''Expérience', 'Ce qui compte,', 'c''est l''énergie et le plaisir.'),
  ('in-the-box', 'pricing', 'Mes Tarifs', 'Votre histoire,', '4 formules.'),
  ('in-the-box', 'portfolio', 'Archives', 'Plus de photos', 'In The Box'),
  ('evenementiel', 'process', 'L''Expérience', 'Pour tous les moments', 'particuliers de votre vie.'),
  ('evenementiel', 'pricing', 'Mes Tarifs', 'Un moment', 'unique.'),
  ('evenementiel', 'portfolio', 'Archives', 'Plus de photos', 'Evenementiel'),
  ('packshot', 'process', 'L''Expérience', 'Investir dans vos images,', 'un véritable levier.'),
  ('packshot', 'pricing', 'Mes Tarifs', 'Une mise en valeur', 'unique.'),
  ('packshot', 'portfolio', 'Archives', 'Plus de photos', 'Packshot et Reportage'),
  ('contact', 'form', 'Envoyez un Message', 'Parlez-moi de', 'votre projet.'),
  ('contact', 'faq', 'Infos Réservations', 'Questions Fréquentes', 'Voici leurs réponses'),
  ('blog', 'featured', null, 'Le Journal', null),
  ('blog', 'filters', null, 'Explorer par thème', null),
  ('blog', 'articles', null, 'Tous les articles', null),
  ('events', 'featured', 'En ce moment', 'On pose pour le Rose', 'Édition 2026'),
  ('events', 'list', 'L''agenda', 'Tous les évènements', 'à venir & à revivre.'),
  ('events', 'faq', 'Infos Réservations', 'Questions Fréquentes', null),
  ('a-propos', 'story', 'Mon histoire', 'L''art dans la peau', null),
  ('a-propos', 'process', 'Ma façon de travailler', 'Ce qui guide', 'chaque séance.'),
  ('carte-cadeau', 'intro', 'L''Esprit du Cadeau', 'Offrez un moment,', 'pas un objet.'),
  ('carte-cadeau', 'faq', 'Infos Pratiques', 'Questions Fréquentes', null);

insert into faq_entries (page_slug, position, question, answer) values
  ('index', 0, 'Y a-t-il une limite de temps pour les séances ?', 'Non, je n’indique jamais de limite de temps car je ne me l’impose pas. L''objectif est de prendre le temps nécessaire pour que vous soyez à l''aise et que le résultat final réponde parfaitement à vos attentes.'),
  ('index', 1, 'Fournissez-vous les accessoires et les tenues ?', 'Oui, de nombreux accessoires sont mis à disposition et souvent réalisés sur-mesure (notamment pour les séances Fantaisie, Amour de soi et Grossesse). Bien entendu, vous êtes également libre d''apporter les vôtres.'),
  ('index', 2, 'Où se déroulent les shootings ?', 'Principalement en extérieur ou à votre domicile sur Nice et ses alentours. Des prestations comme “Amour de soi” se font exclusivement en intérieur.'),
  ('contact', 0, 'Combien de temps à l''avance dois-je réserver ?', 'Je vous recommande de réserver une séance environ un mois à l''avance. Il se peut que des créneaux soient disponibles rapidement mais ce n''est pas toujours le cas.'),
  ('contact', 1, 'Comment valider ma réservation ?', 'Une fois les détails de votre projet confirmés par email ou téléphone, la réservation n''est définitive qu''à réception d''un acompte de 30% de la formule choisie.'),
  ('contact', 2, 'Puis-je organiser un appel avant de réserver ?', 'Absolument. Un appel téléphonique est un très bon premier contact pour comprendre votre vision, vos attentes et s''assurer que ma direction artistique correspond parfaitement à vos besoins.'),
  ('events', 0, 'Comment fonctionne une "Mini-Session" saisonnière ?', 'Contrairement aux shootings standards, les mini-sessions se déroulent sur des journées spécifiques avec un décor ou thème prédéfini. Les séances sont plus courtes et offrent un tarif avantageux. Les créneaux s''enchaînent, la ponctualité est donc primordiale.'),
  ('carte-cadeau', 0, 'Quelle est la durée de validité de la carte cadeau ?', 'Toutes les cartes cadeaux ont une durée de validité stricte de 12 mois à compter de la date d''achat. Le destinataire devra réserver et effectuer sa séance avant la date d''expiration.'),
  ('carte-cadeau', 1, 'Comment le destinataire prend-il rendez-vous ?', 'La carte cadeau contient mes coordonnées directes. Le destinataire peut me contacter à tout moment, en mentionnant son nom, prénom et le numéro de la carte cadeau, pour planifier sa session et discuter de la direction artistique.'),
  ('carte-cadeau', 2, 'Le destinataire peut-il "upgrader" (améliorer) son forfait plus tard ?', 'Oui, tout à fait. Si vous offrez la carte cadeau "Découverte", le destinataire peut décider de passer à un forfait supérieur au moment de la réservation. Il ne règlera que la différence.'),
  ('carte-cadeau', 3, 'Et si le montant de la carte cadeau dépasse celui des prestations ?', 'Dans ce cas précis, des photos supplémentaires et retouchées vous seront livrées ou un avoir vous sera créé pour une prochaine séance à réaliser dans les 6 mois suivant le shooting.'),
  ('carte-cadeau', 4, 'Puis-je envoyer la carte cadeau physique directement à son adresse ?', 'Oui, tout à fait. Lors du remplissage du formulaire, merci de renseigner l''adresse du destinataire et de rajouter dans les commentaires que la carte lui sera directement délivrée.');

insert into cta_blocks (page_slug, title, subtitle) values
  ('amour-de-soi', 'Pour celles et ceux', 'qui ressentent l''appel.'),
  ('fantaisie', 'Une expérience artistique', 'hors du quotidien.'),
  ('grossesse', 'Un jour, vous reviendrez', 'sur ces images, cet instant.'),
  ('in-the-box', 'Si ces mots', 'résonnent en vous...'),
  ('evenementiel', 'Une séance vous intéresse ?', 'Besoin d’informations ?'),
  ('packshot', 'Si ces mots', 'résonnent en vous...'),
  ('blog/octobre-rose-2025', 'Envie d''aller plus loin ?', null),
  ('blog/shooting-ehpad', 'Envie d''aller plus loin ?', null),
  ('events/on-pose-pour-le-rose', 'Envie d''aller plus loin ?', null);

insert into cta_lead_paragraphs (page_slug, position, body) values
  ('amour-de-soi', 0, 'Cette séance s’adresse à vous si vous traversez une transformation, si vous avez besoin de vous réapproprier votre image ou si vous sentez que vous avez changé et que vous souhaitez honorer cette version de vous. Mais elle s’adresse aussi à vous si aucune “raison particulière” ne justifie ce moment. Parce qu’il n’y a pas besoin d’événement pour se choisir.'),
  ('amour-de-soi', 1, 'Vous repartirez avec un souvenir différent. Le souvenir d’un instant où vous vous êtes vu avec plus de douceur. Si ces mots résonnent en vous, c’est peut-être que cette expérience vous appelle déjà. Et je serai ravi de vous accompagner.'),
  ('fantaisie', 0, 'Elle s’adresse à vous si vous aimez les univers mythologiques, féeriques, gothiques... Si vous avez toujours rêvé d’incarner une version différente de vous-même tout en vivant une expérience artistique. Ce n’est pas une séance “classique”. C’est une transformation.'),
  ('fantaisie', 1, 'Si ces mots résonnent en vous, c’est peut-être que cette expérience vous appelle déjà. Et je serai ravi de vous accompagner.'),
  ('grossesse', 0, 'Peut-être débordée, sûrement fatiguée ou peut-être même dans une toute autre phase de votre vie. Mais vous vous direz: « C’était moi. C’était nous. C’était le début. » Et ces images auront une valeur que vous ne pouvez pas encore imaginer.'),
  ('grossesse', 1, 'Si ces mots résonnent en vous, c’est peut-être que cette expérience vous appelle déjà. Et je serai ravi de vous accompagner.'),
  ('in-the-box', 0, '...c’est peut-être que cette expérience vous appelle déjà. Et je serai ravi de vous accompagner.'),
  ('packshot', 0, '...c’est peut-être que cette expérience vous appelle déjà. Et je serai ravi de vous accompagner.'),
  ('blog/octobre-rose-2025', 0, 'Discutons de votre projet, ou offrez une expérience photographique unique à celles et ceux qui vous sont chers.'),
  ('blog/shooting-ehpad', 0, 'Discutons de votre projet, ou offrez une expérience photographique unique à celles et ceux qui vous sont chers.'),
  ('events/on-pose-pour-le-rose', 0, 'Discutons de votre projet, ou offrez une expérience photographique unique à celles et ceux qui vous sont chers.');

insert into cta_links (page_slug, position, href, label, variant) values
  ('index', 0, '/contact', 'Contactez-moi', 'outline'),
  ('portrait', 0, '/contact', 'Me contacter', 'outline'),
  ('portrait', 1, '/carte-cadeau', 'Offrir une séance', 'solid'),
  ('amour-de-soi', 0, '/contact', 'Me contacter', 'outline'),
  ('amour-de-soi', 1, '/carte-cadeau', 'Offrir une séance', 'solid'),
  ('fantaisie', 0, '/contact', 'Me contacter', 'outline'),
  ('fantaisie', 1, '/carte-cadeau', 'Offrir une séance', 'solid'),
  ('corporate', 0, '/contact', 'Me contacter', 'outline'),
  ('corporate', 1, '/carte-cadeau', 'Offrir une séance', 'solid'),
  ('grossesse', 0, '/contact', 'Me contacter', 'outline'),
  ('grossesse', 1, '/carte-cadeau', 'Offrir une séance', 'solid'),
  ('in-the-box', 0, '/contact', 'Me contacter', 'outline'),
  ('in-the-box', 1, '/carte-cadeau', 'Offrir une séance', 'solid'),
  ('evenementiel', 0, '/contact', 'Me contacter', 'outline'),
  ('evenementiel', 1, '/carte-cadeau', 'Offrir une séance', 'solid'),
  ('packshot', 0, '/contact', 'Me contacter', 'outline'),
  ('packshot', 1, '/carte-cadeau', 'Offrir une séance', 'solid'),
  ('blog/octobre-rose-2025', 0, '/contact', 'Me contacter', 'outline'),
  ('blog/octobre-rose-2025', 1, '/carte-cadeau', 'Offrir une séance', 'solid'),
  ('blog/shooting-ehpad', 0, '/contact', 'Me contacter', 'outline'),
  ('blog/shooting-ehpad', 1, '/carte-cadeau', 'Offrir une séance', 'solid'),
  ('events/on-pose-pour-le-rose', 0, '/contact', 'Me contacter', 'outline'),
  ('events/on-pose-pour-le-rose', 1, '/carte-cadeau', 'Offrir une séance', 'solid'),
  ('a-propos', 0, '/contact', 'Me contacter', 'outline'),
  ('a-propos', 1, '/carte-cadeau', 'Offrir une séance', 'solid');

insert into rich_sections (page_slug, anchor, variant, position, blocks) values
  ('blog/octobre-rose-2025', 'intro', 'or-intro', 0, '[{"type": "heading", "level": 2, "text": "Comprendre, pour mieux se protéger", "variant": "or-h2"}, {"type": "paragraph", "spans": ["Infirmier et photographe, j''ai voulu mettre l''image au service d''un message qui sauve des vies. Voici, en quelques chiffres et en gestes simples, l''essentiel à connaître sur le cancer du sein. Parce qu''en parler, c''est déjà agir."], "variant": null}]'::jsonb),
  ('blog/octobre-rose-2025', 'chiffres', null, 1, '[{"type": "heading", "level": 2, "text": "Les chiffres à connaître", "variant": "or-h2"}, {"type": "paragraph", "spans": ["Le cancer du sein est le plus fréquent chez la femme. Quelques repères simples pour comprendre l''enjeu — et pourquoi un dépistage précoce change tout."], "variant": "or-section-lead"}, {"type": "figureGroup", "variant": "or-stats", "figures": [{"type": "figure", "variant": "or-card", "path": "v1781600583/3Q5A9285-Modifier-Modifier-Modifier_ls2mvb.webp", "alt": "Octobre Rose — 1 femme sur 8 sera touchée par le cancer du sein", "caption": "1 femme sur 8 sera, un jour, touchée par le cancer du sein"}, {"type": "figure", "variant": "or-card", "path": "v1781600583/3Q5A9281-Modifier-Modifier-Modifier_wywfqd.webp", "alt": "Le cancer du sein, le plus répandu chez la femme", "caption": "C''est le cancer le plus répandu chez la femme"}, {"type": "figure", "variant": "or-card", "path": "v1781600583/3Q5A9309-Modifier-Modifier-Modifier-Modifier_xafxvf.webp", "alt": "L''âge moyen au diagnostic du cancer du sein est de 64 ans", "caption": "L''âge moyen au diagnostic est de 64 ans"}, {"type": "figure", "variant": "or-card", "path": "v1781600585/3Q5A9325-Modifier-Modifier-Modifier-Modifier_gt3isr.webp", "alt": "Dépisté tôt, le cancer du sein se guérit dans 9 cas sur 10", "caption": "Dépisté tôt, il se guérit dans 9 cas sur 10"}]}]'::jsonb),
  ('blog/octobre-rose-2025', 'palpation', null, 2, '[{"type": "heading", "level": 2, "text": "L''auto-palpation régulière est un geste simple qui peut sauver des vies", "variant": "or-h2 or-center"}, {"type": "paragraph", "spans": ["Quelques minutes, une fois par mois : voici comment l''examiner soi-même, étape par étape. À pratiquer de préférence après les règles."], "variant": "or-section-lead"}, {"type": "figureGroup", "variant": "or-steps", "figures": [{"type": "figure", "variant": "or-step", "path": "v1781600583/3Q5A9310-Modifier_jp6d2a.webp", "alt": "Étape 1 : regarder les seins devant le miroir, bras baissés", "caption": "Regarder les seins devant le miroir, bras baissés", "num": "1"}, {"type": "figure", "variant": "or-step", "path": "v1781600583/3Q5A9312-Modifier-Modifier_gio2r9.webp", "alt": "Étape 2 : puis devant le miroir, bras levés", "caption": "Puis devant le miroir, bras levés", "num": "2"}, {"type": "figure", "variant": "or-step", "path": "v1781600584/3Q5A9313-Modifier-Modifier_s9gbh9.webp", "alt": "Étape 3 : examiner les aisselles", "caption": "Examiner les aisselles", "num": "3"}, {"type": "figure", "variant": "or-step", "path": "v1781600584/3Q5A9314-Modifier_xcsqh1.webp", "alt": "Étape 4 : palper le sein de haut en bas", "caption": "Palper le sein de haut en bas", "num": "4"}, {"type": "figure", "variant": "or-step", "path": "v1781600584/3Q5A9315-Modifier_z2siow.webp", "alt": "Étape 5 : palper en faisant des cercles et des diagonales", "caption": "Palper en faisant des cercles et des diagonales", "num": "5"}, {"type": "figure", "variant": "or-step", "path": "v1781600584/3Q5A9316-Modifier_u4d6lt.webp", "alt": "Étape 6 : presser les tétons", "caption": "Presser les tétons", "num": "6"}, {"type": "figure", "variant": "or-step", "path": "v1781600585/3Q5A9318-Modifier-Modifier_ofp4jl.webp", "alt": "Étape 7 : recommencer les étapes en étant allongé(e)", "caption": "Recommencer les étapes en étant allongé(e)", "num": "7"}]}, {"type": "note", "blocks": [{"type": "paragraph", "spans": ["À réaliser de préférence juste après les règles, ou un jour fixe chaque mois. Le but : repérer rapidement tout changement — une masse, une modification de la forme du sein ou du mamelon, une douleur, ou encore un écoulement anormal."], "variant": null}, {"type": "paragraph", "spans": ["En cas de doute, consultez un médecin."], "variant": "or-note-strong"}]}]'::jsonb),
  ('blog/octobre-rose-2025', null, 'or-banner-duo', 3, '[{"type": "duo", "columns": [{"id": "homme", "variant": null, "blocks": [{"type": "figure", "variant": "or-banner", "path": "v1781600582/3Q5A9274-Modifier-Modifier_h4gnrx.webp", "alt": "Le cancer du sein chez l''homme est rare mais existe", "caption": "Le cancer du sein chez l''homme est rare, mais il existe", "captionSub": "moins de 1 % des cas"}, {"type": "paragraph", "spans": ["On l''oublie trop souvent : les hommes aussi peuvent être touchés. Toute grosseur, rougeur ou écoulement doit amener à consulter sans attendre."], "variant": "or-duo-lead"}]}, {"id": "agir", "variant": null, "blocks": [{"type": "figure", "variant": "or-banner", "path": "v1781600583/3Q5A9296-Modifier-2_shaiwm.webp", "alt": "Octobre Rose — en parler, c''est déjà agir", "caption": "Octobre RoseEn parler, c''est déjà agir"}, {"type": "paragraph", "spans": ["Octobre Rose nous rappelle l''essentiel : se faire dépister, soutenir un proche, partager l''information. Chaque conversation peut sauver une vie."], "variant": "or-duo-lead"}]}]}]'::jsonb),
  ('blog/shooting-ehpad', 'rencontre', null, 0, '[{"type": "heading", "level": 2, "text": "La rencontre", "variant": null}, {"type": "paragraph", "spans": ["Avant même d''installer les lumières, il y avait les regards, les gestes, la curiosité. Le temps de quelques portraits, l''appareil est devenu un prétexte à la rencontre : un moment de joie, de partage, souvent ponctué d''un fou rire ou d''un souvenir raconté avec tendresse."], "variant": null}, {"type": "paragraph", "spans": ["Ces séances, plus que de simples photos, sont des parenthèses de vie. Elles redonnent confiance, elles valorisent, elles disent :"], "variant": null}, {"type": "quote", "spans": ["\"Vous êtes là, vous comptez, vous êtes beau tel que vous êtes.\""]}, {"type": "figure", "variant": "article-img", "path": "v1779963542/Blog_EHPAD_7_j2jkpu.webp", "alt": "Portrait d''une résidente en EHPAD"}]'::jsonb),
  ('blog/shooting-ehpad', 'visages', null, 1, '[{"type": "heading", "level": 2, "text": "Des visages, des histoires", "variant": null}, {"type": "paragraph", "spans": ["Chaque portrait raconte une histoire : celle d''une femme coquette sous son grand chapeau, d''un homme ému devant son propre sourire, d''une vie remplie de souvenirs. Dans le regard, on lit à la fois la force du passé et la douceur du présent."], "variant": null}, {"type": "paragraph", "spans": ["C''est une manière d''honorer ces vies riches, d''immortaliser ces sourires qui méritent d''être transmis à leurs familles, leurs proches, leurs soignants."], "variant": null}, {"type": "paragraph", "spans": ["Dans cette bulle de confiance, les émotions circulaient librement : un mélange de rires, de pudeur et d''humanité vraie."], "variant": null}, {"type": "figure", "variant": "article-img", "path": "v1779963540/Blog_EHPAD_6_x5fa0w.webp", "alt": "Portrait d''un résident en EHPAD"}]'::jsonb),
  ('blog/shooting-ehpad', 'lien-social', null, 2, '[{"type": "heading", "level": 2, "text": "Quand la photo devient un lien social", "variant": null}, {"type": "paragraph", "spans": ["Dans un EHPAD, une séance photo n''est pas seulement un moment créatif : c''est aussi un moment d''humanité partagée. Le personnel s''arrête, les résidents s''entraident pour se préparer, tout le monde rit, commente, se découvre autrement."], "variant": null}, {"type": "paragraph", "spans": ["Ces instants résonnent bien au-delà de la séance : ils laissent une trace, un élan, une fierté."], "variant": null}, {"type": "figure", "variant": "article-img", "path": "v1779963534/Blog_EHPAD_3_umlt8i.webp", "alt": "Séance photo en EHPAD"}]'::jsonb),
  ('blog/shooting-ehpad', 'sens', null, 3, '[{"type": "heading", "level": 2, "text": "Un acte d''amour et de reconnaissance", "variant": null}, {"type": "paragraph", "spans": ["Photographier en EHPAD, c''est bien plus qu''un projet artistique : c''est un acte d''amour et de reconnaissance. C''est rappeler que chaque visage mérite d''être célébré, quel que soit l''âge, le corps, ou la mémoire."], "variant": null}, {"type": "paragraph", "spans": ["Et si la photographie peut apporter un peu de joie, un peu de lumière dans le quotidien de ceux qu''on oublie parfois, alors elle trouve ici tout son sens."], "variant": null}, {"type": "figure", "variant": "article-img", "path": "v1779963538/Blog_EHPAD_5_fgm7jh.webp", "alt": "Portrait lumineux d''une résidente en EHPAD"}, {"type": "paragraph", "spans": [{"bold": true, "text": "Mon projet vous a plu ?"}, " Vous représentez un EHPAD, une structure d''accueil, une association ou un établissement social ? Je serais ravi de collaborer avec vous pour créer des projets photo humains et bienveillants, qui redonnent confiance et visibilité à tous les publics oubliés : personnes âgées, en situation de handicap, isolées ou fragilisées."], "variant": null}, {"type": "paragraph", "spans": ["Écrivons ensemble la prochaine histoire en images."], "variant": null}]'::jsonb),
  ('blog/trois-lieux-magiques-a-nice', 'intro', null, 0, '[{"type": "heading", "level": 2, "text": "Trois décors, trois émotions", "variant": null}, {"type": "paragraph", "spans": ["Nice regorge de coins où la lumière, la nature et la mer se rencontrent pour créer des décors uniques."], "variant": null}, {"type": "paragraph", "spans": ["En tant que photographe portraitiste à Nice, j''aime emmener mes modèles dans ces lieux où le temps ralentit, où chaque souffle de vent et chaque rayon de soleil participent à la photo."], "variant": null}, {"type": "paragraph", "spans": ["Que ce soit pour un portrait personnel, une séance en couple, en famille ou simplement pour le plaisir de s''offrir un moment à soi, ces endroits offrent une atmosphère à la fois naturelle et inspirante."], "variant": null}, {"type": "paragraph", "spans": ["Voici trois de mes lieux favoris pour des séances photo pleines de charme et de poésie."], "variant": null}]'::jsonb),
  ('blog/trois-lieux-magiques-a-nice', 'cimiez', null, 1, '[{"type": "heading", "level": 2, "text": "Sous les oliviers de Cimiez", "variant": null}, {"type": "paragraph", "spans": ["Sous les oliviers de Cimiez, le temps semble ralentir."], "variant": null}, {"type": "paragraph", "spans": ["La lumière se faufile entre les branches et caresse doucement les visages, parfaite pour des portraits de famille naturels et lumineux. C''est un lieu apaisant, baigné d''une atmosphère méditerranéenne, où les rires résonnent entre les troncs centenaires. J''aime y photographier les familles dans cette lumière dorée de fin de journée, celle qui enveloppe tout d''une chaleur douce et intemporelle."], "variant": null}, {"type": "paragraph", "spans": ["À quelques pas, le jardin des fleurs déploie ses couleurs : rosiers et massifs en fleur offrent un décor poétique et joyeux. Les enfants s''émerveillent, les parents se promènent, et tout devient prétexte à un sourire sincère."], "variant": null}, {"type": "paragraph", "spans": ["C''est un lieu qui invite à la simplicité et à la tendresse, un cadre idéal pour une séance photo en famille à Nice, où nature et émotion s''unissent dans un même éclat."], "variant": null}, {"type": "figureGroup", "variant": "article-img-grid", "figures": [{"type": "figure", "variant": "plain", "path": "v1779962999/Portrait_14_qnmsfw.webp", "alt": "Séance photo famille sous les oliviers de Cimiez : une lumière dorée et des rires partagés"}, {"type": "figure", "variant": "plain", "path": "v1779963000/Portrait_15_okf9jk.webp", "alt": "Portrait en famille sous les oliviers de Cimiez à Nice"}, {"type": "figure", "variant": "plain", "path": "v1779962922/Portrait_2_fmywmr.webp", "alt": "Portrait naturel dans la lumière dorée de Cimiez"}, {"type": "figure", "variant": "plain", "path": "v1779962965/Portrait_13_lhkevr.webp", "alt": "Séance photo tendresse entre les oliviers centenaires de Cimiez"}]}]'::jsonb),
  ('blog/trois-lieux-magiques-a-nice', 'promenade', null, 2, '[{"type": "heading", "level": 2, "text": "Les rochers de la Promenade", "variant": null}, {"type": "paragraph", "spans": ["Sur la partie Est de la Promenade, là où les galets cèdent la place aux rochers du port, Nice révèle un visage plus sauvage et authentique. Ici, la mer s''écrase doucement sur la pierre, la lumière rebondit sur l''eau, et chaque instant semble suspendu entre force et douceur."], "variant": null}, {"type": "paragraph", "spans": ["C''est un lieu que j''aime particulièrement pour les portraits intimistes et contemplatifs."], "variant": null}, {"type": "paragraph", "spans": ["Les textures minérales des rochers contrastent avec la fluidité de la mer, créant un décor brut et lumineux, idéal pour exprimer la personnalité et les émotions. La lumière s''étire sur l''horizon, enveloppe les silhouettes d''un éclat doré et fait scintiller les embruns."], "variant": null}, {"type": "quote", "spans": ["\"Ici, on se sent libre.\""]}, {"type": "paragraph", "spans": ["On respire l''air salé, on écoute le murmure des vagues, on se laisse porter par le rythme calme de la Méditerranée. C''est un endroit où l''on se reconnecte à soi, où chaque regard vers la mer devient un instant d''introspection."], "variant": null}, {"type": "paragraph", "spans": ["Les rochers du port offrent une scène naturelle pour des portraits artistiques ou des séances photo de couple, entre lumière, matière et horizon. Un décor simple, mais d''une intensité rare, comme une rencontre entre la terre et la mer, entre soi et le monde."], "variant": null}, {"type": "figureGroup", "variant": "article-img-grid", "figures": [{"type": "figure", "variant": "plain", "path": "v1779962883/Fantaisie_3_jol6cr.webp", "alt": "Séance fantaisie au bord des rochers de Nice : lumière dorée et souffle marin"}, {"type": "figure", "variant": "plain", "path": "v1779962884/Fantaisie_4_arf7s1.webp", "alt": "Portrait intimiste sur les rochers de la Promenade à Nice"}, {"type": "figure", "variant": "plain", "path": "v1779962884/Fantaisie_5_kibbfg.webp", "alt": "Séance contemplative face à la mer sur les rochers de Nice"}, {"type": "figure", "variant": "plain", "path": "v1779962886/Fantaisie_8_ngwsof.webp", "alt": "Lumière dorée et souffle marin sur les rochers de la Promenade"}]}]'::jsonb),
  ('blog/trois-lieux-magiques-a-nice', 'vinaigrier', null, 3, '[{"type": "heading", "level": 2, "text": "Le Parc du Vinaigrier", "variant": null}, {"type": "paragraph", "spans": ["Perché sur les hauteurs de Nice, le Parc du Vinaigrier est une véritable parenthèse de nature. Loin du tumulte de la ville, il offre un décor sauvage et apaisant : forêt, herbes dorées, chemins bordés de pierres sèches et vue panoramique sur la Méditerranée."], "variant": null}, {"type": "paragraph", "spans": ["C''est un lieu que j''affectionne particulièrement pour sa lumière changeante et poétique, parfaite pour des portraits artistiques seul ou à plusieurs."], "variant": null}, {"type": "paragraph", "spans": ["J''aime y créer des séances photo bohèmes ou féeriques, avec des accessoires : une couronne de fleurs, des ailes de fée, une lanterne qui s''accordent à la beauté brute du lieu."], "variant": null}, {"type": "paragraph", "spans": ["Le Vinaigrier, c''est un peu le poumon vert de Nice, un lieu où la nature raconte ses propres histoires. Chaque photo y respire la liberté, la lumière et la tendresse."], "variant": null}, {"type": "paragraph", "spans": ["Un endroit idéal pour ceux qui rêvent d''un shooting photo fantaisie, au cœur d''une nature préservée et baignée de soleil."], "variant": null}, {"type": "figureGroup", "variant": "article-img-grid", "figures": [{"type": "figure", "variant": "plain", "path": "v1779962891/Fantaisie_19_xcpaou.webp", "alt": "Séance photo féérique au Parc du Vinaigrier : entre ciel, nature et fantaisie"}, {"type": "figure", "variant": "plain", "path": "v1779962890/Fantaisie_17_kwjvgl.webp", "alt": "Séance bohème au Parc du Vinaigrier à Nice"}, {"type": "figure", "variant": "plain", "path": "v1779962891/Fantaisie_18_mrob4s.webp", "alt": "Portrait artistique dans la nature du Parc du Vinaigrier"}, {"type": "figure", "variant": "plain", "path": "v1779962892/Fantaisie_20_d4p7y7.webp", "alt": "Lumière changeante et poétique au Parc du Vinaigrier"}]}, {"type": "paragraph", "spans": ["Chaque lieu à Nice raconte une histoire différente : Cimiez, avec sa douceur et ses oliviers, invite à la tendresse. Le Vinaigrier inspire la sérénité et la connexion à la nature. La Promenade, elle, reflète la puissance et la liberté de la mer."], "variant": null}, {"type": "paragraph", "spans": ["Ces décors me permettent de créer des portraits authentiques, lumineux et poétiques, en accord avec la personnalité de chacun. Car bien plus que le lieu, ce que j''aime capturer, c''est l''émotion vraie, celle qui traverse la lumière et reste dans le regard."], "variant": null}, {"type": "paragraph", "spans": [{"bold": true, "text": "Envie d''une séance photo à Nice ?"}, " Si ces lieux vous inspirent et que vous souhaitez vivre votre propre séance photo en extérieur, je serais ravi de vous accompagner."], "variant": null}, {"type": "paragraph", "spans": ["Que vous soyez seul(e), en couple ou simplement en quête d''un moment à vous, nous créerons ensemble des images naturelles, pleines de sens et de lumière."], "variant": null}]'::jsonb),
  ('events/on-pose-pour-le-rose', 'intro', null, 0, '[{"type": "heading", "level": 2, "text": "Un événement qui me tient à cœur", "variant": null}, {"type": "paragraph", "spans": ["En octobre 2026, j''aurai l''immense plaisir de participer à l''événement « On Pose pour le Rose », une initiative nationale qui rassemble chaque année des bénévoles autour d''une même mission : soutenir la lutte contre le cancer du sein grâce à la photographie et à divers ateliers."], "variant": null}, {"type": "paragraph", "spans": ["En tant qu''infirmier, je mesure chaque jour l''importance du dépistage précoce, de la prévention et de l''accompagnement des personnes touchées. En tant que photographe, je crois à la force des images pour faire passer un message et éveiller les consciences."], "variant": null}, {"type": "paragraph", "spans": ["Cet événement réunit ces deux engagements, le soin et l''image, le temps d''une journée placée sous le signe de la solidarité."], "variant": null}, {"type": "figure", "variant": "article-img", "path": "v1779962862/OPPLR_2026_Emilie_10_yqlnk9.webp", "alt": "On Pose pour le Rose 2026 : un événement solidaire contre le cancer du sein"}]'::jsonb),
  ('events/on-pose-pour-le-rose', 'solidarite', null, 1, '[{"type": "heading", "level": 2, "text": "Bien plus qu''une séance photo", "variant": null}, {"type": "paragraph", "spans": ["Ce que j''aime particulièrement dans cet événement, c''est qu''il va bien au-delà de la simple séance photo. C''est un moment de partage, de bienveillance et parfois même de reconstruction."], "variant": null}, {"type": "paragraph", "spans": ["Chaque participante vient vivre une expérience unique tout en contribuant à une cause essentielle. Devant l''objectif, les premiers instants de gêne laissent vite place aux sourires sincères et à une fierté retrouvée."], "variant": null}, {"type": "paragraph", "spans": ["L''ambiance de la journée est empreinte de rires, d''émotions et de douceur, dans un cadre pensé pour que chacune se sente accueillie et célébrée."], "variant": null}, {"type": "figure", "variant": "article-img", "path": "v1779962863/OPPLR_2026_Julie_2_wev8ty.webp", "alt": "Une participante prend la pose lors de l''événement On Pose pour le Rose"}]'::jsonb),
  ('events/on-pose-pour-le-rose', 'force', null, 2, '[{"type": "heading", "level": 2, "text": "Une journée pour soutenir la cause", "variant": null}, {"type": "paragraph", "spans": ["L''édition 2026 se tiendra le ", {"bold": true, "text": "10 octobre 2026"}, ", sur réservation, à l''Hôtel « L''Abbaye » à Colle-sur-Loup, un cadre d''exception pour une journée pas comme les autres."], "variant": null}, {"type": "paragraph", "spans": ["Au programme : des séances photo, des ateliers et beaucoup de bonne humeur. Une part des participations est reversée au profit de la lutte contre le cancer du sein."], "variant": null}, {"type": "quote", "spans": ["\"Chaque participante repart avec ses images, et la fierté d''avoir contribué, à sa manière, à une cause qui nous concerne toutes et tous.\""]}, {"type": "figure", "variant": "article-img", "path": "v1779962865/OPPLR_2026_Marion_9_uanmfj.webp", "alt": "Journée solidaire On Pose pour le Rose à Colle-sur-Loup"}]'::jsonb),
  ('events/on-pose-pour-le-rose', 'sensibiliser', null, 3, '[{"type": "heading", "level": 2, "text": "Participer à l''édition 2026", "variant": null}, {"type": "paragraph", "spans": ["Vous souhaitez vivre cette expérience, seule, entre amies, en famille ou pour soutenir un proche ? Les places se réservent à l''avance, dans la limite des créneaux disponibles."], "variant": null}, {"type": "paragraph", "spans": ["Que vous veniez pour la photo, pour les ateliers ou simplement pour faire un geste, votre présence compte. C''est ensemble que cette journée prend tout son sens."], "variant": null}, {"type": "figure", "variant": "article-img", "path": "v1781521442/OPPLR_2026_Magali_3_hnl9jm.webp", "alt": "On Pose pour le Rose 2026 : un message de solidarité et d''espoir"}, {"type": "paragraph", "spans": [{"bold": true, "text": "Envie de participer ?"}, " Réservez votre place pour l''édition 2026 d''« On Pose pour le Rose » et venez partager un moment de solidarité, de beauté et de bonne humeur. Je serai ravi de vous accueillir devant mon objectif."], "variant": null}, {"type": "paragraph", "spans": ["Écrivons ensemble cette belle histoire en images."], "variant": null}]'::jsonb),
  ('cgv', 'objet', null, 0, '[{"type": "heading", "level": 2, "text": "1. Objet", "variant": null}, {"type": "paragraph", "spans": ["Les conditions générales de vente (ci-après nommées « CGV ») créent un accord légal et s’appliquent à toutes les commandes de prestations et de produits conclues entre le Client (ci-après nommé « le client ») et moi, Moniz Roger, photographe. Toute réservation de séance ou commande de produits entraîne l’entière adhésion aux présentes CGV, sauf conditions particulières consenties par écrit entre le client et moi. Adresse du siège social : 15 rue de Roquebilliere 06300 Nice."], "variant": null}]'::jsonb),
  ('cgv', 'tarifs', null, 1, '[{"type": "heading", "level": 2, "text": "2. Tarifs", "variant": null}, {"type": "paragraph", "spans": ["Les prix de vente exprimés en euros sont ceux applicables au moment de la réservation d’une séance ou de la commande de produits complémentaires. Les tarifs sont sujets à changements à n’importe quel moment et ce sans préavis. Le prix valable est celui indiqué sur votre contrat et/ou votre bon de commande."], "variant": null}]'::jsonb),
  ('cgv', 'reservation', null, 2, '[{"type": "heading", "level": 2, "text": "3. Réservation d’une séance, commande de produits complémentaires et délai de rétractation", "variant": null}, {"type": "paragraph", "spans": ["Le versement d’un acompte de 30% du tarif signe un engagement ferme de la part du client et entraîne l’entière adhésion aux présentes CGV. La réservation n’est définitive qu’à réception du règlement de ce versement. A défaut de réception du règlement dans les 7 jours suivant mon accord pour la date et l’heure convenues avec le client, la réservation sera purement et simplement annulée et ce sans préavis et sans que le client ne puisse réclamer la moindre indemnité. Le paiement s’effectue par chèque (à l’ordre de Moniz Roger), espèce ou virement bancaire."], "variant": null}, {"type": "paragraph", "spans": ["Conformément à la loi, le client dispose d’un délai de rétractation de 7 jours ouvrables à compter du lendemain de la réservation de la séance. Passé ce délai, aucune somme déjà versée ne lui sera remboursée en cas d’annulation de sa part, et ce quel que soit le motif."], "variant": null}, {"type": "paragraph", "spans": ["Le montant total des produits complémentaires est à payer en intégralité le jour de la commande. Conformément à l’article 121-20-2 du Code de la Consommation, le droit de rétractation ne pourra être exercé pour ces produits, considérés comme étant nettement personnalisés."], "variant": null}, {"type": "paragraph", "spans": ["En cas de chèque sans provision, le client sera averti par mes soins et disposera d’un délai de 72h pour régler la prestation en espèces. Dans le cas où cet incident engendrerait des frais à mon encontre, le client s’engage à me les rembourser."], "variant": null}]'::jsonb),
  ('cgv', 'annulation', null, 3, '[{"type": "heading", "level": 2, "text": "4. Report ou annulation", "variant": null}, {"type": "paragraph", "spans": ["Si je ne peux honorer le contrat pour cas de force majeure, je proposerai dans la mesure du possible une date de remplacement ; dans le cas où aucun accord n’est trouvé, les frais de prise de vues seront remboursés intégralement au client, et ce, sans donner lieu au versement de dommages et intérêts à quelque titre que ce soit. Est considéré comme force majeure un événement extérieur imprévisible et rendant impossible l’exécution de la prestation (accident, décès, maladie, problème familial…). Chacune des parties pourra opposer ce droit dès lors où la force majeure est caractérisée."], "variant": null}, {"type": "paragraph", "spans": ["Le client comme moi-même nous engageons à prévenir l’autre partie dans les plus brefs délais par téléphone ou mail. D’un commun accord, une nouvelle date sera planifiée, sans aucun frais supplémentaire à prestation identique."], "variant": null}, {"type": "paragraph", "spans": ["Toute demande de modification (date, heure, lieu) par le client devra être effectuée au plus tard 7 jours avant la date prévue de la séance, sauf cas de force majeure. En cas de report, je ne pourrai pas être tenu responsable de la non-réalisation de certaines particularités de séance (saison, météo, cadre de prise de vue…). En cas d’annulation de la séance par le client, l’acompte ne lui sera pas remboursé ; il couvre forfaitairement les frais de préparation de votre séance et le manque à gagner d’une prestation photographique perdue. La loi prévoit que le solde me soit réglé."], "variant": null}]'::jsonb),
  ('cgv', 'deroulement', null, 4, '[{"type": "heading", "level": 2, "text": "5. Déroulement d’une séance", "variant": null}, {"type": "paragraph", "spans": ["Le client s’engage à être à l’heure au rendez-vous fixé pour la séance. Le client s’engage à faciliter mon travail lors de l’exécution de la prestation. Il est formellement interdit au client de prendre des photos avec un appareil photo, téléphone mobile ou autre durant la séance."], "variant": null}, {"type": "paragraph", "spans": ["Je ne pourrai pas être tenu responsable d’une moindre qualité des photos en cas de manque de coopération d’un des participants de la séance."], "variant": null}, {"type": "paragraph", "spans": ["Le règlement total de la prestation sera payé soit avant la séance, soit au tout début de celle-ci, avant la prise de photo."], "variant": null}]'::jsonb),
  ('cgv', 'probleme', null, 5, '[{"type": "heading", "level": 2, "text": "6. Problème technique", "variant": null}, {"type": "paragraph", "spans": ["En cas de problème technique avec le matériel photographique ou d’un accident quelconque pendant la prestation et m’empêchant de réaliser le travail demandé, l’intégralité du montant versé sera remboursée, sans pour autant donner lieu au versement de dommages et intérêts à quelque titre que ce soit. Le client pourra également accepter le report de la séance à une date ultérieure, dans ce cas le montant versé ne sera pas remboursé."], "variant": null}, {"type": "paragraph", "spans": ["Malgré toute l’attention portée aux fichiers numériques, il peut arriver de manière exceptionnelle qu’à la suite d’une séance, par manipulation accidentelle, destruction involontaire, carte mémoire défaillante ou panne informatique, que les sources des photographies soient inexploitables. Dans ce cas, je vous offre la possibilité de refaire la séance afin de palier à cet incident indépendant de ma volonté. En cas de refus, le client ne pourra prétendre qu’au remboursement des sommes qu’il a versées, et ce sans aucun dédommagement."], "variant": null}]'::jsonb),
  ('cgv', 'responsabilite', null, 6, '[{"type": "heading", "level": 2, "text": "7. Responsabilité", "variant": null}, {"type": "paragraph", "spans": ["Le client est responsable de lui-même et des personnes l’accompagnant à la séance. En cas de détérioration ou de casse du matériel par le(s) client(s) ou ses enfants, celui-ci devra rembourser au prix du neuf. Si l’accident est de mon fait, mon assurance civile professionnelle sera déclenchée."], "variant": null}]'::jsonb),
  ('cgv', 'postprod', null, 7, '[{"type": "heading", "level": 2, "text": "8. Post-production et conservation des fichiers numériques", "variant": null}, {"type": "paragraph", "spans": ["Le client reconnaît être familier avec mon portfolio et sollicite mes services en toute connaissance de mon style artistique. Il reconnaît également que mon travail est en constante évolution, que la prestation que je propose est unique et artistique et que les photographies livrées peuvent être différentes des photographies que j’ai réalisées dans le passé. Je vous assure que j’utilise tout mon potentiel et tout mon jugement artistique personnel pour créer des images cohérentes avec ma vision personnelle de l’évènement. Le client accepte que cette vision soit différente de la sienne. En conséquence les photographies ne peuvent pas être soumises à un rejet en fonction des goûts ou des critères esthétiques propres à chacun. Je suis seul juge de la mise en page des images dans la réalisation d’un livre."], "variant": null}, {"type": "paragraph", "spans": ["Aucun fichier brut (raw) ne sera livré au client et ne pourra être exigé. Les fichiers numériques sont livrés au format jpeg haute qualité."], "variant": null}, {"type": "paragraph", "spans": ["La conservation des photographies est garantie pendant 6 mois (sauf catastrophe indépendante de ma volonté telle qu’un disque dur externe défaillant, inondation, incendie ou autres) ; au-delà, je me réserve le droit de les détruire."], "variant": null}]'::jsonb),
  ('cgv', 'impression', null, 8, '[{"type": "heading", "level": 2, "text": "9. Impression des photos", "variant": null}, {"type": "paragraph", "spans": ["Si le client tient à imprimer lui-même ses produits (livres, tirages…) grâce aux fichiers numériques qu’il a acquis, je décline toute responsabilité quant au résultat obtenu dans un laboratoire lambda. Je ne garantis le résultat que sur les tirages que j’effectue moi-même."], "variant": null}]'::jsonb),
  ('cgv', 'livraison', null, 9, '[{"type": "heading", "level": 2, "text": "10. Livraison de la commande", "variant": null}, {"type": "paragraph", "spans": ["L’intégralité du paiement sera demandée au client à la commande pour les produits dérivés à partir de la séance (tirages, book, agrandissements, etc…). Les produits sont à venir chercher conformément aux termes de la commande à l’adresse du siège social, 15 rue de Roquebilliere 06300 Nice ou par envoi postal aux frais du client (Sauf accord particulier)."], "variant": null}, {"type": "paragraph", "spans": ["Conformément à l’article 121-20-2 du Code de la Consommation, le droit de rétractation ne pourra être exercé pour ces produits, considérés comme étant nettement personnalisés."], "variant": null}, {"type": "paragraph", "spans": ["Les dates et délais de mise à disposition ne sont donnés qu’à titre indicatif ; en cas de retard de livraison d’un fournisseur, je ne serai pas tenu pour responsable et aucune compensation quelle qu’elle soit ne pourra m’être demandée."], "variant": null}, {"type": "paragraph", "spans": ["L’envoi par La Poste se fera aux frais du client et exclusivement en lettre suivie ou colissimo. Les délais de livraison mentionnés ne sont qu’indicatifs et peuvent éventuellement être modifiés. Je ne pourrai être tenu responsable des conséquences dues à un retard de livraison ou à une perte de colis de la part du transporteur. En cas de non réception d’un colis dans les délais indiqués, une enquête est menée auprès du transporteur et peut prendre plusieurs jours (ex : 21 jours à la Poste). Durant cette période, aucun remboursement ou renvoi ne pourra être effectué."], "variant": null}]'::jsonb),
  ('cgv', 'propriete', null, 10, '[{"type": "heading", "level": 2, "text": "11. Propriété intellectuelle", "variant": null}, {"type": "paragraph", "spans": ["Les photographies réalisées lors d’une séance sont protégées selon les règles des articles L 121-1 et loi du 11 mars 1957 (Code de la Propriété Intellectuelle et droits d’auteur). Même après cession des fichiers numériques, les photographies restent ma propriété intellectuelle et ne sont en conséquence pas libres de droit. Seul le droit à l’image du client lui est inaliénable."], "variant": null}, {"type": "paragraph", "spans": ["Toute utilisation commerciale par le client est formellement interdite sans mon accord écrit. Toute utilisation d’une photographie, quelle qu’en soit l’usage (concours, diffusion, exposition, reproduction, etc.) faite sans mon accord écrit constitue un délit de contrefaçon, au sens de l’article L 335-2 du même Code, et est punissable de peines pouvant aller jusqu’à 3 ans d’emprisonnement et 300 000 € d’amende."], "variant": null}, {"type": "paragraph", "spans": ["Il est notamment interdit et puni par la loi de numériser les tirages en vue de les diffuser sur Internet ou d’en faire des reproductions (y compris dans le cadre privé), de copier et d’utiliser les images présentées sur mes différents supports, de retirer par quelconque procédé ma signature et/ou mon logo et de modifier les photos (passage en noir et blanc, recadrage, retouches diverses, etc.) sans mon autorisation préalable."], "variant": null}, {"type": "paragraph", "spans": ["Lorsque le client achète les fichiers numériques en haute qualité, il lui est autorisé de reproduire les fichiers et de les enregistrer sur tout support qu’il souhaite dans un seul but de conservation, uniquement pour son usage personnel et privé. Pour toute utilisation publique tels que les réseaux sociaux, le client devra obligatoirement citer mon nom."], "variant": null}]'::jsonb),
  ('cgv', 'droitimage', null, 11, '[{"type": "heading", "level": 2, "text": "12. Droit à l’image et autorisation de diffusion", "variant": null}, {"type": "paragraph", "spans": ["Le client conserve son droit inaliénable à l’image en toute circonstance, tout temps et tout lieu. Le client déclare être majeur, poser librement pour des photographies et autoriser la prise de vues. Les représentants légaux déclarent être majeurs et autoriser les prises de vues de leur(s) enfant(s) mineur(s). Si l’un des représentants légaux s’avérait être mineur, les signatures de ses parents ou de ses représentants légaux est obligatoire, exception faite des personnes mineures émancipées. Dans le cas où un seul parent signe le contrat, il atteste que l’autre parent a été averti de la séance et ne s’oppose ni à la prise de vues, ni à l’exploitation des images réalisées si le droit d’exploitation a été accordé par le parent signataire."], "variant": null}, {"type": "paragraph", "spans": ["Sauf avis contraire du client, je pourrai utiliser les images à des fins commerciales dans le cadre de la promotion de mon activité (site web, pages professionnelles sur des réseaux sociaux, publicités, expositions, etc.) et ce pour une durée de 30 ans. Dans le cas d’une séance offerte ou à un tarif privilégié que je propose en vue d’une diffusion des photographies réalisées, si le client s’oppose finalement à cette diffusion, il devra régler la séance au tarif en vigueur."], "variant": null}, {"type": "paragraph", "spans": ["Le délai de livraison est de 2 à 4 semaines pour toutes les formules portrait / grossesse et environ un mois pour 20 photos de produits."], "variant": null}]'::jsonb),
  ('cgv', 'donnees', null, 12, '[{"type": "heading", "level": 2, "text": "13. Données à caractère personnel", "variant": null}, {"type": "paragraph", "spans": ["Je m’engage à préserver la vie privée de mes clients. En aucun cas les données recueillies ne seront cédées ou vendues à des tiers. Les informations personnelles demandées au client me sont destinées exclusivement à des fins de gestion administrative et commerciale."], "variant": null}]'::jsonb),
  ('cgv', 'loi', null, 13, '[{"type": "heading", "level": 2, "text": "14. Loi applicable", "variant": null}, {"type": "paragraph", "spans": ["Toutes les prestations que je réalise sont soumises à la loi française. Les parties s’engagent, avant toute action judiciaire, à soumettre leur différent au médiateur désigné par les organismes représentatifs des photographes professionnels. Pour toutes les contestations relatives à l’application des présentes conditions générales de vente ou des prestations que je réalise, il sera fait appel au tribunal compétent pour régler le litige."], "variant": null}]'::jsonb),
  ('confidentialite', 'collecte', null, 0, '[{"type": "paragraph", "spans": ["La protection de votre vie privée est une priorité pour Roger Moniz Studio. La présente politique détaille la façon dont je traite vos données personnelles lorsque vous naviguez sur mon site et utilisez mes services, en parfaite conformité avec le Règlement Général sur la Protection des Données (RGPD)."], "variant": null}, {"type": "heading", "level": 2, "text": "Données Collectées", "variant": null}, {"type": "paragraph", "spans": ["Je collecte uniquement les informations strictement nécessaires à la réalisation de mes prestations ou à l''amélioration de votre expérience utilisateur. Ces données incluent :"], "variant": null}, {"type": "list", "ordered": false, "items": [[{"bold": true, "text": "Données de contact :"}, " Nom, prénom, adresse e-mail, numéro de téléphone, recueillis lorsque vous remplissez mon formulaire de contact ou de demande de devis."], [{"bold": true, "text": "Données de projet :"}, " Informations relatives à vos besoins photographiques, dates d''événements, ou cahiers des charges partagés volontairement."], [{"bold": true, "text": "Données de navigation (anonymisées) :"}, " Type de navigateur, pages visitées, temps passé sur le site, collectées de manière agrégée via des cookies techniques."]]}]'::jsonb),
  ('confidentialite', 'utilisation', null, 1, '[{"type": "heading", "level": 2, "text": "Utilisation des Données", "variant": null}, {"type": "paragraph", "spans": ["Les données personnelles que je recueille sont utilisées exclusivement pour les finalités suivantes :"], "variant": null}, {"type": "list", "ordered": false, "items": [["Le traitement de vos demandes de contact et l''établissement de devis personnalisés."], ["La gestion opérationnelle, administrative et comptable de vos projets photographiques."], ["La communication concernant le déroulement des shootings et la livraison finale des fichiers."], ["Le respect de mes obligations légales et réglementaires (notamment en matière de facturation)."]]}, {"type": "paragraph", "spans": ["En aucun cas, Roger Moniz Studio n''utilise vos données à des fins de profilage ou de prospection commerciale automatisée (spam)."], "variant": null}]'::jsonb),
  ('confidentialite', 'securite', null, 2, '[{"type": "heading", "level": 2, "text": "Partage & Sécurité", "variant": null}, {"type": "paragraph", "spans": ["Je suis le seul destinataire de vos données personnelles. Elles ne sont ni vendues, ni louées, ni cédées à des tiers à des fins commerciales."], "variant": null}, {"type": "paragraph", "spans": ["Cependant, certaines données peuvent être partagées avec des prestataires de services tiers (sous-traitants) strictement nécessaires à mon activité (ex: plateforme d''hébergement web, outil de facturation, galeries en ligne pour la livraison de vos photos). Ces partenaires sont soumis à de strictes obligations de confidentialité et de conformité RGPD."], "variant": null}, {"type": "paragraph", "spans": [{"bold": true, "text": "Conservation :"}, " Vos données sont conservées le temps nécessaire à la finalité de leur traitement, et au maximum pour une durée de 3 ans après mon dernier contact (à l''exception des documents comptables conservés 10 ans selon la loi en vigueur)."], "variant": null}]'::jsonb),
  ('confidentialite', 'droits', null, 3, '[{"type": "heading", "level": 2, "text": "Vos Droits RGPD", "variant": null}, {"type": "paragraph", "spans": ["Conformément à la réglementation européenne en vigueur, vous disposez des droits suivants concernant vos données personnelles :"], "variant": null}, {"type": "list", "ordered": false, "items": [[{"bold": true, "text": "Droit d''accès et de rectification :"}, " Vous pouvez demander à consulter ou modifier les données vous concernant."], [{"bold": true, "text": "Droit à l''effacement (droit à l''oubli) :"}, " Vous pouvez demander la suppression de vos données de mes bases."], [{"bold": true, "text": "Droit à la limitation du traitement :"}, " Vous pouvez suspendre temporairement l''utilisation de vos données."], [{"bold": true, "text": "Droit à la portabilité :"}, " Vous pouvez récupérer vos données dans un format structuré et lisible."]]}, {"type": "paragraph", "spans": ["Pour exercer ces droits, vous pouvez me contacter à tout moment à l''adresse suivante : ", {"bold": true, "text": "privacy@rogermoniz.studio"}, ". Si vous estimez, après m''avoir contacté, que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL."], "variant": null}]'::jsonb),
  ('confidentialite', 'cookies', null, 4, '[{"type": "heading", "level": 2, "text": "Politique de Cookies", "variant": null}, {"type": "paragraph", "spans": ["Un « cookie » est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d''un site web. Il permet de conserver des données utilisateur afin de faciliter la navigation et de permettre certaines fonctionnalités."], "variant": null}, {"type": "heading", "level": 3, "text": "Les cookies que j''utilise", "variant": null}, {"type": "paragraph", "spans": ["Fidèle à mon approche minimaliste et respectueuse, je limite drastiquement l''usage des cookies :"], "variant": null}, {"type": "list", "ordered": false, "items": [[{"bold": true, "text": "Cookies strictement nécessaires (Fonctionnels) :"}, " J''utilise la mémoire locale de votre navigateur (localStorage) pour enregistrer votre préférence de thème visuel (Mode Clair ou Mode Sombre, clé : rm-theme). Ce processus est exempté de recueil de consentement préalable car il est indispensable pour fournir l''interface que vous avez explicitement demandée."], [{"bold": true, "text": "Cookies analytiques (Optionnels) :"}, " Je peux utiliser des outils de mesure d''audience anonymisée (sans suivi d''adresse IP) pour comprendre quelles galeries sont les plus consultées. Ces données sont agrégées et ne permettent pas de vous identifier personnellement."]]}, {"type": "heading", "level": 3, "text": "Gestion de vos préférences", "variant": null}, {"type": "paragraph", "spans": ["Vous pouvez à tout moment configurer votre navigateur de manière à ce que des cookies soient enregistrés dans votre terminal ou, au contraire, qu''ils soient rejetés, soit systématiquement, soit selon leur émetteur. La désactivation des cookies fonctionnels peut toutefois altérer l''expérience visuelle du site."], "variant": null}]'::jsonb),
  ('mentions-legales', 'editeur', null, 0, '[{"type": "paragraph", "spans": ["Conformément aux dispositions des articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004 pour la Confiance dans l''économie numérique, dite L.C.E.N., je porte à la connaissance des utilisateurs et visiteurs du site les informations suivantes."], "variant": null}, {"type": "heading", "level": 2, "text": "Éditeur du Site", "variant": null}, {"type": "paragraph", "spans": ["Le présent site internet est édité par ", {"bold": true, "text": "Roger Moniz Photographie"}, ", Société par Actions Simplifiée (SAS) au capital de 10 000 euros.", {"break": true}, {"break": true}, {"bold": true, "text": "Siège social :"}, " 3 avenue des mimosas 06100 Nice, France.", {"break": true}, {"bold": true, "text": "Immatriculation :"}, " RCS Paris B 123 456 789", {"break": true}, {"bold": true, "text": "Numéro de TVA intracommunautaire :"}, " FR 12 345678901", {"break": true}, {"bold": true, "text": "Directeur de la publication :"}, " Roger Moniz, en sa qualité de Fondateur et Directeur Artistique.", {"break": true}, {"bold": true, "text": "Contact :"}, " contact@rogermoniz.com ou via mon formulaire de ", {"href": "/contact", "text": "contact"}, "."], "variant": null}]'::jsonb),
  ('mentions-legales', 'hebergement', null, 1, '[{"type": "heading", "level": 2, "text": "Hébergement", "variant": null}, {"type": "paragraph", "spans": ["Le site est hébergé par ", {"bold": true, "text": "Vercel Inc."}, {"break": true}, {"break": true}, {"bold": true, "text": "Siège social :"}, " 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.", {"break": true}, {"bold": true, "text": "Contact de l''hébergeur :"}, " privacy@vercel.com", {"break": true}, {"bold": true, "text": "Serveurs :"}, " Les données du site sont exclusivement stockées sur des serveurs localisés en Union Européenne (Région AWS Paris/Francfort) afin de garantir la conformité aux normes européennes de protection des données."], "variant": null}]'::jsonb),
  ('mentions-legales', 'propriete', null, 2, '[{"type": "heading", "level": 2, "text": "Propriété Intellectuelle", "variant": null}, {"type": "paragraph", "spans": ["L''ensemble de ce site relève de la législation française et internationale sur le droit d''auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques."], "variant": null}, {"type": "paragraph", "spans": ["Sauf mention contraire, toutes les photographies, vidéos, textes, typographies et éléments graphiques présents sur ce site sont la propriété exclusive de Roger Moniz Photographie. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est formellement interdite, sauf autorisation écrite préalable de l''auteur."], "variant": null}, {"type": "paragraph", "spans": ["Toute exploitation non autorisée du site ou de l''un quelconque des éléments qu''il contient sera considérée comme constitutive d''une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle."], "variant": null}]'::jsonb),
  ('mentions-legales', 'donnees', null, 3, '[{"type": "heading", "level": 2, "text": "Données Personnelles (RGPD)", "variant": null}, {"type": "paragraph", "spans": ["D''une façon générale, vous pouvez visiter mon site sur Internet sans avoir à décliner votre identité et à fournir des informations personnelles vous concernant. Cependant, je peux parfois vous demander des informations, notamment via le formulaire de contact, afin de traiter votre demande de prestation."], "variant": null}, {"type": "paragraph", "spans": ["Les informations recueillies font l''objet d''un traitement informatique destiné exclusivement à la gestion de la clientèle de Roger Moniz Studio. Le destinataire des données est uniquement la direction du studio. Aucune donnée personnelle n''est cédée ou vendue à des tiers."], "variant": null}, {"type": "paragraph", "spans": ["Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi « informatique et libertés », vous bénéficiez d''un droit d''accès, de rectification, de portabilité et d''effacement de vos données ou encore de limitation du traitement. Vous pouvez exercer ces droits en vous adressant à :"], "variant": null}, {"type": "list", "ordered": false, "items": [["Par email : contact@rogermoniz.com"], ["Par courrier :Moniz Roger 3 avenue des mimosas 06100 Nice, France"]]}]'::jsonb),
  ('mentions-legales', 'cookies', null, 4, '[{"type": "heading", "level": 2, "text": "Politique de Cookies", "variant": null}, {"type": "paragraph", "spans": ["La navigation sur le site est susceptible de provoquer l''installation de cookie(s) sur l''ordinateur de l''utilisateur. Un cookie est un fichier de petite taille, qui ne permet pas l''identification de l''utilisateur, mais qui enregistre des informations relatives à la navigation d''un ordinateur sur un site."], "variant": null}, {"type": "heading", "level": 3, "text": "Cookies techniques essentiels", "variant": null}, {"type": "paragraph", "spans": ["Ce site utilise le stockage local (Local Storage) de votre navigateur de manière strictement technique pour mémoriser vos préférences de thème (Clair / Sombre). Ce cookie (rm-theme) est exempté de recueil de consentement car il est strictement nécessaire à la fourniture d''un service de communication en ligne à la demande expresse de l''utilisateur."], "variant": null}, {"type": "heading", "level": 3, "text": "Cookies d''analyse de performance", "variant": null}, {"type": "paragraph", "spans": ["Je peux utiliser des outils d''analyse d''audience respectueux de la vie privée (sans suivi IP ni croisement de données) pour mesurer l''interaction avec mes portfolios. Vous avez la possibilité de configurer votre navigateur pour refuser l''installation des cookies."], "variant": null}]'::jsonb);

insert into toc_entries (page_slug, position, href, label) values
  ('blog/octobre-rose-2025', 0, '#intro', 'Comprendre, pour mieux se protéger'),
  ('blog/octobre-rose-2025', 1, '#chiffres', 'Les chiffres à connaître'),
  ('blog/octobre-rose-2025', 2, '#palpation', 'Le bon geste : l''auto-palpation'),
  ('blog/octobre-rose-2025', 3, '#homme', 'Le cancer du sein chez l''homme'),
  ('blog/octobre-rose-2025', 4, '#agir', 'En parler, c''est déjà agir'),
  ('blog/shooting-ehpad', 0, '#rencontre', 'La rencontre'),
  ('blog/shooting-ehpad', 1, '#visages', 'Des visages, des histoires'),
  ('blog/shooting-ehpad', 2, '#lien-social', 'Un lien social'),
  ('blog/shooting-ehpad', 3, '#sens', 'Un acte d''amour'),
  ('blog/trois-lieux-magiques-a-nice', 0, '#intro', 'Trois décors, trois émotions'),
  ('blog/trois-lieux-magiques-a-nice', 1, '#cimiez', 'Sous les oliviers de Cimiez'),
  ('blog/trois-lieux-magiques-a-nice', 2, '#promenade', 'Les rochers de la Promenade'),
  ('blog/trois-lieux-magiques-a-nice', 3, '#vinaigrier', 'Le Parc du Vinaigrier'),
  ('events/on-pose-pour-le-rose', 0, '#intro', 'Un événement qui me tient à cœur'),
  ('events/on-pose-pour-le-rose', 1, '#solidarite', 'Bien plus qu''une séance photo'),
  ('events/on-pose-pour-le-rose', 2, '#force', 'Une journée pour soutenir la cause'),
  ('events/on-pose-pour-le-rose', 3, '#sensibiliser', 'Participer à l''édition 2026'),
  ('cgv', 0, '#objet', '1. Objet'),
  ('cgv', 1, '#tarifs', '2. Tarifs'),
  ('cgv', 2, '#reservation', '3. Réservation & Rétractation'),
  ('cgv', 3, '#annulation', '4. Report ou annulation'),
  ('cgv', 4, '#deroulement', '5. Déroulement d’une séance'),
  ('cgv', 5, '#probleme', '6. Problème technique'),
  ('cgv', 6, '#responsabilite', '7. Responsabilité'),
  ('cgv', 7, '#postprod', '8. Post-production & Fichiers'),
  ('cgv', 8, '#impression', '9. Impression des photos'),
  ('cgv', 9, '#livraison', '10. Livraison de la commande'),
  ('cgv', 10, '#propriete', '11. Propriété intellectuelle'),
  ('cgv', 11, '#droitimage', '12. Droit à l’image & Diffusion'),
  ('cgv', 12, '#donnees', '13. Données personnelles'),
  ('cgv', 13, '#loi', '14. Loi applicable'),
  ('confidentialite', 0, '#collecte', 'Données Collectées'),
  ('confidentialite', 1, '#utilisation', 'Utilisation des Données'),
  ('confidentialite', 2, '#securite', 'Partage & Sécurité'),
  ('confidentialite', 3, '#droits', 'Vos Droits RGPD'),
  ('confidentialite', 4, '#cookies', 'Politique de Cookies'),
  ('mentions-legales', 0, '#editeur', 'Éditeur du site'),
  ('mentions-legales', 1, '#hebergement', 'Hébergement'),
  ('mentions-legales', 2, '#propriete', 'Propriété Intellectuelle'),
  ('mentions-legales', 3, '#donnees', 'Données Personnelles'),
  ('mentions-legales', 4, '#cookies', 'Politique de Cookies');

insert into article_meta (page_slug, position, label, value) values
  ('blog/octobre-rose-2025', 0, 'Publié le', '15 Octobre 2025'),
  ('blog/octobre-rose-2025', 1, 'Auteur', 'Roger Moniz'),
  ('blog/shooting-ehpad', 0, 'Publié le', '16 Juin 2026'),
  ('blog/shooting-ehpad', 1, 'Auteur', 'Roger Moniz'),
  ('blog/trois-lieux-magiques-a-nice', 0, 'Publié le', '8 Avril 2026'),
  ('blog/trois-lieux-magiques-a-nice', 1, 'Auteur', 'Roger Moniz'),
  ('events/on-pose-pour-le-rose', 0, 'Date de l''événement', '10 Octobre 2026'),
  ('events/on-pose-pour-le-rose', 1, 'Auteur', 'Roger Moniz');

insert into read_next_cards (page_slug, position, href, badge, path, alt, title, description) values
  ('blog/octobre-rose-2025', 0, null, 'Conseils Pro', 'v1779963609/Amour_Pastel_15_orsyuk.webp', 'Set Design Studio', 'Pourquoi le Set Design transforme vos portraits', 'Un fond uni est classique, mais un véritable set design raconte une histoire. Comment nous construisons des décors éphémères pour élever l''identité visuelle de nos clients Corporate et Mode.'),
  ('blog/octobre-rose-2025', 1, null, 'Éditorial', 'v1779963606/Amour_Pastel_14_tolqjw.webp', 'Film Camera', 'La magie de la pellicule vs Le numérique', 'Dans un monde hyper-connecté, pourquoi le format moyen argentique continue-t-il de fasciner les directeurs artistiques ? Analyse d''une esthétique intemporelle.'),
  ('blog/shooting-ehpad', 0, null, 'Conseils Pro', 'v1779963609/Amour_Pastel_15_orsyuk.webp', 'Set Design Studio', 'Pourquoi le Set Design transforme vos portraits', 'Un fond uni est classique, mais un véritable set design raconte une histoire. Comment nous construisons des décors éphémères pour élever l''identité visuelle de nos clients Corporate et Mode.'),
  ('blog/shooting-ehpad', 1, null, 'Éditorial', 'v1779963606/Amour_Pastel_14_tolqjw.webp', 'Film Camera', 'La magie de la pellicule vs Le numérique', 'Dans un monde hyper-connecté, pourquoi le format moyen argentique continue-t-il de fasciner les directeurs artistiques ? Analyse d''une esthétique intemporelle.'),
  ('blog/trois-lieux-magiques-a-nice', 0, null, 'Conseils Pro', 'v1779963609/Amour_Pastel_15_orsyuk.webp', 'Set Design Studio', 'Pourquoi le Set Design transforme vos portraits', 'Un fond uni est classique, mais un véritable set design raconte une histoire. Comment nous construisons des décors éphémères pour élever l''identité visuelle de nos clients Corporate et Mode.'),
  ('blog/trois-lieux-magiques-a-nice', 1, null, 'Éditorial', 'v1779963606/Amour_Pastel_14_tolqjw.webp', 'Film Camera', 'La magie de la pellicule vs Le numérique', 'Dans un monde hyper-connecté, pourquoi le format moyen argentique continue-t-il de fasciner les directeurs artistiques ? Analyse d''une esthétique intemporelle.'),
  ('events/on-pose-pour-le-rose', 0, null, 'Conseils Pro', 'v1779963609/Amour_Pastel_15_orsyuk.webp', 'Set Design Studio', 'Pourquoi le Set Design transforme vos portraits', 'Un fond uni est classique, mais un véritable set design raconte une histoire. Comment nous construisons des décors éphémères pour élever l''identité visuelle de nos clients Corporate et Mode.'),
  ('events/on-pose-pour-le-rose', 1, null, 'Éditorial', 'v1779963606/Amour_Pastel_14_tolqjw.webp', 'Film Camera', 'La magie de la pellicule vs Le numérique', 'Dans un monde hyper-connecté, pourquoi le format moyen argentique continue-t-il de fasciner les directeurs artistiques ? Analyse d''une esthétique intemporelle.');

insert into section_headings (page_slug, section_key, title) values
  ('blog/octobre-rose-2025', 'read_next', 'À Lire Aussi'),
  ('blog/shooting-ehpad', 'read_next', 'À Lire Aussi'),
  ('blog/trois-lieux-magiques-a-nice', 'read_next', 'À Lire Aussi'),
  ('events/on-pose-pour-le-rose', 'read_next', 'À Lire Aussi');

insert into vision_blocks (page_slug, kind, eyebrow, heading) values
  ('portrait', 'split', 'La Vision', 'On prend rarement le temps de se regarder vraiment.'),
  ('amour-de-soi', 'split', 'La Vision', 'Il y a des moments dans une vie où l''on ressent le besoin de se voir autrement.'),
  ('fantaisie', 'split', 'La Vision', 'Il y a des parts de nous que l’on ne montre pas toujours.'),
  ('corporate', 'split', 'Votre Image', 'Des images professionnelles qui vous ressemblent.'),
  ('grossesse', 'split', 'La Vision', 'Vous pensez souvent que vous aurez le temps.'),
  ('in-the-box', 'stacked', 'La Vision', 'La boîte blanche est simple, minimaliste, neutre.'),
  ('evenementiel', 'split', 'La Vision', 'Et si vous pouviez revivre vos moments importants ?'),
  ('packshot', 'split', 'La Vision', 'Aujourd’hui, vos clients découvrent votre univers avant de vous rencontrer.');

insert into vision_paragraphs (page_slug, position, body) values
  ('portrait', 0, 'Pas dans un miroir entre deux activités, pas sur une photo prise rapidement, sans vraiment y penser. Mais réellement, tel que l’on est aujourd’hui. On pense toujours qu’on aura le temps plus tard mais plus tard, c’est quand? Les années passent, le physique évolue, les liens avec son corps aussi. Et on finit par voir que l’on a presque aucune image de tous ces moments passés, traversés avec notre corps, notre entourage. Aucune image de ce quotidien qui, pourtant, comptait.'),
  ('portrait', 1, 'Cette séance n’est pas là pour vous transformer. Elle est là pour révéler ce qui est déjà présent. Ce que vous êtes, ce que vous dégagez, ce que les autres voient déjà chez vous. Pas besoin de savoir poser ni d’être à l’aise. Je vous guide pas à pas pour faire ressortir ce qu’il y a de plus beau chez vous. Vous pouvez choisir l’ambiance qui vous ressemble ou plaît le plus. Chez vous, dans votre cocon, cet endroit familier, intime et rassurant. Ou en extérieur, sous la lumière naturelle des divers paysages qui s’offrent à nous. Dans les deux cas, l’objectif reste le même: vous offrir la possibilité de vivre cette expérience.'),
  ('amour-de-soi', 0, 'Pas à travers le regard des autres. Pas à travers les filtres. Mais avec douceur. Avec vérité. La séance « Amour de soi » est née de ce besoin-là. Ce n’est pas simplement un shooting. C’est une parenthèse, un espace où l’on ralentit, où l’on dépose ses doutes. Un instant où l’on accepte, enfin, d’être regardé avec bienveillance.'),
  ('amour-de-soi', 1, 'Souvent, les personnes avec qui j’échange me disent qu’elles ne sont pas photogéniques. Qu’elles ne savent pas poser. Qu’elles attendront “le bon moment”. Et puis un jour, la séance commence. Les épaules se relâchent, le souffle s’apaise, le regard change, les premiers sourires arrivent. Et c’est à ce moment là que quelque chose se révèle, que la magie opère.'),
  ('fantaisie', 0, 'Des forces plus sauvages, plus mystiques, plus puissantes. La séance Fantaisie est pensée pour celles et ceux qui veulent incarner pleinement leur alter ego. Pas pour se déguiser, mais pour révéler une facette enfouie, assumée, vibrante. Ici on incarne, on devient.'),
  ('fantaisie', 1, 'En vous sommeille peut-être une reine des océans qui ne craint pas la tempête, une fée gardienne de la forêt. Un sorcier rempli de mystère ou un fier guerrier au regard inébranlable. Ici, la seule limite est l’imagination.'),
  ('corporate', 0, 'Aujourd’hui, avant même de vous rencontrer, vos clients voient votre image. Ils découvrent votre site internet, votre Instagram, votre LinkedIn, vos visuels. En quelques secondes, ils ressentent déjà quelque chose, en positif comme en négatif. Un client qui perçoit une image cohérente et soignée ressent immédiatement plus de confiance.'),
  ('corporate', 1, 'Une séance corporate, ce n’est pas seulement faire des photos professionnelles. C’est créer des images qui racontent qui vous êtes, votre énergie, votre univers et la façon dont vous travaillez. Peu importe votre secteur, l’objectif reste le même : montrer qui vous êtes vraiment, car aujourd’hui les gens achètent autant votre énergie que votre service.'),
  ('grossesse', 0, 'Le temps de profiter, de vous regarder, de garder une trace de ce moment. Et puis les semaines passent. Le corps change doucement puis plus vite. Les gestes, les tenues deviennent différents. Les habitudes aussi. Et un jour, sans vraiment s’en rendre compte, tout s’arrête. Ce ventre qui portait la vie disparaît progressivement et avec lui, cette période si particulière.'),
  ('grossesse', 1, 'Vous gardez des souvenirs, bien sûr. Des sensations, des images prises à la va-vite. Mais ce lien là, ce corps là, ce mélange de force et de vulnérabilité, tout ça représente une étape unique dans la vie. Et souvent, vous réalisez trop tard que vous ne l’avez pas vraiment regardée.'),
  ('in-the-box', 0, 'Mais dès que vous y entrez, tout devient possible. On accessoirise, on rit, on se penche, on se cache. Chaque geste devient une interaction, chaque posture raconte une petite histoire. Et chaque décor est unique puisque c’est VOUS qui le construisez avec tous les accessoires disponibles.'),
  ('in-the-box', 1, 'Puis, grâce au montage réalisé par la suite, la magie opère : vos boîtes se multiplient, se croisent, se rencontrent. Vous jouez avec l’espace, avec la perspective, avec vos propres doubles. C’est votre énergie qui donne vie à l’image.'),
  ('evenementiel', 0, 'Il y a des moments qui passent vite, trop vite. Un rire, un regard, une surprise et c’est déjà terminé. Un évènement ce n’est pas juste une date dans un agenda. C’est toute une organisation pour faire de ce moment, un moment agréable pour tous. Un instant durant lequel des souvenirs se créent. Et c’est mon rôle d’immortaliser tout ça.'),
  ('evenementiel', 1, 'Je ne suis pas là pour vous faire poser toute la journée. Je suis là pour observer, anticiper et capturer des moments spontanés. Ceux que vous ne voyez pas toujours sur le moment. Les éclats de rire inattendus, les regards complices, les petits détails qui font toute la différence. Le naturel avant tout, l’émotion avant la perfection.'),
  ('packshot', 0, 'Sur votre site, vos réseaux sociaux, sur une publicité. Et dans ces premières secondes, tout se joue. Un visuel flou, sombre ou approximatif et l’intérêt retombe. Un visuel clair, esthétique, maîtrisé et l’envie s’installe.'),
  ('packshot', 1, 'La séance PACKSHOT, ce n’est pas juste “montrer” ce que vous vendez. C’est révéler la valeur de vos biens, capter l’attention et la curiosité des personnes qui verront vos photos. La lumière souligne les matières, les angles mettent en avant les détails tandis que la composition guide le regard. Chaque image est pensée pour rendre vos produits désirables, lisibles, professionnels. Un bon produit mérite d’être vu à sa juste valeur. Votre travail mérite sa reconnaissance.');

insert into vision_images (page_slug, position, path, alt) values
  ('portrait', 0, 'v1779963000/Portrait_15_okf9jk.webp', 'Roger Moniz'),
  ('portrait', 1, 'v1779962924/Portrait_10_bjwrwl.webp', 'Roger Moniz'),
  ('portrait', 2, 'v1779962925/Portrait_12_x6w9tu.webp', 'Roger Moniz'),
  ('portrait', 3, 'v1779962999/Portrait_14_qnmsfw.webp', 'Roger Moniz'),
  ('amour-de-soi', 0, 'v1779962865/OPPLR_2026_Marion_9_uanmfj.webp', 'Roger Moniz'),
  ('amour-de-soi', 1, 'v1779962863/OPPLR_2026_Julie_7_trljxv.webp', 'Roger Moniz'),
  ('amour-de-soi', 2, 'v1779962862/OPPLR_2026_Emilie_10_yqlnk9.webp', 'Roger Moniz'),
  ('amour-de-soi', 3, 'v1779962861/OPPLR_2026_Emilie_7_hrccsd.webp', 'Roger Moniz'),
  ('fantaisie', 0, 'v1779962889/Fantaisie_15_xsl6rh.webp', 'Roger Moniz'),
  ('fantaisie', 1, 'v1779962888/Fantaisie_13_eceppy.webp', 'Roger Moniz'),
  ('fantaisie', 2, 'v1779962882/Fantaisie_2_eavcyy.webp', 'Roger Moniz'),
  ('fantaisie', 3, 'v1779962892/Fantaisie_21_abq3xn.webp', 'Roger Moniz'),
  ('corporate', 0, 'v1779963271/Portrait_33_mfut6s.webp', 'Roger Moniz'),
  ('corporate', 1, 'v1779963265/Portrait_27_bcenyb.webp', 'Roger Moniz'),
  ('corporate', 2, 'v1779963269/Portrait_31_tnfsqm.webp', 'Roger Moniz'),
  ('corporate', 3, 'v1779963262/Portrait_25_xcqfux.webp', 'Roger Moniz'),
  ('grossesse', 0, 'v1779963352/Grossesse_6_tsyqkx.webp', 'Roger Moniz'),
  ('grossesse', 1, 'v1779963357/Grossesse_9_t918s7.webp', 'Roger Moniz'),
  ('grossesse', 2, 'v1779963348/Grossesse_3_xnu7ne.webp', 'Roger Moniz'),
  ('grossesse', 3, 'v1779963347/Grossesse_2_mich0h.webp', 'Roger Moniz'),
  ('in-the-box', 0, 'v1781795005/3_lgstcj.webp', 'Shooting in the box'),
  ('in-the-box', 1, 'v1781795005/1_azpjtw.webp', 'Shooting in the box'),
  ('in-the-box', 2, 'v1781795005/2_yvdv6u.webp', 'Shooting in the box'),
  ('evenementiel', 0, 'v1781512638/Soir%C3%A9e_entrepreneurs_28.05.26-4_iijyoi.webp', 'Roger Moniz'),
  ('evenementiel', 1, 'v1779963337/Evenement_10_vl12fw.webp', 'Roger Moniz'),
  ('evenementiel', 2, 'v1781111042/Bégo_Sandy_Giulia_ra0siw.webp', 'Roger Moniz'),
  ('evenementiel', 3, 'v1779963331/Evenement_6_xasjxb.webp', 'Roger Moniz'),
  ('packshot', 0, 'v1779963425/Packshot_10_buts1e.webp', 'Roger Moniz'),
  ('packshot', 1, 'v1779963612/Amour_Pastel_1_zxjkej.webp', 'Roger Moniz'),
  ('packshot', 2, 'v1779963609/Amour_Pastel_15_orsyuk.webp', 'Roger Moniz'),
  ('packshot', 3, 'v1779963428/Packshot_11_odmxbx.webp', 'Roger Moniz');

insert into process_steps (page_slug, position, num, title, description) values
  ('portrait', 0, '01.', 'L''Instant Présent', 'Cette séance est pour vous si vous souhaitez conserver de belles images de vous, capturer de beaux moments de complicités en famille ou simplement parce que vous n’en avez jamais fait. Il n’y a pas besoin d’une grande occasion, votre vie d’aujourd’hui suffit.'),
  ('portrait', 1, '02.', 'Un Héritage', 'Et plus tard, ces photos prendront de la valeur. Pas forcément tout de suite, peut-être dans quelques mois ou années. Quand vous regarderez en arrière, quand les choses auront changé et que vous serez heureux d’avoir gardé un souvenir de ces instants.'),
  ('portrait', 2, '03.', 'L''Accompagnement', 'Si ces mots résonnent en vous, c’est peut-être que cette expérience vous appelle déjà. Et je serai ravi de vous accompagner.'),
  ('amour-de-soi', 0, '01.', 'L''Échange', 'Avant même de sortir l’appareil photo, je prends le temps d’échanger avec vous. De comprendre votre histoire, ce que vous traversez ou souhaitez célébrer.'),
  ('amour-de-soi', 1, '02.', 'Le Jour J', 'Je transforme votre espace ou le mien (environ 2 mètres de long suffisent) en un univers doux et artistique, en apportant le décor, les tenues et les accessoires soigneusement choisis pour sublimer votre personnalité.'),
  ('amour-de-soi', 2, '03.', 'Lâcher prise', 'Vous n’avez rien à préparer. Rien à organiser. Rien à anticiper. Vous n’avez qu’à être là !!!'),
  ('fantaisie', 0, '01.', 'L''Immersion', 'On ne parle plus de shooting, on parle d’un univers dont la nature est le décor et où les différents éléments deviennent des alliés. Vous n’avez pas besoin de savoir poser. Je fournis les tenues, les accessoires, je vous guide et vous dirige.'),
  ('fantaisie', 1, '02.', 'L''Incarnation', 'Au début, vous hésitez un peu puis quelque chose bascule. Le regard change, le corps prend confiance, la présence s’installe. Et soudain… vous ne jouez plus un personnage. Vous l’êtes.'),
  ('fantaisie', 2, '03.', 'La Révélation', 'Ce que j’aime dans ces séances, c’est le moment précis où vous réalisez que vous pouvez être puissant, mystique, intimidant même. C’est vous permettre d’explorer une autre version de vous-même.'),
  ('corporate', 0, '01.', 'Pour votre communication', 'Pendant la séance, nous créons ensemble plusieurs types d’images pour communiquer partout facilement : portraits professionnels, mises en scène de votre activité et photos pour vos réseaux sociaux, faciles à détourer et à décliner. L’idée n’est pas de vous transformer mais de montrer la version de vous qui existe déjà.'),
  ('corporate', 1, '02.', 'Où vous le souhaitez', 'À domicile, dans vos locaux, en extérieur ou dans tout lieu en lien avec votre activité. Avant le shooting, nous échangeons pour définir l’ambiance, les tenues, les couleurs, les accessoires et le style de communication recherché.'),
  ('corporate', 2, '03.', 'L’Accompagnement', 'Chaque séance est pensée selon votre univers. Si ces mots résonnent en vous, c’est peut-être que cette expérience vous appelle déjà. Et je serai ravi de vous accompagner.'),
  ('grossesse', 0, '01.', 'Ralentir', 'Cette séance grossesse est une façon de ralentir. De vous arrêter juste un instant, de poser un regard différent sur vous, sur ce corps qui change pour donner naissance à la plus belle des choses.'),
  ('grossesse', 1, '02.', 'Se Voir', 'Une façon de vous voir comme vous êtes réellement à ce moment-là. Forte, douce, en train de créer la vie. C’est une manière de dire « je veux me souvenir de ça. »'),
  ('grossesse', 2, '03.', 'L''Accompagnement', 'Vous n’avez rien à prouver, rien à faire parfaitement, rien à organiser. Je vous guide avec douceur et bienveillance. Vous pouvez être seule et/ou avec votre partenaire, dans votre cocon ou en pleine nature.'),
  ('in-the-box', 0, '01.', 'Spontanéité', 'Pas besoin de savoir poser. On teste, on improvise, on fait des essais improbables. Et souvent, les meilleures images viennent des moments les plus spontanés. AMUSEZ-VOUS !!!'),
  ('in-the-box', 1, '02.', 'Pour tous', 'Cette séance est parfaite si vous n’aimez pas poser, ou si vous n’aimez pas les séances photos traditionnelles. C’est la séance préférée des plus petits et celle très appréciée par les familles ou amis.'),
  ('in-the-box', 2, '03.', 'En entreprise', 'C’est également un moyen de voir autrement les photos en entreprise. Des photos sur un fond neutre c’est bien, mais une séance amusante pour booster la cohésion d’équipe c’est encore mieux.'),
  ('evenementiel', 0, '01.', 'L''Instant Présent', 'Que ce soit pour un anniversaire entouré de vos proches, un EVJF / EVJG fun et mémorable, un baptême rempli de douceur.'),
  ('evenementiel', 1, '02.', 'un événement pro', 'Mais aussi un évènement entre entrepreneurs, une soirée ou une célébration. Les possibilités sont multiples.'),
  ('evenementiel', 2, '03.', 'L''Accompagnement', 'Dans tous les cas, l’objectif reste le même : vous offrir la possibilité de vivre votre moment pleinement et sereinement.'),
  ('packshot', 0, '01.', 'L''Impact', 'Un outil pour renforcer votre image de marque, inspirer confiance dès le premier regard, vous démarquer de la concurrence. Mais aussi, augmenter l’impact de votre communication digitale, donner de la cohérence à votre univers visuel.'),
  ('packshot', 1, '02.', 'L''Approche', 'Chaque produit a son identité, chaque marque a son univers. Minimaliste, haut de gamme, naturel, coloré, artisanal… Nous définissons ensemble une direction artistique cohérente avec votre image.'),
  ('packshot', 2, '03.', 'La Cohérence', 'Je travaille la lumière, les textures, les compositions, pour créer des visuels à la fois esthétiques et efficaces. Vous avez travaillé votre offre, votre produit et votre savoir-faire. Vos images doivent être à la hauteur.');

insert into pricing_blocks (page_slug, kind, cta_label, cta_href) values
  ('portrait', 'cards', null, null),
  ('amour-de-soi', 'cards', null, null),
  ('fantaisie', 'cards', null, null),
  ('corporate', 'cards', null, null),
  ('grossesse', 'cards', null, null),
  ('in-the-box', 'cards', null, null),
  ('evenementiel', 'quote', 'Demander un devis', '/contact'),
  ('packshot', 'quote', 'Demander un devis', '/contact');

insert into pricing_cards (page_slug, position, featured, tag, badge, title, description, price, cta_label, cta_href) values
  ('portrait', 0, false, 'Portrait', null, 'Instant', 'Pour celles et ceux qui veulent vivre l’expérience en toute simplicité, se découvrir ou redécouvrir.', '150€', 'Réserver', '/contact'),
  ('portrait', 1, true, 'Populaire', 'Signature', 'Classique', 'Pour celles et ceux pour qui chaque image raconte quelque chose de différent.', '200€', 'Réserver', '/contact'),
  ('portrait', 2, false, 'Premium', null, 'Deluxe', 'Pour celles et ceux qui veulent garder des souvenirs à revivre encore et encore.', '230€', 'Réserver', '/contact'),
  ('amour-de-soi', 0, false, 'Amour de soi', null, 'Éclat', 'Pour celles et ceux qui veulent vivre l’expérience en toute simplicité, se découvrir ou redécouvrir. Vous vous accordez une parenthèse rien qu’à vous.', '200€', 'Réserver', '/contact'),
  ('amour-de-soi', 1, true, 'Populaire', 'Signature', 'Amour', 'Pour celles et ceux pour qui chaque image raconte quelque chose de différent. Un équilibre parfait entre choix, émotion et souvenir.', '250€', 'Réserver', '/contact'),
  ('amour-de-soi', 2, false, 'Premium', null, 'Passion', 'Pour celles et ceux qui souhaitent que cette expérience devienne un objet d’art à part entière. Certaines images méritent de quitter l’écran, de prendre vie.', '300€', 'Réserver', '/contact'),
  ('fantaisie', 0, false, 'Fantaisie', null, 'Éveil', 'Pour celles et ceux qui veulent vivre l’expérience en toute simplicité, se découvrir ou redécouvrir. Vous vous accordez une parenthèse rien qu’à vous.', '170€', 'Réserver', '/contact'),
  ('fantaisie', 1, true, 'Populaire', 'Signature', 'Fantaisie', 'Pour celles et ceux pour qui chaque image raconte quelque chose de différent. L’harmonie entre les frissons et les souvenirs du moment passé.', '220€', 'Réserver', '/contact'),
  ('fantaisie', 2, false, 'Premium', null, 'Légende', 'Pour celles et ceux qui souhaitent que cette expérience devienne un objet d’art à part entière. Certaines images méritent de quitter l’écran, de prendre vie.', '270€', 'Réserver', '/contact'),
  ('corporate', 0, false, 'Présence', null, 'Présence', 'Pour les entrepreneurs qui ont besoin de quelques images simples, professionnelles et efficaces.', '180€', 'Réserver', '/contact'),
  ('corporate', 1, true, 'Populaire', 'Signature', 'Signature', 'Pour les entrepreneurs qui veulent raconter davantage leur univers et varier leur communication.', '230€', 'Réserver', '/contact'),
  ('corporate', 2, false, 'Premium', null, 'Vision', 'Pour les entrepreneurs et les marques qui souhaitent construire une image forte et durable.', '260€', 'Réserver', '/contact'),
  ('grossesse', 0, false, 'Grossesse', null, 'Prélude', 'Pour celles qui veulent simplement garder un souvenir. Quelques images choisies avec le cœur.', '150€', 'Réserver', '/contact'),
  ('grossesse', 1, true, 'Populaire', 'Signature', 'Connexion', 'Pour celles qui sentent que ce moment mérite un peu plus. Parce que chaque détail compte. Chaque geste, chaque regard.', '200€', 'Réserver', '/contact'),
  ('grossesse', 2, false, 'Premium', null, 'Éclosion', 'Pour celles qui veulent se souvenir mais aussi garder une trace. Une part de votre histoire à garder toute une vie.', '250€', 'Réserver', '/contact'),
  ('in-the-box', 0, false, 'In The Box', null, 'Iron', 'Pour une première approche simple et amusante dans la boîte.', '150€', 'Réserver', '/contact'),
  ('in-the-box', 1, false, 'In The Box', null, 'Silver', 'Plus d''espace pour exprimer votre créativité et vos émotions.', '180€', 'Réserver', '/contact'),
  ('in-the-box', 2, true, 'Populaire', 'Signature', 'Gold', 'L''équilibre parfait pour des interactions de groupe mémorables.', '230€', 'Réserver', '/contact'),
  ('in-the-box', 3, false, 'Premium', null, 'Deluxe', 'L''expérience ultime pour un montage géant et des souvenirs incroyables.', '260€', 'Réserver', '/contact');

insert into pricing_notes (page_slug, placement, position, body) values
  ('corporate', 'intro', 0, 'Tarifs étudiés pour un shooting d’une personne. Pour une entreprise, contactez-moi afin d’adapter le nombre de personnes à photographier et de photos à livrer. Un supplément de 20€ est à prévoir si la séance nécessite l’installation d’un fond studio.'),
  ('grossesse', 'footnote', 0, '* Les tarifs proposés ne prennent pas en compte la mise en place d’un décor en intérieur ou d’un univers fantaisie en extérieur. Pour cela, je vous invite à vous fier aux tarifs présents sur mes prestations « Amour de soi » ou « Fantaisie ».'),
  ('evenementiel', 'lead', 0, 'Chaque évènement à sa propre ambiance, chaque reportage photo mérite d’être exceptionnel. Plusieurs facteurs rentrent en compte.'),
  ('evenementiel', 'lead', 1, 'Je vous invite à me joindre en m’expliquant votre projet afin d’obtenir un devis personnalisé qui répondra parfaitement à vos attentes.'),
  ('packshot', 'lead', 0, 'Cette mise en valeur de vos produits mérite d’être unique et plusieurs facteurs rentrent en compte.'),
  ('packshot', 'lead', 1, 'Je vous invite à me joindre en m’expliquant votre projet afin d’obtenir un devis personnalisé qui répondra parfaitement à vos attentes.');

insert into gallery_items (page_slug, kind, position, span, path, alt) values
  ('portrait', 'bento', 0, 'span-2x2', 'v1779963162/Myl%C3%A8ne-2_beehdc.webp', 'Roger Moniz'),
  ('portrait', 'bento', 1, 'span-1x2', 'v1779963164/Myl%C3%A8ne-7_ffgl1b.webp', 'Roger Moniz'),
  ('portrait', 'bento', 2, 'span-1x1', 'v1779963167/Myl%C3%A8ne-13_x9mxrx.webp', 'Roger Moniz'),
  ('portrait', 'bento', 3, 'span-1x1', 'v1779963169/Myl%C3%A8ne-18_nqlixh.webp', 'Roger Moniz'),
  ('portrait', 'bento', 4, 'span-1x2', 'v1779963125/Portrait_19_k3hgwj.webp', 'Roger Moniz'),
  ('portrait', 'bento', 5, 'span-1x1', 'v1779962921/Portrait_1_n2r1ls.webp', 'Roger Moniz'),
  ('portrait', 'bento', 6, 'span-2x1', 'v1779963126/Portrait_21_rulxfk.webp', 'Roger Moniz'),
  ('portrait', 'bento', 7, 'span-1x1', 'v1779963126/Portrait_20_tr9rqa.webp', 'Roger Moniz'),
  ('portrait', 'bento', 8, 'span-2x1', 'v1779963022/Portrait_17_okc6dd.webp', 'Roger Moniz'),
  ('portrait', 'bento', 9, 'span-1x1', 'v1779962922/Portrait_8_wuaopt.webp', 'Roger Moniz'),
  ('portrait', 'bento', 10, 'span-2x2', 'v1779962924/Portrait_10_bjwrwl.webp', 'Roger Moniz'),
  ('portrait', 'bento', 11, 'span-1x2', 'v1779963129/Portrait_24_dn3l2j.webp', 'Roger Moniz'),
  ('portrait', 'bento', 12, 'span-1x1', 'v1779962925/Portrait_12_x6w9tu.webp', 'Roger Moniz'),
  ('amour-de-soi', 'bento', 0, 'span-2x2', 'v1779962856/Amour_de_soi_8_wwgluz.webp', 'Roger Moniz'),
  ('amour-de-soi', 'bento', 1, 'span-1x2', 'v1779962862/OPPLR_2026_Emilie_10_yqlnk9.webp', 'Roger Moniz'),
  ('amour-de-soi', 'bento', 2, 'span-1x1', 'v1779962856/Amour_de_soi_9_wr4i7i.webp', 'Roger Moniz'),
  ('amour-de-soi', 'bento', 3, 'span-1x1', 'v1779962855/Amour_de_soi_1_gobaht.webp', 'Roger Moniz'),
  ('amour-de-soi', 'bento', 4, 'span-1x2', 'v1779962856/Amour_de_soi_5_a7w08s.webp', 'Roger Moniz'),
  ('amour-de-soi', 'bento', 5, 'span-1x1', 'v1779962856/Amour_de_soi_6_qun48b.webp', 'Roger Moniz'),
  ('amour-de-soi', 'bento', 6, 'span-2x1', 'v1779962859/Amour_de_soi_15_avgjys.webp', 'Roger Moniz'),
  ('amour-de-soi', 'bento', 7, 'span-1x1', 'v1779962855/Amour_de_soi_2_qdw9cg.webp', 'Roger Moniz'),
  ('amour-de-soi', 'bento', 8, 'span-2x1', 'v1779962855/Amour_de_soi_3_c25dv1.webp', 'Roger Moniz'),
  ('amour-de-soi', 'bento', 9, 'span-1x1', 'v1779962862/OPPLR_2026_Julie_1_muroow.webp', 'Roger Moniz'),
  ('amour-de-soi', 'bento', 10, 'span-2x2', 'v1779962862/OPPLR_2026_Emilie_8_wy8qay.webp', 'Roger Moniz'),
  ('amour-de-soi', 'bento', 11, 'span-1x2', 'v1779962860/OPPLR_2026_Emilie_2_nvwapd.webp', 'Roger Moniz'),
  ('amour-de-soi', 'bento', 12, 'span-1x1', 'v1779962861/OPPLR_2026_Emilie_7_hrccsd.webp', 'Roger Moniz'),
  ('fantaisie', 'bento', 0, 'span-2x2', 'v1779962891/Fantaisie_19_xcpaou.webp', 'Roger Moniz'),
  ('fantaisie', 'bento', 1, 'span-1x2', 'v1779962883/Fantaisie_3_jol6cr.webp', 'Roger Moniz'),
  ('fantaisie', 'bento', 2, 'span-1x1', 'v1779962888/Fantaisie_12_sbevtn.webp', 'Roger Moniz'),
  ('fantaisie', 'bento', 3, 'span-1x1', 'v1779962882/Fantaisie_1_dvfldv.webp', 'Roger Moniz'),
  ('fantaisie', 'bento', 4, 'span-1x2', 'v1779962888/Fantaisie_14_hkqeew.webp', 'Roger Moniz'),
  ('fantaisie', 'bento', 5, 'span-1x1', 'v1779962891/Fantaisie_18_mrob4s.webp', 'Roger Moniz'),
  ('fantaisie', 'bento', 6, 'span-2x1', 'v1779962892/Fantaisie_21_abq3xn.webp', 'Roger Moniz'),
  ('fantaisie', 'bento', 7, 'span-1x1', 'v1779962887/Fantaisie_11_i3lfas.webp', 'Roger Moniz'),
  ('fantaisie', 'bento', 8, 'span-2x1', 'v1779962886/Fantaisie_8_ngwsof.webp', 'Roger Moniz'),
  ('fantaisie', 'bento', 9, 'span-1x1', 'v1779962890/Fantaisie_17_kwjvgl.webp', 'Roger Moniz'),
  ('fantaisie', 'bento', 10, 'span-2x2', 'v1779962882/Fantaisie_2_eavcyy.webp', 'Roger Moniz'),
  ('fantaisie', 'bento', 11, 'span-1x2', 'v1779962892/Fantaisie_20_d4p7y7.webp', 'Roger Moniz'),
  ('fantaisie', 'bento', 12, 'span-1x1', 'v1779962886/Fantaisie_9_qqrb4p.webp', 'Roger Moniz'),
  ('corporate', 'bento', 0, 'span-2x2', 'v1779963271/Portrait_33_mfut6s.webp', 'Roger Moniz'),
  ('corporate', 'bento', 1, 'span-1x2', 'v1784666955/Chlo%C3%A9_Organiz_Om_gaayhx.webp', 'Roger Moniz'),
  ('corporate', 'bento', 2, 'span-1x1', 'v1784666956/Chlo%C3%A9_Organiz_Om-7_wcu3v2.webp', 'Roger Moniz'),
  ('corporate', 'bento', 3, 'span-1x1', 'v1779963268/Portrait_30_trhbsa.webp', 'Roger Moniz'),
  ('corporate', 'bento', 4, 'span-1x2', 'v1779963267/Portrait_29_zpqldx.webp', 'Roger Moniz'),
  ('corporate', 'bento', 5, 'span-1x1', 'v1779963265/Portrait_28_yxuyjh.webp', 'Roger Moniz'),
  ('corporate', 'bento', 6, 'span-2x1', 'v1784666956/Chlo%C3%A9_Organiz_Om-4_ogtjqp.webp', 'Roger Moniz'),
  ('corporate', 'bento', 7, 'span-1x1', 'v1784666956/Chloé_Organiz_Om-6_bgbvdu.webp', 'Roger Moniz'),
  ('corporate', 'bento', 8, 'span-2x1', 'v1779963262/Portrait_25_xcqfux.webp', 'Roger Moniz'),
  ('corporate', 'bento', 9, 'span-1x1', 'v1784666956/Chloé_Organiz_Om-3_rcaatr.webp', 'Roger Moniz'),
  ('corporate', 'bento', 10, 'span-2x2', 'v1779963270/Portrait_32_zhvstd.webp', 'Roger Moniz'),
  ('corporate', 'bento', 11, 'span-1x2', 'v1784666958/Chlo%C3%A9_Organiz_Om-14_fk6idw.webp', 'Roger Moniz'),
  ('corporate', 'bento', 12, 'span-1x1', 'v1784666959/Chlo%C3%A9_Organiz_Om-20_oudy35.webp', 'Roger Moniz'),
  ('grossesse', 'bento', 0, 'span-2x2', 'v1779963351/Grossesse_5_j37drb.webp', 'Roger Moniz'),
  ('grossesse', 'bento', 1, 'span-1x2', 'v1781177282/Cécile_grossesse-11_zoklrz.webp', 'Roger Moniz'),
  ('grossesse', 'bento', 2, 'span-1x1', 'v1781177283/Cécile_grossesse-16_vwopq9.webp', 'Roger Moniz'),
  ('grossesse', 'bento', 3, 'span-1x1', 'v1781177282/Amélie_Grossesse-14_cqrmep.webp', 'Roger Moniz'),
  ('grossesse', 'bento', 4, 'span-1x2', 'v1779963355/Grossesse_8_boag72.webp', 'Roger Moniz'),
  ('grossesse', 'bento', 5, 'span-1x1', 'v1781177282/C%C3%A9cile_grossesse-7_zsyiio.webp', 'Roger Moniz'),
  ('grossesse', 'bento', 6, 'span-2x1', 'v1779963360/Grossesse_11_hhxgws.webp', 'Roger Moniz'),
  ('grossesse', 'bento', 7, 'span-1x1', 'v1781177281/Amélie_Grossesse-5_sv1vwn.webp', 'Roger Moniz'),
  ('grossesse', 'bento', 8, 'span-2x1', 'v1779963362/Grossesse_12_g09bk1.webp', 'Roger Moniz'),
  ('grossesse', 'bento', 9, 'span-1x1', 'v1781177280/Cécile_grossesse-17_o5egqu.webp', 'Roger Moniz'),
  ('grossesse', 'bento', 10, 'span-2x2', 'v1781177282/Cécile_grossesse-10_euhrjg.webp', 'Roger Moniz'),
  ('grossesse', 'bento', 11, 'span-1x2', 'v1779963345/Grossesse_1_ez6wt7.webp', 'Roger Moniz'),
  ('grossesse', 'bento', 12, 'span-1x1', 'v1781177282/Am%C3%A9lie_Grossesse-15_slak83.webp', 'Roger Moniz'),
  ('in-the-box', 'trio', 0, null, 'v1781795005/3_lgstcj.webp', 'Shooting in the box'),
  ('in-the-box', 'trio', 1, null, 'v1781795005/1_azpjtw.webp', 'Shooting in the box'),
  ('in-the-box', 'trio', 2, null, 'v1781795005/2_yvdv6u.webp', 'Shooting in the box'),
  ('evenementiel', 'bento', 0, 'span-2x2', 'v1781111042/Bégo_Sandy_Giulia_ra0siw.webp', 'Roger Moniz'),
  ('evenementiel', 'bento', 1, 'span-1x2', 'v1781512640/Soir%C3%A9e_entrepreneurs_28.05.26-49_cnol50.webp', 'Roger Moniz'),
  ('evenementiel', 'bento', 2, 'span-1x1', 'v1779963335/Evenement_9_bvelzp.webp', 'Roger Moniz'),
  ('evenementiel', 'bento', 3, 'span-1x1', 'v1781512648/Soir%C3%A9e_entrepreneurs_28.05.26-7_riiemd.webp', 'Roger Moniz'),
  ('evenementiel', 'bento', 4, 'span-1x2', 'v1779963332/Evenement_7_tyzdhd.webp', 'Roger Moniz'),
  ('evenementiel', 'bento', 5, 'span-1x1', 'v1779963334/Evenement_8_gjmdf9.webp', 'Roger Moniz'),
  ('evenementiel', 'bento', 6, 'span-2x1', 'v1779963329/Evenement_5_uvlf0l.webp', 'Roger Moniz'),
  ('evenementiel', 'bento', 7, 'span-1x1', 'v1781512988/Entrepreneurs-4_mm9mca.webp', 'Roger Moniz'),
  ('evenementiel', 'bento', 8, 'span-2x1', 'v1781512987/Entrepreneurs-33_l5zjbj.webp', 'Roger Moniz'),
  ('evenementiel', 'bento', 9, 'span-1x1', 'v1779963335/Evenement_9_bvelzp.webp', 'Roger Moniz'),
  ('evenementiel', 'bento', 10, 'span-2x2', 'v1781512639/Soir%C3%A9e_entrepreneurs_28.05.26-6_lrxy56.webp', 'Roger Moniz'),
  ('evenementiel', 'bento', 11, 'span-1x2', 'v1781512643/Soir%C3%A9e_entrepreneurs_28.05.26-21_enrvmy.webp', 'Roger Moniz'),
  ('evenementiel', 'bento', 12, 'span-1x1', 'v1779963331/Evenement_6_xasjxb.webp', 'Roger Moniz'),
  ('packshot', 'bento', 0, 'span-2x2', 'v1779963417/Packshot_5_tubz1x.webp', 'Roger Moniz'),
  ('packshot', 'bento', 1, 'span-1x2', 'v1779963600/Amour_Pastel_6_errjbv.webp', 'Roger Moniz'),
  ('packshot', 'bento', 2, 'span-1x1', 'v1779963428/Packshot_11_odmxbx.webp', 'Roger Moniz'),
  ('packshot', 'bento', 3, 'span-1x1', 'v1781181240/Amour_Pastel_3_ynjthu.webp', 'Roger Moniz'),
  ('packshot', 'bento', 4, 'span-1x2', 'v1781181311/Amour_Pastel_20_jys6hu.webp', 'Roger Moniz'),
  ('packshot', 'bento', 5, 'span-1x1', 'v1781181386/Produits_-_Les_Fumades-9_zpp7fw.webp', 'Roger Moniz'),
  ('packshot', 'bento', 6, 'span-2x1', 'v1781181363/Produits_-_Les_Fumades-17_jtrhx9.webp', 'Roger Moniz'),
  ('packshot', 'bento', 7, 'span-1x1', 'v1781181350/Produits_-_Les_Fumades-16_zrcrbn.webp', 'Roger Moniz'),
  ('packshot', 'bento', 8, 'span-2x1', 'v1781181347/Produits_-_Les_Fumades-15_yod3ac.webp', 'Roger Moniz'),
  ('packshot', 'bento', 9, 'span-1x1', 'v1781181346/Produits_-_Les_Fumades-14_zwe0mh.webp', 'Roger Moniz'),
  ('packshot', 'bento', 10, 'span-2x2', 'v1781181344/Produits_-_Les_Fumades-13_qdnfxf.webp', 'Roger Moniz'),
  ('packshot', 'bento', 11, 'span-1x2', 'v1781181391/Amour_Pastel_12_xnusnf.webp', 'Roger Moniz'),
  ('packshot', 'bento', 12, 'span-1x1', 'v1781181337/Amour_Pastel_16_bnncf9.webp', 'Roger Moniz');

-- Card features, matched to their card by page and position.
insert into pricing_features (card_id, position, body) select id, 0, 'Un moment simple avec des images choisies avec le cœur' from pricing_cards where page_slug = 'portrait' and position = 0;
insert into pricing_features (card_id, position, body) select id, 1, '10 photos numériques retouchées' from pricing_cards where page_slug = 'portrait' and position = 0;
insert into pricing_features (card_id, position, body) select id, 2, 'Images livrées sur galerie privée' from pricing_cards where page_slug = 'portrait' and position = 0;
insert into pricing_features (card_id, position, body) select id, 3, 'L''essentiel, sans superflu, pour oser se voir différemment' from pricing_cards where page_slug = 'portrait' and position = 0;
insert into pricing_features (card_id, position, body) select id, 0, 'Plus de photos pour plus de nuances dans votre sélection' from pricing_cards where page_slug = 'portrait' and position = 1;
insert into pricing_features (card_id, position, body) select id, 1, '15 photos numériques retouchées' from pricing_cards where page_slug = 'portrait' and position = 1;
insert into pricing_features (card_id, position, body) select id, 2, 'Images livrées sur galerie privée' from pricing_cards where page_slug = 'portrait' and position = 1;
insert into pricing_features (card_id, position, body) select id, 3, 'Profiter pleinement de l’expérience sans regretter' from pricing_cards where page_slug = 'portrait' and position = 1;
insert into pricing_features (card_id, position, body) select id, 0, 'Un souvenir qui reste dans le temps et la diversité' from pricing_cards where page_slug = 'portrait' and position = 2;
insert into pricing_features (card_id, position, body) select id, 1, '20 photos numériques retouchées' from pricing_cards where page_slug = 'portrait' and position = 2;
insert into pricing_features (card_id, position, body) select id, 2, 'Images livrées sur galerie privée' from pricing_cards where page_slug = 'portrait' and position = 2;
insert into pricing_features (card_id, position, body) select id, 3, 'Pas de frustration lors du choix, que du plaisir' from pricing_cards where page_slug = 'portrait' and position = 2;
insert into pricing_features (card_id, position, body) select id, 0, 'Un moment pour ralentir' from pricing_cards where page_slug = 'amour-de-soi' and position = 0;
insert into pricing_features (card_id, position, body) select id, 1, '10 photos numériques retouchées' from pricing_cards where page_slug = 'amour-de-soi' and position = 0;
insert into pricing_features (card_id, position, body) select id, 2, 'Images livrées sur galerie privée' from pricing_cards where page_slug = 'amour-de-soi' and position = 0;
insert into pricing_features (card_id, position, body) select id, 3, 'Sans exigence ni pression' from pricing_cards where page_slug = 'amour-de-soi' and position = 0;
insert into pricing_features (card_id, position, body) select id, 0, 'Profiter pleinement de l''expérience' from pricing_cards where page_slug = 'amour-de-soi' and position = 1;
insert into pricing_features (card_id, position, body) select id, 1, '15 photos numériques retouchées' from pricing_cards where page_slug = 'amour-de-soi' and position = 1;
insert into pricing_features (card_id, position, body) select id, 2, 'Images livrées sur galerie privée' from pricing_cards where page_slug = 'amour-de-soi' and position = 1;
insert into pricing_features (card_id, position, body) select id, 3, 'Plus de photos pour plus de nuances' from pricing_cards where page_slug = 'amour-de-soi' and position = 1;
insert into pricing_features (card_id, position, body) select id, 0, 'Un souvenir tangible de ce moment' from pricing_cards where page_slug = 'amour-de-soi' and position = 2;
insert into pricing_features (card_id, position, body) select id, 1, '20 photos numériques retouchées' from pricing_cards where page_slug = 'amour-de-soi' and position = 2;
insert into pricing_features (card_id, position, body) select id, 2, 'Images livrées sur galerie privée' from pricing_cards where page_slug = 'amour-de-soi' and position = 2;
insert into pricing_features (card_id, position, body) select id, 3, '3 grands tirages d''art (20x30 cm)' from pricing_cards where page_slug = 'amour-de-soi' and position = 2;
insert into pricing_features (card_id, position, body) select id, 0, 'Plongez dans l''univers imaginé ensemble' from pricing_cards where page_slug = 'fantaisie' and position = 0;
insert into pricing_features (card_id, position, body) select id, 1, '10 photos numériques retouchées' from pricing_cards where page_slug = 'fantaisie' and position = 0;
insert into pricing_features (card_id, position, body) select id, 2, 'Images livrées sur galerie privée' from pricing_cards where page_slug = 'fantaisie' and position = 0;
insert into pricing_features (card_id, position, body) select id, 3, 'La première version de votre métamorphose' from pricing_cards where page_slug = 'fantaisie' and position = 0;
insert into pricing_features (card_id, position, body) select id, 0, 'Profiter pleinement de l''expérience' from pricing_cards where page_slug = 'fantaisie' and position = 1;
insert into pricing_features (card_id, position, body) select id, 1, '15 photos numériques retouchées' from pricing_cards where page_slug = 'fantaisie' and position = 1;
insert into pricing_features (card_id, position, body) select id, 2, 'Images livrées sur galerie privée' from pricing_cards where page_slug = 'fantaisie' and position = 1;
insert into pricing_features (card_id, position, body) select id, 3, 'Plus de photos pour plus de nuances' from pricing_cards where page_slug = 'fantaisie' and position = 1;
insert into pricing_features (card_id, position, body) select id, 0, 'Une trace durable de la personne incarnée' from pricing_cards where page_slug = 'fantaisie' and position = 2;
insert into pricing_features (card_id, position, body) select id, 1, '20 photos numériques retouchées' from pricing_cards where page_slug = 'fantaisie' and position = 2;
insert into pricing_features (card_id, position, body) select id, 2, 'Images livrées sur galerie privée' from pricing_cards where page_slug = 'fantaisie' and position = 2;
insert into pricing_features (card_id, position, body) select id, 3, '3 grands tirages d''art (20x30 cm)' from pricing_cards where page_slug = 'fantaisie' and position = 2;
insert into pricing_features (card_id, position, body) select id, 0, 'Une base solide pour lancer votre activité' from pricing_cards where page_slug = 'corporate' and position = 0;
insert into pricing_features (card_id, position, body) select id, 1, '10 photos numériques retouchées' from pricing_cards where page_slug = 'corporate' and position = 0;
insert into pricing_features (card_id, position, body) select id, 2, 'Images livrées sur galerie privée' from pricing_cards where page_slug = 'corporate' and position = 0;
insert into pricing_features (card_id, position, body) select id, 3, 'Montrer votre activité avec confiance et visibilité' from pricing_cards where page_slug = 'corporate' and position = 0;
insert into pricing_features (card_id, position, body) select id, 0, 'Varier les ambiances, les tenues et les décors' from pricing_cards where page_slug = 'corporate' and position = 1;
insert into pricing_features (card_id, position, body) select id, 1, '15 photos numériques retouchées' from pricing_cards where page_slug = 'corporate' and position = 1;
insert into pricing_features (card_id, position, body) select id, 2, 'Images livrées sur galerie privée' from pricing_cards where page_slug = 'corporate' and position = 1;
insert into pricing_features (card_id, position, body) select id, 3, 'De la cohérence et de la personnalité pour votre marque' from pricing_cards where page_slug = 'corporate' and position = 1;
insert into pricing_features (card_id, position, body) select id, 0, 'Une véritable bibliothèque visuelle de marque' from pricing_cards where page_slug = 'corporate' and position = 2;
insert into pricing_features (card_id, position, body) select id, 1, '20 photos numériques retouchées' from pricing_cards where page_slug = 'corporate' and position = 2;
insert into pricing_features (card_id, position, body) select id, 2, 'Images livrées sur galerie privée' from pricing_cards where page_slug = 'corporate' and position = 2;
insert into pricing_features (card_id, position, body) select id, 3, 'Portraits, lifestyle, détails et univers de marque' from pricing_cards where page_slug = 'corporate' and position = 2;
insert into pricing_features (card_id, position, body) select id, 0, 'Les photos qui diront l’essentiel' from pricing_cards where page_slug = 'grossesse' and position = 0;
insert into pricing_features (card_id, position, body) select id, 1, '10 photos numériques retouchées' from pricing_cards where page_slug = 'grossesse' and position = 0;
insert into pricing_features (card_id, position, body) select id, 2, 'Images livrées sur galerie privée' from pricing_cards where page_slug = 'grossesse' and position = 0;
insert into pricing_features (card_id, position, body) select id, 3, 'Un souvenir intemporel' from pricing_cards where page_slug = 'grossesse' and position = 0;
insert into pricing_features (card_id, position, body) select id, 0, 'Profiter pleinement de l’expérience' from pricing_cards where page_slug = 'grossesse' and position = 1;
insert into pricing_features (card_id, position, body) select id, 1, '15 photos numériques retouchées' from pricing_cards where page_slug = 'grossesse' and position = 1;
insert into pricing_features (card_id, position, body) select id, 2, 'Images livrées sur galerie privée' from pricing_cards where page_slug = 'grossesse' and position = 1;
insert into pricing_features (card_id, position, body) select id, 3, 'Plus de photos pour plus de nuances' from pricing_cards where page_slug = 'grossesse' and position = 1;
insert into pricing_features (card_id, position, body) select id, 0, 'Un souvenir tangible de ce moment' from pricing_cards where page_slug = 'grossesse' and position = 2;
insert into pricing_features (card_id, position, body) select id, 1, '20 photos numériques retouchées' from pricing_cards where page_slug = 'grossesse' and position = 2;
insert into pricing_features (card_id, position, body) select id, 2, 'Images livrées sur galerie privée' from pricing_cards where page_slug = 'grossesse' and position = 2;
insert into pricing_features (card_id, position, body) select id, 3, '3 grands tirages d''art (20x30 cm)' from pricing_cards where page_slug = 'grossesse' and position = 2;
insert into pricing_features (card_id, position, body) select id, 0, 'Montage final de 9 cases' from pricing_cards where page_slug = 'in-the-box' and position = 0;
insert into pricing_features (card_id, position, body) select id, 0, 'Montage final de 13 cases' from pricing_cards where page_slug = 'in-the-box' and position = 1;
insert into pricing_features (card_id, position, body) select id, 0, 'Montage final de 19 cases' from pricing_cards where page_slug = 'in-the-box' and position = 2;
insert into pricing_features (card_id, position, body) select id, 0, 'Montage final de 24 cases' from pricing_cards where page_slug = 'in-the-box' and position = 3;

insert into home_welcome (page_slug, image_path, image_alt) values
  ('index', 'v1781110541/RogerHD-22_pn7eti.webp', 'Roger Moniz Studio');

insert into home_welcome_paragraphs (position, body) values
  (0, 'Basé à Nice depuis plus de 4 ans, mon parcours artistique a débuté par le chant et la danse. Aujourd''hui, la photographie est mon médium pour exprimer les émotions et raconter **votre histoire personnelle**.'),
  (1, 'Concevoir la photographie comme une passion me confère une liberté totale. Sans aucune limite de temps imposée, mon but est de concevoir chaque séance comme une véritable **œuvre sur-mesure**.');

insert into prestation_teasers (position, index_label, title, description, href, cta_label, path, alt) values
  (0, '01', 'Amour de Soi', 'Chaque détail est pensé : décor chaleureux et accessoires sur-mesure. Un moment intime à domicile pour vous reconnecter avec votre image.', '/amour-de-soi', 'Découvrir', 'v1781713456/Homepage_site-6_kbemmx.webp', 'Amour de soi'),
  (1, '02', 'Fantaisie', 'Une mise en scène narrative afin d''incarner le personnage que vous portez en vous. Création de tenues et accessoires uniques.', '/fantaisie', 'Découvrir', 'v1781536041/Homepage_site_ntgzr9.webp', 'Fantaisie'),
  (2, '03', 'Portrait', 'Oubliez l''idée de ne pas être photogénique. En extérieur ou à domicile, nous travaillerons ensemble afin de réaliser des images qui vous ressemblent ou vous sortent de votre zone de confort.', '/portrait', 'Découvrir', 'v1781335004/3Q5A2765-Modifier-Modifier_2_yave1y.webp', 'Portrait'),
  (3, '04', 'Corporate', 'Donnez une image professionnelle à la hauteur de votre activité. Des visuels modernes et cohérents pour votre marque, votre site et vos réseaux.', '/corporate', 'Découvrir', 'v1781713457/Homepage_site-5_lzsaig.webp', 'Corporate'),
  (4, '05', 'Grossesse', 'Seule, en couple ou en famille, profitez d''accessoires, de tenues et de ma bienveillance afin d''immortaliser l''un des plus beaux évènements de votre vie.', '/grossesse', 'Découvrir', 'v1779963352/Grossesse_6_tsyqkx.webp', 'Grossesse'),
  (5, '06', 'Dans la Boîte', 'Une expérience amusante dans une boîte personnalisable à l''infini. Ajoutez vos accessoires et laissez-moi créer un montage final unique et plein de vie.', '/in-the-box', 'Découvrir', 'v1779963384/Shooting_in_the_box_1_wabrhi.webp', 'Dans la boîte'),
  (6, '07', 'Evénementiel', 'Pour un EVJF, un baptême ou une fête, gardez un souvenir de votre moment. Une animation mémorable pour vous et vos invités.', '/evenementiel', 'Découvrir', 'v1781111042/B%C3%A9go_Sandy_Giulia_ra0siw.webp', 'Evénementiel'),
  (7, '08', 'Packshot', 'Mettez vos produits en valeur avec des images nettes et soignées. Des visuels professionnels pensés pour votre boutique en ligne et votre communication.', '/packshot', 'Découvrir', 'v1781181344/Produits_-_Les_Fumades-13_qdnfxf.webp', 'Packshot');

insert into reviews (position, name, date_label, avatar_path, avatar_alt, stars, quote) values
  (0, 'Sabrine', 'Publié récemment', 'v1779962856/Amour_de_soi_4_h8smse.webp', 'Sabrine', 5, '"Une superbe expérience ! Roger est très professionnel et bienveillant. Il sait vraiment mettre à l''aise pendant la séance. Les photos sont magnifiques. Je recommande à 100%, merci"'),
  (1, 'Morgan', 'Publié récemment', 'v1779962860/Amour_de_soi_16_fuqakv.webp', 'Morgan', 5, '"J''ai passé un excellent moment. Il a su me mettre à l''aise, s''adapter et est rempli d''idées pour créer une ambiance. Ravie de l''expérience comme du résultat je recommande vivement !"'),
  (2, 'Elina', 'Publié récemment', 'v1779962922/Portrait_2_fmywmr.webp', 'Elina', 5, '"Photographe très pro, minutieux et attentif aux moindres détails. Également attentif aux idées du modèle. Le résultat est juste dingue, il gère parfaitement les retouches. Je recommande vivement."'),
  (3, 'Céline', 'Publié récemment', 'v1779962885/Fantaisie_7_y76mvn.webp', 'Céline', 5, '"Photographe bienveillant et respectueux, il a su me mettre à l’aise malgré ma pudeur. Shooting très sympa, ouvert à tous les styles et toujours partant pour des défis artistiques. Je recommande !"'),
  (4, 'Karima', 'Publié récemment', 'v1779962999/Portrait_14_qnmsfw.webp', 'Karima', 5, '"Ce fût un magnifique moment! Photographe très professionnel, à l''écoute , bienveillant, très avenant! Photos de qualité qui ont su captiver les émotions et les moments de complicité! Un grand merci, je le recommande fortement!'),
  (5, 'Lara', 'Publié récemment', 'v1779963000/Portrait_15_okf9jk.webp', 'Lara', 5, '"J''ai eu l''immense plaisir de participer à un shooting avec Roger, c''est un professionnel très compétent, à l''écoute et avec un œil affûté pour dénicher le bon angle, le bon spot et la bonne luminosité. Merci pour les photos magnifiques."');

insert into contact_info (page_slug, position, label, href, value, note) values
  ('contact', 0, 'Email Direct', 'mailto:contact@rogermoniz.com', 'contact@rogermoniz.com', null),
  ('contact', 1, 'Téléphone', 'tel:+33647936098', '06.47.93.60.98', null),
  ('contact', 2, 'Localisation', null, 'Nice & Côte d''Azur, France', 'Disponible à l''international sur demande.'),
  ('contact', 3, 'Heures d''ouverture', null, 'Lundi - Vendredi : 09h00 - 18h00', 'Week-end : Réservé aux événements.');

insert into contact_form (page_slug, success_message) values
  ('contact', 'Merci ! Votre demande a bien été envoyée. Je vous recontacte très vite par email.');

insert into contact_subject_options (position, value, label) values
  (0, 'portrait', 'Portrait'),
  (1, 'amour de soi', 'Amour de soi'),
  (2, 'fantaisie', 'Fantaisie'),
  (3, 'corporate', 'Corporate'),
  (4, 'grossesse', 'Grossesse'),
  (5, 'in the box', 'In the box'),
  (6, 'event', 'Evénementiel'),
  (7, 'packshot', 'Packshot'),
  (8, 'other', 'Autre demande');

insert into blog_cover (page_slug, href, flag, path, alt, meta, title, excerpt, cta_label) values
  ('blog', '/blog/shooting-ehpad', 'Blog', 'v1779963530/Blog_EHPAD_1_xa5i8j.webp', 'Shooting photo en EHPAD', 'Nos chers aînés', 'Redonner lumière et douceur à ceux qu’on oublie.', 'Lors de ce shooting en EHPAD, j’ai eu la chance de rencontrer des résidents pleins de vie, d’humour et d’histoires. Certains étaient timides au départ, d’autres impatients de passer devant l’objectif, mais tous ont offert un sourire vrai, de ceux qui illuminent une pièce entière..', 'Lire l''article');

insert into blog_filters (position, value, label) values
  (0, 'all', 'Tout'),
  (1, 'editorial', 'Éditorial'),
  (2, 'evenementiel', 'Événementiel'),
  (3, 'direction-artistique', 'Direction Artistique'),
  (4, 'materiel', 'Matériel'),
  (5, 'conseils-pro', 'Conseils Pro'),
  (6, 'coulisses', 'Coulisses');

insert into article_cards (page_slug, position, href, date_label, badge, path, alt, title, description, cta_label, category) values
  ('blog', 0, '/blog/shooting-ehpad', null, 'Coulisses', 'v1779963542/Blog_EHPAD_7_j2jkpu.webp', 'Shooting photo en EHPAD', 'Shooting en EHPAD : redonner lumière et douceur', 'Lors de ce shooting en EHPAD, j''ai rencontré des résidents pleins de vie, d''humour et d''histoires. Un projet photo humain et bienveillant, pour redonner confiance et visibilité à ceux qu''on oublie parfois.', 'Lire', 'coulisses'),
  ('blog', 1, '/blog/trois-lieux-magiques-a-nice', null, 'Conseils Pro', 'v1779963528/Blog_3_lieux_magiques_zwetkw.webp', 'Trois lieux magiques à Nice', 'Trois lieux magiques à Nice pour un shooting', 'Nice est une ville qui respire la beauté et la lumière. De Cimiez au Vinaigrier, découvrez mes décors azuréens favoris pour créer des portraits empreints de poésie.', 'Lire', 'conseils-pro'),
  ('blog', 2, '/blog/octobre-rose-2025', null, 'Coulisses', 'v1779963561/Blog_Octobre_Rose_8_rdzgmq.webp', 'Octobre Rose 2025', 'Octobre Rose 2025 – Prévention et lutte contre le cancer du sein', 'En ce mois d’Octobre Rose, la campagne de sensibilisation au dépistage du cancer du sein nous rappelle l’importance de la prévention et du soutien entre femmes. En tant que photographe à Nice, j’ai souhaité rendre hommage à cette cause à travers une séance photo pleine de lumière, de douceur et de solidarité. Et si la photographie peut, à sa manière, contribuer à sensibiliser, alors chaque image devient un petit pas vers plus de conscience et d’espérance.', 'Lire', 'coulisses'),
  ('events', 0, '/events/on-pose-pour-le-rose', '10 Octobre 2026 · Colle-sur-Loup', 'À venir', 'v1779962862/OPPLR_2026_Emilie_8_wy8qay.webp', 'On Pose pour le Rose 2026', 'On Pose pour le Rose — Édition 2026', 'Une journée solidaire au profit de la lutte contre le cancer du sein : séances photo, ateliers et bonne humeur dans un cadre d''exception.', 'Réserver', null),
  ('events', 1, '/contact', '28 Mai 2026 · Nice', 'Sur réservation', 'v1779963332/Evenement_7_tyzdhd.webp', 'Soirée entrepreneurs', 'Soirée Entrepreneurs', 'Reportage d''une soirée de networking : portraits, ambiance et moments forts captés sur le vif tout au long de l''évènement.', 'En savoir plus', null);

insert into event_featured (page_slug, badge, path, alt, cta_href, cta_label) values
  ('events', 'Réservations Ouvertes', 'v1779962862/OPPLR_2026_Emilie_8_wy8qay.webp', 'On Pose pour le Rose 2026', '/events/on-pose-pour-le-rose', 'En savoir plus');

insert into event_featured_paragraphs (position, body) values
  (0, 'En octobre 2026, j''aurai l''immense plaisir de participer à l''événement « On Pose pour le Rose », une initiative nationale qui rassemble chaque année des bénévoles autour d''une même mission : soutenir la lutte contre le cancer du sein grâce à la photographie et à divers ateliers.'),
  (1, 'Ce que j''aime particulièrement dans cet événement, c''est qu''il va bien au-delà de la simple séance photo. C''est un moment de partage, de bienveillance et parfois même de reconstruction.'),
  (2, 'Chaque participante vient vivre une expérience unique tout en contribuant à une cause essentielle.');

insert into event_featured_stats (position, label, value) values
  (0, 'Date', '10 octobre 2026 · Sur réservation'),
  (1, 'Lieu', 'Hôtel « L''Abbaye » — Colle-sur-Loup');

insert into about_story (page_slug, image_path, image_alt, image_focal) values
  ('a-propos', 'v1781110539/RogerHD-14_mlpavt.webp', 'Roger Moniz, photographe', '50% 22%');

insert into about_story_paragraphs (position, spans) values
  (0, '["Je m''appelle Roger et je suis ", {"bold": true, "text": "photographe à Nice"}, " depuis maintenant quatre ans. Le domaine artistique fait partie de moi depuis toujours. J''ai commencé à l''explorer il y a une dizaine d''années, d''abord par le chant pendant près de dix ans, puis par la danse, et plus récemment par la photographie."]'::jsonb),
  (1, '["J''adore faire de nouvelles rencontres, échanger et rire sur mille sujets. Pourtant, j''ai parfois du mal à exprimer mes sentiments. ", {"bold": true, "text": "L''art est ma façon d''y arriver"}, ", et la photographie est devenue le prolongement naturel de cette envie de créer du lien."]'::jsonb),
  (2, '["Ce qui revient le plus souvent dans les retours qu''on me fait, c''est l''ambiance. On me dit que ", {"bold": true, "text": "je sais mettre à l''aise"}, ", même les plus timides ou les plus pudiques, que je reste à l''écoute et attentif aux moindres détails. J''aime m''adapter à chacun, proposer des idées et rester ouvert à tous les styles comme aux défis un peu fous."]'::jsonb),
  (3, '["La photographie est aujourd''hui mon activité professionnelle secondaire, et c''est une vraie chance. Cela me permet de la garder comme une ", {"bold": true, "text": "passion"}, " et de l''aborder à chaque fois avec la même sincérité."]'::jsonb);

insert into about_figures (position, value, label) values
  (0, '4', 'Ans de photographie'),
  (1, '10', 'Ans de pratique artistique'),
  (2, '7', 'Prestations sur-mesure'),
  (3, '100%', 'Sur la Côte d''Azur');

insert into about_strip (position, path, alt) values
  (0, 'v1781110541/RogerHD-22_pn7eti.webp', 'Roger Moniz, photographe'),
  (1, 'v1781110535/RogerHD-56_eacnka.webp', 'Roger Moniz, photographe'),
  (2, 'v1781110537/RogerHD_x7rsue.webp', 'Roger Moniz, photographe'),
  (3, 'v1781345582/658365643_18566024899013085_4894525987003510174_n_x06zt1.webp', 'Roger Moniz, photographe'),
  (4, 'v1781110534/RogerHD-55_kiaxao.webp', 'Roger Moniz, photographe');

insert into about_close (page_slug, quote, name) values
  ('a-propos', 'Si ces mots résonnent en vous, c''est peut-être le signe qu''il est temps de vous offrir de belles images. Je serais ravi de créer, ensemble, quelque chose de vrai.', 'Roger');

insert into process_steps (page_slug, position, num, title, description) values
  ('a-propos', 0, '01.', 'L''écoute', 'Avant de déclencher, on échange longuement. Vos envies, votre univers et vos doutes guident chaque image pour qu''elle vous ressemble vraiment.'),
  ('a-propos', 1, '02.', 'La mise en confiance', 'Être photographié n''est pas toujours évident. Je prends le temps de vous guider avec bienveillance pour que la séance reste un moment agréable.'),
  ('a-propos', 2, '03.', 'L''expérience', 'De notre premier échange à la livraison des images, tout est pensé pour que chaque étape se déroule avec fluidité, sérénité et attention.');

insert into gift_intro (page_slug, lead) values
  ('carte-cadeau', '[{"italic": true, "text": "Imaginez…"}, " Et si le plus beau cadeau n''était pas un objet, mais un moment ? Une journée sur la Promenade des Anglais, une séance en forêt ou à domicile : les premiers instants de gêne laissent vite place aux sourires sincères et au plaisir de se redécouvrir — en couple, en famille, entre amis ou seul. C''est ça, le cadeau que vous offrez : un moment de confiance, de beauté et de souvenir.", {"break": true}, {"break": true}, "Contrairement à une carte cadeau dédiée à une séance précise, mes cartes cadeaux fonctionnent sous forme d’avoir. Vous choisissez simplement le montant parmi les trois formules proposées, et le bénéficiaire pourra l’utiliser librement pour la prestation de son choix parmi celles disponibles sur le site. Cette formule offre une totale liberté, une attention personnalisée qui permet à chacun de choisir le moment et la séance qui lui correspondent le mieux."]'::jsonb);

insert into gift_steps (position, label) values
  (0, '01. La Prestation'),
  (1, '02. Personnalisation'),
  (2, '03. Format de Livraison');

insert into gift_packages (position, value, price, is_default, title, description) values
  (0, 'Découverte', '200€', false, 'Découverte', 'Pour celles et ceux qui veulent vivre l’expérience en toute simplicité.'),
  (1, 'Émotion', '250€', true, 'Émotion (Recommandé)', 'Pour celles et ceux pour qui chaque image raconte quelque chose de différent.'),
  (2, 'Deluxe', '300€', false, 'Deluxe', 'Pour celles et ceux qui veulent garder des souvenirs à revivre encore et encore.');

insert into gift_deliveries (position, value, is_default, title, description, price) values
  (0, 'digital', true, 'E-Carte Digitale', 'Envoi rapide par email (PDF haute définition à imprimer ou transférer).', 'Inclus'),
  (1, 'physical', false, 'Carte Cadeau Physique', 'Carte élégante dans une enveloppe personnalisée, expédition rapide avec accusé de réception (La Poste).', '+ 15€');

insert into gift_form (page_slug, submit_label, success_message, card_brand, card_caption) values
  ('carte-cadeau', 'Envoyer le formulaire', 'Merci ! Votre demande a bien été envoyée. Je vous recontacte très vite par email pour finaliser votre carte cadeau.', 'Roger Moniz.', 'CARTE CADEAU');

commit;
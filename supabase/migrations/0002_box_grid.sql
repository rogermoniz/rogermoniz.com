-- =============================================================================
-- In The Box: the montage preview grid inside each pricing card, and the
-- square hero crop that page uses instead of the usual 3/4.
-- =============================================================================

-- The hero marquee crop is per page: In The Box uses squares to echo the boxes.
alter table hero_marquee
  add column if not exists image_aspect text not null default '3 / 4';

update hero_marquee set image_aspect = '1 / 1' where page_slug = 'in-the-box';

-- A pricing card may show a grid previewing how many cases the montage has.
-- `box_grid_large` holds the zero based indexes of the cells that span 2x2.
alter table pricing_cards
  add column if not exists box_grid_columns integer,
  add column if not exists box_grid_cells   integer,
  add column if not exists box_grid_large   integer[];

update pricing_cards set box_grid_columns = 3, box_grid_cells = 9,  box_grid_large = '{}'
  where page_slug = 'in-the-box' and position = 0;
update pricing_cards set box_grid_columns = 4, box_grid_cells = 13, box_grid_large = '{5}'
  where page_slug = 'in-the-box' and position = 1;
update pricing_cards set box_grid_columns = 5, box_grid_cells = 19, box_grid_large = '{1,15}'
  where page_slug = 'in-the-box' and position = 2;
update pricing_cards set box_grid_columns = 6, box_grid_cells = 24, box_grid_large = '{4,6,15,17}'
  where page_slug = 'in-the-box' and position = 3;

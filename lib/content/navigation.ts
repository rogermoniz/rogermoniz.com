/** Navigation shapes. The values live in the database, see content/source. */

export type NavLink = {
  label: string;
  href: string;
};

export type NavItem = NavLink & {
  children?: readonly NavLink[];
};

export type SiteIdentity = {
  name: string;
  location: string;
  email: string;
  phone: string;
  phoneDisplay: string;
  instagram: string;
  logo: string;
};

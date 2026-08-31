/**
 * The two themes, and the colour the browser paints its own bars with.
 *
 * A plain module rather than part of the theme provider: the document shell is
 * a server component, and a value exported from a `"use client"` module reaches
 * it as a reference to that module rather than as the value, which is how the
 * meta tag first shipped with an empty colour.
 *
 * These two mirror `--theme-bg` in each theme. They are a meta attribute rather
 * than CSS, so they cannot read the token, and they have to move with it.
 */
export type Theme = "light" | "dark";

export const THEME_COLOR: Record<Theme, string> = {
  light: "#ffffff",
  dark: "#000000",
};

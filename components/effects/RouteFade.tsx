"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * True once a page has been mounted, so the next one is known to be an arrival
 * from inside the site rather than the page the visitor opened. A real page
 * load resets it.
 */
let arrived = false;

/**
 * A page fades in when you open it from another one.
 *
 * The address is the key, so a different page replaces this element and its
 * animation runs from the start. Only the opacity moves: the page comes up out
 * of whatever the theme's background is, which is why it reads the same in the
 * light theme and the dark one without either being named here.
 *
 * **The page you arrive on carries no animation at all.** An element that
 * starts at nothing and is animated up to full is a blank page for as long as
 * the animation has not run, and it does not run in a tab nobody is looking
 * at, which includes the headless browsers that render this site for search.
 * Fading only between pages keeps the first paint of every address unanimated
 * and therefore never invisible.
 *
 * The page being left goes at once rather than fading out. Fading it out means
 * holding the click until the animation is over, and a link that waits before
 * it does anything is worse than a page that arrives softly.
 */
export function RouteFade({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fade = arrived;

  useEffect(() => {
    arrived = true;
  }, []);

  return (
    <div key={pathname} className={fade ? "animate-route-fade" : undefined}>
      {children}
    </div>
  );
}

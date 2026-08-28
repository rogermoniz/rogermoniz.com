"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type RevealVariant = "fade-up" | "text";

const OFFSET: Record<RevealVariant, string> = {
  "fade-up": "translateY(48px)",
  text: "translateY(28px)",
};

/**
 * Scroll reveal. One observer per element, unobserved the moment it fires, so
 * nothing keeps observing content the reader has already passed.
 */
export function Reveal({
  as: Tag = "div",
  variant = "fade-up",
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  variant?: RevealVariant;
  className?: string;
  children: ReactNode;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : OFFSET[variant],
        transition:
          "opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)",
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

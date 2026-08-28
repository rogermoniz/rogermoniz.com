import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** Bordered pill label. Uses the shared tactile surface. */
export function Eyebrow({
  children,
  className = "",
  plain = false,
}: {
  children: ReactNode;
  className?: string;
  plain?: boolean;
}) {
  const base =
    "mb-6 inline-block rounded-[30px] px-3 py-[5px] font-body text-[0.45rem] tracking-[2.5px] uppercase";
  return (
    <span
      className={
        plain
          ? `${base} border border-white text-white ${className}`
          : `${base} tactile ${className}`
      }
    >
      {children}
    </span>
  );
}

export function DisplayHeading({
  children,
  className = "",
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={`m-0 font-display text-[clamp(2.5rem,7vw,7rem)] leading-[1.02] font-bold tracking-[-0.04em] text-ink uppercase ${className}`}
    >
      {children}
    </Tag>
  );
}

export function SectionHeading2({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`m-0 font-display text-[clamp(2rem,4.5vw,4rem)] leading-[1.12] font-bold tracking-[-0.04em] text-ink uppercase ${className}`}
    >
      {children}
    </h2>
  );
}

/** The italic serif line that sits under a heading. */
export function HeadingSub({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`mt-[clamp(0.75rem,1.5vw,1.25rem)] block font-body text-[clamp(0.95rem,1.3vw,1.2rem)] leading-[1.45] font-light text-muted normal-case italic ${className}`}
    >
      {children}
    </span>
  );
}

export function Container({
  children,
  className = "",
  as: Tag = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "footer";
} & Omit<ComponentPropsWithoutRef<"section">, "className" | "children">) {
  return (
    <Tag className={`mx-auto w-full max-w-[1400px] px-[var(--padding-x)] ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

import { Reveal } from "@/components/effects/Reveal";

/**
 * A section title with the rule that runs off to the right of it. The title
 * holds its line, so the rule takes whatever width is left.
 */
export function RuledHeading({ children }: { children: React.ReactNode }) {
  return (
    <Reveal className="mb-[clamp(2.25rem,4vw,3.5rem)] flex items-center gap-[clamp(1rem,2vw,1.75rem)]">
      <h2 className="m-0 font-display text-[clamp(1.7rem,4vw,3.25rem)] leading-[1.05] font-bold tracking-[-0.03em] whitespace-nowrap text-ink uppercase">
        {children}
      </h2>
      <span className="h-px flex-1 bg-edge" />
    </Reveal>
  );
}

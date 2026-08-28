import { Reveal } from "@/components/effects/Reveal";
import { SectionHeading2 } from "@/components/primitives/Typography";

/** A section title with the rule that runs off to the right of it. */
export function RuledHeading({ children }: { children: React.ReactNode }) {
  return (
    <Reveal className="mb-12 flex items-center gap-6">
      <SectionHeading2>{children}</SectionHeading2>
      <span className="h-px grow bg-edge" />
    </Reveal>
  );
}

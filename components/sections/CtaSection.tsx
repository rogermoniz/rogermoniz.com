import { BubbleButton } from "@/components/primitives/BubbleButton";
import { Container } from "@/components/primitives/Typography";

export function CtaSection({ label, href }: { label: string; href: string }) {
  return (
    <section className="relative overflow-hidden bg-surface py-[var(--band)] text-center">
      <Container>
        <BubbleButton href={href}>{label}</BubbleButton>
      </Container>
    </section>
  );
}

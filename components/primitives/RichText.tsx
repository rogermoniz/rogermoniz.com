import Link from "next/link";
import { Fragment } from "react";
import type { Span } from "@/lib/content/types";

/**
 * Renders inline runs as real elements. The content model carries emphasis and
 * links as data, so prose never has to be handed to the DOM as HTML.
 */
export function RichText({ spans }: { spans: readonly Span[] }) {
  return (
    <>
      {spans.map((span, index) => {
        if (typeof span === "string") return <Fragment key={index}>{span}</Fragment>;
        if ("break" in span) return <br key={index} />;

        let node = <>{span.text}</>;
        if (span.bold) node = <strong className="font-medium text-ink">{node}</strong>;
        if (span.italic) node = <em>{node}</em>;

        if (span.href) {
          const external = /^https?:|^mailto:|^tel:/.test(span.href);
          return external ? (
            <a
              key={index}
              href={span.href}
              {...(span.href.startsWith("http")
                ? { target: "_blank", rel: "noreferrer noopener" }
                : {})}
              className="text-accent underline underline-offset-2 transition-colors hover:text-accent-hover"
            >
              {node}
            </a>
          ) : (
            <Link
              key={index}
              href={span.href}
              className="text-accent underline underline-offset-2 transition-colors hover:text-accent-hover"
            >
              {node}
            </Link>
          );
        }

        return <Fragment key={index}>{node}</Fragment>;
      })}
    </>
  );
}

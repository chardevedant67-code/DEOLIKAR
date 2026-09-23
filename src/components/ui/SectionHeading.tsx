import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  id?: string;
}

export function SectionHeading({
  eyebrow,
  heading,
  subheading,
  align = "left",
  tone = "light",
  id,
}: SectionHeadingProps) {
  const centered = align === "center";
  const dark = tone === "dark";

  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <Reveal>
        {eyebrow ? (
          <p
            className={`tracking-caps flex items-center gap-3 text-xs font-semibold ${
              centered ? "justify-center" : ""
            } ${dark ? "text-royal-300" : "text-royal-600"}`}
          >
            <span aria-hidden className={`h-px w-8 ${dark ? "bg-royal-300/50" : "bg-royal-600/40"}`} />
            {eyebrow}
            {centered ? <span aria-hidden className={`h-px w-8 ${dark ? "bg-royal-300/50" : "bg-royal-600/40"}`} /> : null}
          </p>
        ) : null}
        <h2
          id={id}
          className={`h-section mt-4 text-[clamp(1.9rem,1.3rem+2.6vw,3.15rem)] ${dark ? "text-white" : "text-navy-950"}`}
        >
          {heading}
        </h2>
        {subheading ? (
          <p className={`mt-4 text-base leading-relaxed sm:text-lg ${dark ? "text-white/70" : "text-ink-600"}`}>
            {subheading}
          </p>
        ) : null}
      </Reveal>
    </div>
  );
}

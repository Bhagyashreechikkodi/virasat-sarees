interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && (
        <p
          className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
            light ? "text-rose/80" : "text-rose"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-2 text-[1.65rem] font-semibold uppercase leading-tight tracking-[0.08em] sm:text-[1.85rem] ${
          light ? "text-paper" : "text-charcoal"
        }`}
      >
        {title}
      </h2>
      {align === "center" && (
        <div className="mx-auto my-4 h-px w-12 bg-border" aria-hidden />
      )}
      {subtitle && (
        <p
          className={`mt-2 max-w-md text-sm leading-relaxed ${
            light ? "text-white/65" : "text-muted"
          } ${align === "center" ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

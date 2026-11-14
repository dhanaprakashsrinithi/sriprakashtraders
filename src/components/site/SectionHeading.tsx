import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  light = false,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={cn("reveal max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className={cn("eyebrow", light ? "text-gold" : "text-forest")}>{eyebrow}</p>
      <h2
        className={cn(
          "mt-3 text-3xl font-semibold leading-tight md:text-5xl",
          light ? "text-forest-foreground" : "text-forest-deep",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn("mt-4 text-lg leading-relaxed", light ? "text-forest-foreground/75" : "text-muted-foreground")}>
          {intro}
        </p>
      )}
    </div>
  );
}

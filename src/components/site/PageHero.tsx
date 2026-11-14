import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-forest-deep">
      <img
        src={image}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        width={1600}
        height={1000}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-hero" />
      <div className="container-site py-20 md:py-28">
        <p className="eyebrow animate-rise text-gold">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl animate-rise text-4xl font-semibold leading-[1.08] text-forest-foreground md:text-6xl [animation-delay:80ms]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl animate-rise text-lg text-forest-foreground/80 [animation-delay:160ms]">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8 animate-rise [animation-delay:240ms]">{children}</div>}
      </div>
    </section>
  );
}

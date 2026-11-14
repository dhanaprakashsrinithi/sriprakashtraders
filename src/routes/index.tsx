import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { TradeButtons } from "@/components/site/TradeButtons";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/site/ProductCard";
import { HighlightsStrip, TradeOptions, WholesaleSection, WhyChoose, CtaBand } from "@/components/site/Sections";
import { productsQueryOptions } from "@/lib/products.functions";
import { whatsappLink } from "@/lib/site";
import { useReveal } from "@/hooks/use-reveal";
import heroImg from "@/assets/hero-maize-warehouse.jpg";
import sackImg from "@/assets/maize-sack.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sri Prakash Traders — Bulk Maize Buying & Selling in Tamil Nadu" },
      {
        name: "description",
        content:
          "We buy maize in bulk from farmers, traders and suppliers, and supply quality maize to industries and businesses across Tamil Nadu and India.",
      },
      { property: "og:title", content: "Sri Prakash Traders — Your Trusted Partner for Maize Trading" },
      {
        property: "og:description",
        content: "Bulk maize buying and selling. Sell maize to us or buy maize from us.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions()),
  component: Home,
});

function Home() {
  const { data: products } = useSuspenseQuery(productsQueryOptions());
  useReveal(products);
  return (
    <>
      <section className="relative isolate overflow-hidden bg-forest-deep">
        <img
          src={heroImg}
          alt="Heap of glossy golden yellow maize kernels in a wholesale warehouse"
          width={1920}
          height={1088}
          fetchPriority="high"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        <div className="container-site pb-36 pt-20 md:pb-48 md:pt-32">
          <p className="eyebrow animate-rise text-gold">Bulk Maize Buying &amp; Selling · Tamil Nadu &amp; All India</p>
          <h1 className="mt-5 max-w-3xl animate-rise text-4xl font-semibold leading-[1.05] text-forest-foreground sm:text-5xl md:text-7xl [animation-delay:80ms]">
            Your Trusted Partner for Maize Trading
          </h1>
          <p className="mt-6 max-w-xl animate-rise text-lg text-forest-foreground/85 md:text-xl [animation-delay:160ms]">
            We buy maize in bulk quantities from farmers, traders and suppliers — and supply quality
            maize to industries and businesses.
          </p>
          <TradeButtons tone="dark" arrows className="mt-10 animate-rise [animation-delay:240ms]">
            <Button asChild variant="whatsapp" size="xl">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-5 w-5" /> WhatsApp Us
              </a>
            </Button>
          </TradeButtons>
        </div>
      </section>

      <HighlightsStrip />

      <TradeOptions />

      <section className="bg-cream py-20 md:py-28">
        <div className="container-site">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Our Maize"
              title="Maize we buy and supply"
              intro="Yellow maize is our core commodity, supplied in wholesale quantities. White maize is available subject to season."
            />
            <Button asChild variant="outline" size="lg" className="reveal self-start md:self-auto">
              <Link to="/products">
                View all products <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <WholesaleSection />

      <section className="py-20 md:py-28">
        <div className="container-site grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          <img
            src={sackImg}
            alt="Jute sack filled with yellow maize kernels"
            loading="lazy"
            width={1200}
            height={1408}
            className="reveal aspect-[4/5] w-full max-w-md rounded-2xl object-cover shadow-card"
          />
          <div>
            <SectionHeading eyebrow="About Us" title="A maize-focused wholesale trading business" />
            <p className="reveal mt-6 text-lg leading-relaxed text-muted-foreground">
              Sri Prakash Traders is a wholesale agricultural commodity trading business specializing in
              maize. We buy maize in bulk from farmers, traders and suppliers, and supply yellow maize to
              bulk buyers, poultry feed manufacturers, cattle feed industries and other agricultural
              commodity businesses.
            </p>
            <Button asChild variant="link" className="reveal mt-4 px-0 text-base">
              <Link to="/about">
                Read more about us <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <WhyChoose />
      <CtaBand />
    </>
  );
}

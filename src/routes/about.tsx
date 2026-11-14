import { createFileRoute, Link } from "@tanstack/react-router";
import { Factory, Wheat, Beef, Building, Tractor, Store, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TradeButtons } from "@/components/site/TradeButtons";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { WhyChoose, CtaBand } from "@/components/site/Sections";
import { useReveal } from "@/hooks/use-reveal";
import warehouseImg from "@/assets/warehouse-stock.jpg";
import sackImg from "@/assets/maize-sack.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Sri Prakash Traders, Wholesale Maize Trading" },
      {
        name: "description",
        content:
          "Sri Prakash Traders buys maize in bulk from farmers, traders and suppliers, and supplies maize to bulk buyers and feed manufacturers.",
      },
      { property: "og:title", content: "About Sri Prakash Traders" },
      {
        property: "og:description",
        content: "A bulk maize buying and supplying business.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const BUY_FROM = [
  { icon: Tractor, label: "Farmers" },
  { icon: Store, label: "Maize traders" },
  { icon: Truck, label: "Suppliers & aggregators" },
];

const WHO = [
  { icon: Building, label: "Bulk buyers" },
  { icon: Wheat, label: "Poultry feed manufacturers" },
  { icon: Beef, label: "Cattle feed industries" },
  { icon: Factory, label: "Agricultural commodity businesses" },
];

function About() {
  useReveal();
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Built around one commodity: maize"
        subtitle="We buy maize in bulk and supply it to industries and businesses."
        image={warehouseImg}
      />
      <section className="py-20 md:py-28">
        <div className="container-site grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionHeading eyebrow="Who we are" title="Sri Prakash Traders" />
            <p className="reveal mt-6 text-lg leading-relaxed text-foreground/85">
              Sri Prakash Traders is a wholesale agricultural commodity trading business specializing in
              maize. We buy maize in bulk quantities from farmers, traders and suppliers, and supply yellow
              maize to bulk buyers, poultry feed manufacturers, cattle feed industries and other
              agricultural commodity businesses. Our goal is to build long-term
              business relationships through quality-focused sourcing, reliable communication and
              professional wholesale trading.
            </p>
            <div className="reveal mt-10">
              <p className="eyebrow text-forest">Who we buy from</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {BUY_FROM.map((w) => (
                  <li key={w.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-gold-soft text-forest">
                      <w.icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-semibold text-forest-deep">{w.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal mt-8">
              <p className="eyebrow text-forest">Who we supply</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {WHO.map((w) => (
                  <li key={w.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-gold-soft text-forest">
                      <w.icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-semibold text-forest-deep">{w.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <TradeButtons tone="light" size="lg" className="reveal mt-10">
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </TradeButtons>
          </div>
          <img
            src={sackImg}
            alt="Yellow maize in a jute sack"
            loading="lazy"
            width={1200}
            height={1408}
            className="reveal aspect-[4/5] w-full rounded-2xl object-cover shadow-card"
          />
        </div>
      </section>
      <WhyChoose />
      <CtaBand />
    </>
  );
}

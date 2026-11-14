import { createFileRoute, Link } from "@tanstack/react-router";
import { Wheat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { TradeButtons } from "@/components/site/TradeButtons";
import { SectionHeading } from "@/components/site/SectionHeading";
import { WholesaleSection, CtaBand } from "@/components/site/Sections";
import { useReveal } from "@/hooks/use-reveal";
import truckImg from "@/assets/maize-truck.jpg";
import warehouseImg from "@/assets/warehouse-stock.jpg";

export const Route = createFileRoute("/wholesale-supply")({
  head: () => ({
    meta: [
      { title: "Bulk Maize Supply — Wholesale Stockist | Sri Prakash Traders" },
      {
        name: "description",
        content:
          "Your reliable partner for bulk maize supply. Bulk order enquiries, wholesale pricing and regular supply requirements across Tamil Nadu and India.",
      },
      { property: "og:title", content: "Your Reliable Partner for Bulk Maize Supply" },
      {
        property: "og:description",
        content: "Bulk order enquiries, wholesale pricing requests and regular maize supply.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Wholesale,
});

const STEPS = [
  { n: "01", title: "Share your requirement", text: "Maize type, quantity with your preferred unit and delivery location — by form, phone or WhatsApp." },
  { n: "02", title: "Receive availability & price", text: "We confirm current stock availability and share the wholesale price for your order." },
  { n: "03", title: "Confirm & arrange dispatch", text: "Once terms are agreed, we coordinate loading and dispatch to your location." },
  { n: "04", title: "Build regular supply", text: "For ongoing needs, we discuss a regular supply arrangement that fits your schedule." },
];

function Wholesale() {
  useReveal();
  return (
    <>
      <PageHero
        eyebrow="Wholesale Supply"
        title="Bulk maize supply for serious buyers"
        subtitle="We supply maize in bulk to businesses across India — and buy maize in bulk from farmers, traders and suppliers."
        image={truckImg}
      >
        <TradeButtons tone="dark" />
      </PageHero>
      <WholesaleSection withCta={false} />
      <section className="py-20 md:py-28">
        <div className="container-site">
          <SectionHeading
            eyebrow="How it works"
            title="From enquiry to dispatch"
            intro="A straightforward process designed for business buyers."
            align="center"
          />
          <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li
                key={s.n}
                className="reveal rounded-2xl border border-border bg-card p-7 shadow-card"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="font-display text-4xl font-semibold text-gold">{s.n}</span>
                <h3 className="mt-4 text-xl font-semibold text-forest-deep">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="pb-16">
        <div className="container-site">
          <div className="reveal flex flex-col items-start gap-6 rounded-3xl border border-border bg-cream p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-forest text-gold">
                <Wheat className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-2xl font-semibold text-forest-deep">Have maize to sell? We buy in bulk too.</h2>
                <p className="mt-1 text-muted-foreground">
                  Farmers, maize traders and suppliers can share their available quantity and expected price.
                </p>
              </div>
            </div>
            <Button asChild variant="gold" size="lg" className="sell-glow shrink-0 font-bold">
              <Link to="/sell-maize">Sell Maize to Us</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="pb-4">
        <div className="container-site">
          <img
            src={warehouseImg}
            alt="Wholesale maize stock stored in a warehouse"
            loading="lazy"
            width={1600}
            height={1008}
            className="reveal aspect-[21/9] w-full rounded-3xl object-cover shadow-card"
          />
        </div>
      </section>
      <CtaBand />
    </>
  );
}

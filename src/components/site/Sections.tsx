import { Link } from "@tanstack/react-router";
import {
  Boxes,
  Handshake,
  MessagesSquare,
  PackageCheck,
  Repeat,
  ShieldCheck,
  Truck,
  Users,
  Warehouse,
  BadgeIndianRupee,
  Sprout,
  ArrowRight,
  Check,
  ShoppingCart,
  Wheat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TradeButtons } from "./TradeButtons";
import { SectionHeading } from "./SectionHeading";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { SELL_WHATSAPP_MESSAGE, whatsappLink } from "@/lib/site";
import warehouseImg from "@/assets/warehouse-stock.jpg";
import truckImg from "@/assets/maize-truck.jpg";
import farmersImg from "@/assets/maize-farmers-selling.jpg";

export const HIGHLIGHTS = [
  { icon: Wheat, title: "We Buy Maize in Bulk", text: "From farmers, maize traders and suppliers." },
  { icon: Truck, title: "We Supply Maize in Bulk", text: "To industries, manufacturers and bulk buyers." },
  { icon: ShieldCheck, title: "Quality-Focused Sourcing", text: "Careful sourcing with attention to grain quality." },
  { icon: Warehouse, title: "Wholesale Maize Stockist", text: "Dedicated to maize trading in wholesale volumes." },
];

export function HighlightsStrip() {
  return (
    <section className="relative z-10 -mt-14 md:-mt-20">
      <div className="container-site">
        <div className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-card sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((h, i) => (
            <div
              key={h.title}
              className="reveal flex gap-4 border-border p-6 md:p-7 [&:not(:last-child)]:border-b sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:[&:not(:last-child)]:border-r"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold-soft text-forest">
                <h.icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-sans text-base font-bold text-forest-deep">{h.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{h.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const WHY = [
  { icon: Sprout, title: "Specialised maize wholesale trading", text: "Maize is our core business — not one product among hundreds." },
  { icon: Boxes, title: "Bulk buying and selling", text: "We handle bulk quantities whether you are selling maize or buying it." },
  { icon: ShieldCheck, title: "Quality-focused business approach", text: "Sourcing decisions made with grain quality in mind." },
  { icon: MessagesSquare, title: "Transparent communication", text: "Clear updates on availability, pricing and dispatch." },
  { icon: Handshake, title: "Long-term trading relationships", text: "We aim to be a dependable partner, season after season." },
  { icon: Users, title: "Customer-focused service", text: "Responsive support by phone, WhatsApp and email." },
];

export function WhyChoose() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container-site">
        <SectionHeading
          eyebrow="Why Sri Prakash Traders"
          title="Why buyers choose us for maize"
          intro="A focused maize trading business that buys and supplies in bulk, built on reliable communication and professional dealing."
          align="center"
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w, i) => (
            <div
              key={w.title}
              className="reveal rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-card"
              style={{ transitionDelay: `${(i % 3) * 80}ms` }}
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-forest text-gold">
                <w.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-forest-deep">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const WHOLESALE_POINTS = [
  { icon: Boxes, title: "Bulk order enquiries", text: "Share your quantity and location — we respond with what we can supply." },
  { icon: BadgeIndianRupee, title: "Wholesale pricing requests", text: "Current wholesale rates shared on enquiry, based on quantity and delivery." },
  { icon: Repeat, title: "Regular supply requirements", text: "Discuss recurring monthly or seasonal supply for your operations." },
  { icon: PackageCheck, title: "Quality-conscious sourcing", text: "Maize sourced with attention to grain condition and consistency." },
  { icon: Handshake, title: "Buyer & supplier partnerships", text: "We work with both buyers and suppliers to keep maize moving." },
];

export function WholesaleSection({ withCta = true }: { withCta?: boolean }) {
  return (
    <section className="overflow-hidden bg-gradient-forest py-20 md:py-28">
      <div className="container-site grid items-center gap-14 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Wholesale Stockist"
            title="Your Reliable Partner for Bulk Maize Supply"
            intro="Sri Prakash Traders buys maize in bulk and supplies it to businesses. Whether you need a single large consignment or a regular supply arrangement, talk to us."
            light
          />
          <ul className="mt-10 space-y-5">
            {WHOLESALE_POINTS.map((p) => (
              <li key={p.title} className="reveal flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-forest-foreground/10 text-gold">
                  <p.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-sans text-base font-bold text-forest-foreground">{p.title}</h3>
                  <p className="mt-0.5 text-sm text-forest-foreground/70">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
          {withCta && (
            <TradeButtons tone="dark" className="mt-10">
              <Button asChild variant="ghost" size="xl" className="text-forest-foreground/85 underline-offset-4 hover:bg-transparent hover:text-gold hover:underline">
                <Link to="/wholesale-supply">How bulk supply works</Link>
              </Button>
            </TradeButtons>
          )}
        </div>
        <div className="reveal relative">
          <img
            src={warehouseImg}
            alt="Maize sacks stacked in a large warehouse"
            loading="lazy"
            width={1600}
            height={1008}
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-card"
          />
          <img
            src={truckImg}
            alt="Truck loaded with maize sacks at a warehouse dock"
            loading="lazy"
            width={1600}
            height={1008}
            className="absolute -bottom-10 -left-6 hidden aspect-[4/3] w-1/2 rounded-xl border-4 border-forest-deep object-cover shadow-card md:block"
          />
        </div>
      </div>
    </section>
  );
}

const SELL_POINTS = [
  "Farmers with harvested maize",
  "Maize traders and commission agents",
  "Suppliers and aggregators with bulk stock",
];
const BUY_POINTS = [
  "Poultry and cattle feed manufacturers",
  "Wholesalers and commodity businesses",
  "Companies with bulk or regular requirements",
];

/** Two equally weighted options: sell maize to us, or buy maize from us. */
export function TradeOptions() {
  const options = [
    {
      key: "sell",
      icon: Wheat,
      eyebrow: "Option 1 · For farmers, traders & suppliers",
      title: "We Buy Maize",
      text: "Have maize to sell in bulk? Share your available quantity, location and expected selling price, and our team will get in touch.",
      points: SELL_POINTS,
      image: farmersImg,
      alt: "Farmers unloading sacks of yellow maize at a procurement yard",
      cta: { to: "/sell-maize" as const, label: "Sell Maize to Us", highlight: true },
      wa: whatsappLink(SELL_WHATSAPP_MESSAGE),
    },
    {
      key: "buy",
      icon: ShoppingCart,
      eyebrow: "Option 2 · For companies & bulk buyers",
      title: "We Supply Maize",
      text: "Need maize in bulk? Tell us the quantity you require and your delivery location, and we'll respond with current availability and pricing.",
      points: BUY_POINTS,
      image: truckImg,
      alt: "Truck loaded with maize sacks ready for dispatch",
      cta: { to: "/request-price" as const, label: "Buy Maize from Us", highlight: false },
      wa: whatsappLink(),
    },
  ];
  return (
    <section id="trade" className="py-20 md:py-28">
      <div className="container-site">
        <SectionHeading
          eyebrow="Bulk Maize Buying & Selling"
          title="Two ways to trade maize with us"
          intro="Whether you are selling maize or buying it, Sri Prakash Traders handles bulk quantities with clear, direct communication."
          align="center"
        />
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {options.map((o, i) => (
            <article
              key={o.key}
              className="reveal flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="relative">
                <img src={o.image} alt={o.alt} loading="lazy" width={1600} height={1008} className="aspect-[16/9] w-full object-cover" />
                <span className="absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-xl bg-forest-deep text-gold shadow-card">
                  <o.icon className="h-6 w-6" />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-7 md:p-9">
                <p className="eyebrow text-forest">{o.eyebrow}</p>
                <h3 className="mt-3 text-3xl font-semibold text-forest-deep md:text-4xl">{o.title}</h3>
                <p className="mt-3 text-muted-foreground">{o.text}</p>
                <ul className="mt-6 space-y-2.5">
                  {o.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-foreground/85">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" /> {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap gap-3 pt-8">
                  <Button
                    asChild
                    variant={o.cta.highlight ? "gold" : "default"}
                    size="lg"
                    className={o.cta.highlight ? "sell-glow font-bold" : undefined}
                  >
                    <Link to={o.cta.to}>
                      {o.cta.label} <ArrowRight />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href={o.wa} target="_blank" rel="noopener noreferrer">
                      <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="py-20 md:py-24">
      <div className="container-site">
        <div className="reveal relative overflow-hidden rounded-3xl bg-gradient-gold px-8 py-14 text-center md:px-16">
          <h2 className="mx-auto max-w-3xl text-3xl font-semibold text-gold-foreground md:text-5xl">
            Buying or selling maize in bulk? Talk to us today.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gold-foreground/80">
            Tell us your quantity, unit and location. We'll get back to you promptly.
          </p>
          <TradeButtons tone="gold" className="mt-8 justify-center">
            <Button asChild variant="whatsapp" size="xl">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-5 w-5" /> WhatsApp Us
              </a>
            </Button>
          </TradeButtons>
        </div>
      </div>
    </section>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { TradeButtons } from "@/components/site/TradeButtons";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { SITE, mailLink, telLink, whatsappLink } from "@/lib/site";
import warehouseImg from "@/assets/warehouse-stock.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Sri Prakash Traders — Phone, WhatsApp & Email" },
      {
        name: "description",
        content:
          "Contact Sri Prakash Traders for wholesale maize. Call or WhatsApp +91 8838811466 or email sriprakashtradersco@gmail.com.",
      },
      { property: "og:title", content: "Contact Sri Prakash Traders" },
      {
        property: "og:description",
        content: "Call, WhatsApp or email us to sell maize to us or buy maize from us in bulk.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const cards = [
    { icon: Phone, label: "Phone", value: SITE.phoneDisplay, href: telLink, cta: "Call now", variant: "default" as const, external: false },
    { icon: WhatsAppIcon, label: "WhatsApp", value: SITE.phoneDisplay, href: whatsappLink(), cta: "Chat on WhatsApp", variant: "whatsapp" as const, external: true },
    { icon: Mail, label: "Email", value: SITE.email, href: mailLink, cta: "Send email", variant: "gold" as const, external: false },
  ];
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Talk to us about buying or selling maize"
        subtitle="We respond to bulk maize buying and selling enquiries from across Tamil Nadu and India."
        image={warehouseImg}
      />
      <section className="py-16 md:py-24">
        <div className="container-site">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-semibold text-forest-deep md:text-4xl">Sri Prakash Traders</h2>
            <p className="mt-2 text-muted-foreground">Bulk Maize Buyer, Stockist &amp; Supplier · {SITE.domain}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {cards.map((c) => (
              <div key={c.label} className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-card">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-gold-soft text-forest">
                  <c.icon className="h-6 w-6" />
                </span>
                <p className="eyebrow mt-5 text-muted-foreground">{c.label}</p>
                <p className="mt-2 break-all font-display text-xl font-semibold text-forest-deep">{c.value}</p>
                <Button asChild variant={c.variant} size="lg" className="mt-6 w-full">
                  <a href={c.href} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {c.cta}
                  </a>
                </Button>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-14 max-w-3xl rounded-2xl bg-gradient-forest p-8 text-center text-forest-foreground md:p-10">
            <h3 className="text-2xl font-semibold">Prefer to send details in writing?</h3>
            <p className="mt-2 text-forest-foreground/75">
              Use our enquiry form to share your quantity, unit and location.
            </p>
            <TradeButtons tone="dark" className="mt-6 justify-center" />
          </div>
        </div>
      </section>
    </>
  );
}

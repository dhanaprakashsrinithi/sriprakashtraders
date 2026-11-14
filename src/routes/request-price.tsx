import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { SITE, mailLink, telLink, whatsappLink } from "@/lib/site";
import heroImg from "@/assets/maize-sack.jpg";

type Search = { type?: string };

export const Route = createFileRoute("/request-price")({
  validateSearch: (search: Record<string, unknown>): Search =>
    typeof search["type"] === "string" ? { type: search["type"] } : {},
  head: () => ({
    meta: [
      { title: "Buy Maize in Bulk — Request Wholesale Price | Sri Prakash Traders" },
      {
        name: "description",
        content:
          "Buy yellow or white maize in bulk from Sri Prakash Traders. Share your required quantity, unit and delivery location for a wholesale price."
      },
      { property: "og:title", content: "Buy Maize from Us — Request a Wholesale Price" },
      {
        property: "og:description",
        content: "Get current availability and wholesale pricing for bulk maize orders.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RequestPrice,
});

function RequestPrice() {
  const { type } = Route.useSearch();
  const defaultType = type === "white-maize" ? "White Maize" : type === "yellow-maize" ? "Yellow Maize" : undefined;
  return (
    <>
      <PageHero
        eyebrow="Buy Maize from Us"
        title="We supply quality maize in bulk"
        subtitle="For companies, manufacturers, wholesalers and bulk buyers. Share your requirement and we'll respond with current availability and wholesale pricing."
        image={heroImg}
      />
      <section className="py-16 md:py-24">
        <div className="container-site grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <EnquiryForm defaultType={defaultType} defaultEnquiryType="buy" />
          <aside className="space-y-5">
            <div className="rounded-2xl bg-gradient-forest p-7 text-forest-foreground">
              <h2 className="text-2xl font-semibold">Prefer to talk?</h2>
              <p className="mt-2 text-sm text-forest-foreground/75">
                Reach us directly for urgent bulk requirements.
              </p>
              <div className="mt-6 space-y-3">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg bg-forest-foreground/10 p-3 hover:bg-forest-foreground/15">
                  <WhatsAppIcon className="h-5 w-5 text-gold" /> WhatsApp {SITE.phoneDisplay}
                </a>
                <a href={telLink} className="flex items-center gap-3 rounded-lg bg-forest-foreground/10 p-3 hover:bg-forest-foreground/15">
                  <Phone className="h-5 w-5 text-gold" /> Call {SITE.phoneDisplay}
                </a>
                <a href={mailLink} className="flex items-center gap-3 break-all rounded-lg bg-forest-foreground/10 p-3 hover:bg-forest-foreground/15">
                  <Mail className="h-5 w-5 shrink-0 text-gold" /> {SITE.email}
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-cream p-7">
              <h3 className="text-lg font-semibold text-forest-deep">Helpful to include</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                <li>Quantity and unit (MT, tonnes, quintals or kg)</li>
                <li>Delivery city and state</li>
                <li>One-time or regular supply</li>
                <li>Preferred delivery timeline</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

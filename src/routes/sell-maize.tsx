import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, Scale, MapPin, MessagesSquare, Handshake } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { SITE, SELL_WHATSAPP_MESSAGE, mailLink, telLink, whatsappLink } from "@/lib/site";
import heroImg from "@/assets/maize-farmers-selling.jpg";

export const Route = createFileRoute("/sell-maize")({
  head: () => ({
    meta: [
      { title: "Sell Maize in Bulk to Sri Prakash Traders | We Buy Maize" },
      {
        name: "description",
        content:
          "Farmers, maize traders and suppliers: sell your maize in bulk to Sri Prakash Traders. Share your quantity, location and expected price.",
      },
      { property: "og:title", content: "We Buy Maize in Bulk Quantities — Sri Prakash Traders" },
      {
        property: "og:description",
        content: "Have maize to sell? Send your available quantity and location and our team will contact you.",
      },
    ],
  }),
  component: SellMaize,
});

const STEPS = [
  { icon: Scale, title: "Share your quantity", text: "Tell us how much maize you have, in tonnes, quintals or kilograms." },
  { icon: MapPin, title: "Tell us where it is", text: "Your village or town, district and state." },
  { icon: MessagesSquare, title: "We contact you", text: "Our team calls back to discuss quality, price and timing." },
  { icon: Handshake, title: "Agree and trade", text: "Once terms are agreed, we finalise the purchase with you." },
];

function SellMaize() {
  const sellWa = whatsappLink(SELL_WHATSAPP_MESSAGE);
  return (
    <>
      <PageHero
        eyebrow="We Buy Maize"
        title="Sell your maize to us in bulk"
        subtitle="For farmers, maize traders and suppliers. Share your available quantity, location and expected selling price."
        image={heroImg}
      />
      <section className="border-b border-border bg-cream py-12">
        <ol className="container-site grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-forest text-gold">
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold text-gold-foreground/70">Step {i + 1}</p>
                <h2 className="font-sans text-base font-bold text-forest-deep">{s.title}</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="py-16 md:py-24">
        <div className="container-site grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <EnquiryForm defaultEnquiryType="sell" />
          <aside className="space-y-5">
            <div className="rounded-2xl bg-gradient-forest p-7 text-forest-foreground">
              <h2 className="text-2xl font-semibold">Prefer to talk?</h2>
              <p className="mt-2 text-sm text-forest-foreground/75">
                Call or WhatsApp us with your maize details.
              </p>
              <div className="mt-6 space-y-3">
                <a href={sellWa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg bg-forest-foreground/10 p-3 hover:bg-forest-foreground/15">
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
                <li>Maize type and quantity available</li>
                <li>Moisture level, if known</li>
                <li>Bagged or loose, and when it's ready</li>
                <li>Your expected price</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

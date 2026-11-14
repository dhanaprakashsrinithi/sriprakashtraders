import { Link } from "@tanstack/react-router";
import { Mail, Menu, Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "./Logo";
import { TradeButtons } from "./TradeButtons";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { SITE, mailLink, telLink, whatsappLink } from "@/lib/site";

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/products", label: "Our Products" },
  { to: "/wholesale-supply", label: "Wholesale Supply" },
  { to: "/contact", label: "Contact Us" },
  { to: "/admin", label: "Admin" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40">
      <div className="hidden bg-forest-deep text-forest-foreground md:block">
        <div className="container-site flex h-9 items-center justify-between text-xs">
          <span className="text-forest-foreground/75">
            We buy &amp; supply maize in bulk · Tamil Nadu &amp; across India
          </span>
          <div className="flex items-center gap-5">
            <a href={telLink} className="flex items-center gap-1.5 hover:text-gold">
              <Phone className="h-3.5 w-3.5" /> {SITE.phoneDisplay}
            </a>
            <a href={mailLink} className="flex items-center gap-1.5 hover:text-gold">
              <Mail className="h-3.5 w-3.5" /> {SITE.email}
            </a>
          </div>
        </div>
      </div>
      <div className="border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container-site flex h-18 items-center justify-between gap-6 py-3">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-forest data-[status=active]:text-forest data-[status=active]:font-semibold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <TradeButtons tone="light" size="default" className="hidden shrink-0 flex-nowrap gap-2 xl:flex" />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-background">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    activeOptions={{ exact: item.to === "/" }}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 font-display text-lg text-foreground hover:bg-muted data-[status=active]:bg-secondary data-[status=active]:text-forest"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <TradeButtons tone="light" size="lg" onNavigate={() => setOpen(false)} className="mt-8 flex-col flex-nowrap">
                <Button asChild variant="whatsapp" size="lg">
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp Us
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href={telLink}>
                    <Phone /> Call {SITE.phoneDisplay}
                  </a>
                </Button>
              </TradeButtons>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

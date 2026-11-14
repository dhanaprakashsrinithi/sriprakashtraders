import { Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { NAV } from "./SiteHeader";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { SITE, mailLink, telLink, whatsappLink } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-forest-deep text-forest-foreground">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-forest-foreground/70">
            Bulk maize buying and selling. We buy maize from farmers, traders and suppliers, and
            supply bulk buyers, poultry feed and cattle feed manufacturers across Tamil Nadu and India.
          </p>
        </div>
        <div>
          <h3 className="eyebrow text-gold">Explore</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="text-forest-foreground/80 hover:text-gold">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/sell-maize" className="text-forest-foreground/80 hover:text-gold">
                Sell Maize to Us
              </Link>
            </li>
            <li>
              <Link to="/request-price" className="text-forest-foreground/80 hover:text-gold">
                Buy Maize from Us
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="eyebrow text-gold">Contact</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a href={telLink} className="flex items-center gap-2 text-forest-foreground/80 hover:text-gold">
                <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-forest-foreground/80 hover:text-gold"
              >
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={mailLink} className="flex items-center gap-2 break-all text-forest-foreground/80 hover:text-gold">
                <Mail className="h-4 w-4 shrink-0" /> {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-forest-foreground/10">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-xs text-forest-foreground/60 md:flex-row">
          <span>© {new Date().getFullYear()} Sri Prakash Traders · {SITE.domain}</span>
          <Link to="/admin" className="hover:text-gold">
            Admin login
          </Link>
        </div>
      </div>
    </footer>
  );
}

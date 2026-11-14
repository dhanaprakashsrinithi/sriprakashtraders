import { Link } from "@tanstack/react-router";
import { Check, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { AVAILABILITY_LABELS, productWhatsappLink } from "@/lib/site";
import { productImage } from "@/lib/product-images";
import type { Product } from "@/lib/products.functions";
import { cn } from "@/lib/utils";

export function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const available = product.availability === "available";
  return (
    <article
      className={cn(
        "reveal group grid overflow-hidden rounded-2xl border border-border bg-card shadow-card",
        featured && "lg:grid-cols-2",
      )}
    >
      <div className={cn("relative overflow-hidden", featured ? "aspect-[4/3] lg:aspect-auto" : "aspect-[4/3]")}>
        <img
          src={productImage(product.slug)}
          alt={`${product.name} grains`}
          loading="lazy"
          width={1200}
          height={912}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span
          className={cn(
            "absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold",
            available ? "bg-forest text-forest-foreground" : "bg-gold-soft text-forest-deep",
          )}
        >
          {AVAILABILITY_LABELS[product.availability] ?? product.availability}
        </span>
      </div>
      <div className="flex flex-col p-7 md:p-9">
        <p className="eyebrow text-forest">{product.tagline}</p>
        <h3 className="mt-2 text-3xl font-semibold text-forest-deep">{product.name}</h3>
        <p className="mt-4 leading-relaxed text-muted-foreground">{product.description}</p>
        {product.uses.length > 0 && (
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {product.uses.map((u) => (
              <li key={u} className="flex items-start gap-2 text-sm text-foreground">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-soft text-forest">
                  <Check className="h-3 w-3" />
                </span>
                {u}
              </li>
            ))}
          </ul>
        )}
        {product.specifications.trim() !== "" && (
          <div className="mt-6 rounded-lg border border-border bg-muted p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-forest-deep">
              <ClipboardList className="h-4 w-4" /> Specifications
            </p>
            <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{product.specifications}</p>
          </div>
        )}
        <div className="mt-auto flex flex-wrap gap-3 pt-8">
          <Button asChild variant="gold" size="lg">
            <Link to="/request-price" search={{ type: product.slug }}>
              Request Price
            </Link>
          </Button>
          <Button asChild variant="whatsapp" size="lg">
            <a href={productWhatsappLink(product.name)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp Enquiry
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}

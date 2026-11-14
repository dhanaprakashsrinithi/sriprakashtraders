import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tone = "light" | "dark" | "gold";

/**
 * The site-wide pair of trade buttons. "Sell Maize to Us" is always first (left)
 * and highlighted; "Buy Maize from Us" always follows on its right.
 */
export function TradeButtons({
  tone = "light",
  size = "xl",
  arrows = false,
  className,
  onNavigate,
  children,
}: {
  tone?: Tone;
  size?: ButtonProps["size"];
  arrows?: boolean;
  className?: string;
  onNavigate?: () => void;
  children?: ReactNode;
}) {
  const sell =
    tone === "gold"
      ? { variant: "default" as const, className: "sell-glow font-bold [--glow:var(--forest)]" }
      : { variant: "gold" as const, className: "sell-glow font-bold" };
  const buy =
    tone === "dark"
      ? { variant: "outlineLight" as const, className: "" }
      : tone === "gold"
        ? {
            variant: "outline" as const,
            className:
              "border-gold-foreground/50 bg-transparent text-gold-foreground shadow-none hover:bg-gold-foreground/10 hover:text-gold-foreground",
          }
        : { variant: "outline" as const, className: "border-forest/40 text-forest hover:text-forest" };

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <Button asChild variant={sell.variant} size={size} className={sell.className}>
        <Link to="/sell-maize" onClick={onNavigate}>
          Sell Maize to Us {arrows && <ArrowRight />}
        </Link>
      </Button>
      <Button asChild variant={buy.variant} size={size} className={buy.className}>
        <Link to="/request-price" onClick={onNavigate}>
          Buy Maize from Us {arrows && <ArrowRight />}
        </Link>
      </Button>
      {children}
    </div>
  );
}

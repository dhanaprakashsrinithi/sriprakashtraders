import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/sri-prakash-traders-logo.png.asset.json";
import { cn } from "@/lib/utils";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="group inline-flex items-center" aria-label="Sri Prakash Traders home">
      <img
        src={logoAsset.url}
        alt="Sri Prakash Traders — Maize Buyers & Suppliers"
        className={cn("h-14 w-auto", light && "rounded-xl bg-white p-2 shadow-sm")}
      />
    </Link>
  );
}

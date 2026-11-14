import yellowMaize from "@/assets/yellow-maize.jpg";
import whiteMaize from "@/assets/white-maize.jpg";
import maizeSack from "@/assets/maize-sack.jpg";

const IMAGES: Record<string, string> = {
  "yellow-maize": yellowMaize,
  "white-maize": whiteMaize,
};

export function productImage(slug: string) {
  return IMAGES[slug] ?? maizeSack;
}

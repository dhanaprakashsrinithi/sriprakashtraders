import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import { CtaBand } from "@/components/site/Sections";
import { productsQueryOptions } from "@/lib/products.functions";
import { useReveal } from "@/hooks/use-reveal";
import yellowImg from "@/assets/yellow-maize.jpg";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Our Maize Products — Yellow & White Maize Wholesale | Sri Prakash Traders" },
      {
        name: "description",
        content:
          "Premium yellow maize in bulk for poultry feed, cattle feed and commodity buyers. White maize available subject to availability.",
      },
      { property: "og:title", content: "Yellow & White Maize — Wholesale Supply" },
      {
        property: "og:description",
        content: "Bulk yellow maize for feed manufacturers and commodity buyers. Request today's wholesale price.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions()),
  component: Products,
});

function Products() {
  const { data: products } = useSuspenseQuery(productsQueryOptions());
  useReveal(products);
  return (
    <>
      <PageHero
        eyebrow="Our Products"
        title="Wholesale maize, supplied in bulk"
        subtitle="Prices and stock change with the market. Request a quote for current availability and wholesale rates."
        image={yellowImg}
      />
      <section className="py-20 md:py-28">
        <div className="container-site space-y-10">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} featured />
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}

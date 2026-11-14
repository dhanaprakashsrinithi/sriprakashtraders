import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/lib/products.functions";
import { AVAILABILITY_LABELS } from "@/lib/site";
import { productImage } from "@/lib/product-images";

export function ProductsPanel() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
  if (isLoading) return <p className="text-muted-foreground">Loading products…</p>;
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Changes appear on the website right away. Only add specifications you have verified.
      </p>
      {data.map((p) => <ProductEditor key={p.id} product={p} />)}
    </div>
  );
}

function ProductEditor({ product }: { product: Product }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    tagline: product.tagline,
    description: product.description,
    uses: product.uses.join("\n"),
    specifications: product.specifications,
    availability: product.availability,
  });
  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("products").update({
        tagline: form.tagline.trim(),
        description: form.description.trim(),
        uses: form.uses.split("\n").map((s) => s.trim()).filter(Boolean),
        specifications: form.specifications.trim(),
        availability: form.availability,
      }).eq("id", product.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success(`${product.name} updated`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="grid gap-6 rounded-xl border border-border bg-card p-6 md:grid-cols-[200px_1fr]">
      <div>
        <img src={productImage(product.slug)} alt="" className="aspect-square w-full rounded-lg object-cover" />
        <h3 className="mt-3 font-sans text-lg font-bold text-forest-deep">{product.name}</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Availability</Label>
          <Select value={form.availability} onValueChange={(v) => setForm({ ...form, availability: v })}>
            <SelectTrigger className="mt-1.5 h-10 w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(AVAILABILITY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor={`tag-${product.id}`}>Tagline</Label>
          <Input id={`tag-${product.id}`} value={form.tagline} maxLength={120} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="mt-1.5 h-10" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor={`desc-${product.id}`}>Description</Label>
          <Textarea id={`desc-${product.id}`} rows={3} value={form.description} maxLength={1000} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor={`uses-${product.id}`}>Suitable for (one per line)</Label>
          <Textarea id={`uses-${product.id}`} rows={4} value={form.uses} onChange={(e) => setForm({ ...form, uses: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor={`spec-${product.id}`}>Verified specifications (optional)</Label>
          <Textarea id={`spec-${product.id}`} rows={4} placeholder="e.g. Moisture, foreign matter — leave empty if not verified" value={form.specifications} maxLength={2000} onChange={(e) => setForm({ ...form, specifications: e.target.value })} className="mt-1.5" />
        </div>
        <div className="md:col-span-2">
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending && <Loader2 className="animate-spin" />} Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}

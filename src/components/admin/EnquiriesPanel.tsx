import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Download, Mail, Phone, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { ENQUIRY_TYPE_LABELS, QUANTITY_UNIT_LABELS, type EnquiryType, type QuantityUnit } from "@/lib/enquiry-schema";

type Enquiry = Database["public"]["Tables"]["enquiries"]["Row"];
const STATUSES = ["new", "contacted", "closed"] as const;

function typeLabel(t: string) {
  return ENQUIRY_TYPE_LABELS[t as EnquiryType] ?? t;
}

/** Quantity exactly as the visitor entered it, e.g. "100 Metric Tonnes (MT)". */
function formatQuantity(e: Pick<Enquiry, "quantity" | "quantity_unit" | "quantity_mt">) {
  const qty = e.quantity ?? e.quantity_mt;
  const unit = QUANTITY_UNIT_LABELS[e.quantity_unit as QuantityUnit] ?? e.quantity_unit;
  return `${Number(qty).toLocaleString("en-IN")} ${unit}`;
}

function waLink(phone: string, name: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 10) digits = `91${digits}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(`Hello ${name}, thank you for your maize enquiry with Sri Prakash Traders.`)}`;
}

function toCsv(rows: Enquiry[]) {
  const cols: (keyof Enquiry)[] = ["created_at", "enquiry_type", "name", "company", "phone", "email", "maize_type", "quantity", "quantity_unit", "quantity_mt", "delivery_location", "expected_price", "requirements", "status", "admin_notes"];
  const header = ["created_at", "enquiry_type", "name", "company", "phone", "email", "maize_type", "quantity", "unit", "quantity_in_mt", "location", "expected_price", "requirements", "status", "admin_notes"];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [header.join(","), ...rows.map((r) => cols.map((c) => esc(c === "enquiry_type" ? typeLabel(r[c]) : r[c])).join(","))].join("\n");
}

export function EnquiriesPanel() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [q, setQ] = useState("");

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["admin", "enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(1000);
      if (error) throw error;
      return data;
    },
  });

  const update = useMutation({
    mutationFn: async (vars: { id: string; patch: Partial<Pick<Enquiry, "status" | "admin_notes">> }) => {
      const { error } = await supabase.from("enquiries").update(vars.patch).eq("id", vars.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "enquiries"] }); toast.success("Enquiry updated"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("enquiries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "enquiries"] }); toast.success("Enquiry deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return data.filter((e) => {
      if (status !== "all" && e.status !== status) return false;
      if (type !== "all" && e.enquiry_type !== type) return false;
      if (!term) return true;
      return [e.name, e.company, e.phone, e.email, e.delivery_location].some((v) => v.toLowerCase().includes(term));
    });
  }, [data, status, type, q]);

  const counts = useMemo(() => ({
    total: data.length,
    new: data.filter((e) => e.status === "new").length,
    buying: data.filter((e) => e.enquiry_type === "buy").length,
    selling: data.filter((e) => e.enquiry_type === "sell").length,
  }), [data]);

  function exportCsv() {
    const blob = new Blob([toCsv(filtered)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enquiries-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total enquiries", counts.total],
          ["New", counts.new],
          ["Buying from us", counts.buying],
          ["Selling to us", counts.selling],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-forest-deep">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search name, company, phone, location" value={q} onChange={(e) => setQ(e.target.value)} className="h-10 pl-9" />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="h-10 w-full md:w-44" aria-label="Filter by enquiry type"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Buying &amp; selling</SelectItem>
            <SelectItem value="buy">Buying from us</SelectItem>
            <SelectItem value="sell">Selling to us</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-10 w-full md:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={exportCsv} disabled={filtered.length === 0}>
          <Download /> Export CSV
        </Button>
      </div>

      {isLoading && <p className="mt-10 text-muted-foreground">Loading enquiries…</p>}
      {error && <p className="mt-10 text-destructive">{(error as Error).message}</p>}
      {!isLoading && filtered.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No enquiries yet. New buying and selling enquiries from the website will appear here.
        </div>
      )}

      <div className="mt-6 space-y-4">
        {filtered.map((e) => (
          <EnquiryRow
            key={e.id}
            e={e}
            onStatus={(s) => update.mutate({ id: e.id, patch: { status: s } })}
            onNotes={(n) => update.mutate({ id: e.id, patch: { admin_notes: n } })}
            onDelete={() => { if (confirm(`Delete enquiry from ${e.name}?`)) remove.mutate(e.id); }}
          />
        ))}
      </div>
    </div>
  );
}

function EnquiryRow({ e, onStatus, onNotes, onDelete }: { e: Enquiry; onStatus: (s: string) => void; onNotes: (n: string) => void; onDelete: () => void }) {
  const [notes, setNotes] = useState(e.admin_notes);
  return (
    <article className="rounded-xl border border-border bg-card p-5 md:p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-sans text-lg font-bold text-forest-deep">{e.name}</h3>
            {e.company && <span className="text-sm text-muted-foreground">· {e.company}</span>}
            <Badge variant={e.status === "new" ? "default" : "secondary"} className="capitalize">{e.status}</Badge>
            <Badge variant="outline" className={e.enquiry_type === "sell" ? "border-gold bg-gold-soft text-forest-deep" : "border-forest text-forest"}>{typeLabel(e.enquiry_type)}</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{format(new Date(e.created_at), "d MMM yyyy, h:mm a")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="whatsapp"><a href={waLink(e.phone, e.name)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp</a></Button>
          <Button asChild size="sm" variant="outline"><a href={`tel:${e.phone}`}><Phone /> Call</a></Button>
          {e.email && <Button asChild size="sm" variant="outline"><a href={`mailto:${e.email}`}><Mail /> Email</a></Button>}
        </div>
      </div>
      <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div><dt className="text-xs text-muted-foreground">Maize type</dt><dd className="font-semibold">{e.maize_type}</dd></div>
        <div>
          <dt className="text-xs text-muted-foreground">Quantity</dt>
          <dd className="font-semibold">{formatQuantity(e)}</dd>
          {e.quantity_unit !== "MT" && e.quantity_unit !== "T" && (
            <dd className="text-xs text-muted-foreground">≈ {Number(e.quantity_mt).toLocaleString("en-IN")} MT</dd>
          )}
        </div>
        <div><dt className="text-xs text-muted-foreground">{e.enquiry_type === "sell" ? "Stock location" : "Delivery location"}</dt><dd className="font-semibold">{e.delivery_location}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Contact</dt><dd className="font-semibold break-all">{e.phone}{e.email && <><br /><span className="font-normal">{e.email}</span></>}</dd></div>
      </dl>
      {e.enquiry_type === "sell" && e.expected_price && (
        <p className="mt-4 text-sm"><span className="text-xs text-muted-foreground">Expected selling price: </span><span className="font-semibold">{e.expected_price}</span></p>
      )}
      {e.requirements && <p className="mt-4 whitespace-pre-line rounded-lg bg-muted p-3 text-sm">{e.requirements}</p>}
      <div className="mt-5 grid gap-3 md:grid-cols-[180px_1fr_auto] md:items-start">
        <Select value={e.status} onValueChange={onStatus}>
          <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
          <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
        </Select>
        <div className="flex gap-2">
          <Textarea rows={1} placeholder="Internal notes" value={notes} onChange={(ev) => setNotes(ev.target.value)} className="min-h-10" />
          <Button variant="outline" disabled={notes === e.admin_notes} onClick={() => onNotes(notes)}>Save</Button>
        </div>
        <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete enquiry"><Trash2 className="text-destructive" /></Button>
      </div>
    </article>
  );
}

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, ShoppingCart, Wheat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MAIZE_TYPES,
  QUANTITY_UNITS,
  QUANTITY_UNIT_LABELS,
  enquiryFormSchema,
  type EnquiryInput,
  type EnquiryType,
} from "@/lib/enquiry-schema";
import { submitEnquiry } from "@/lib/enquiries.functions";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { SELL_WHATSAPP_MESSAGE, whatsappLink } from "@/lib/site";

type FormValues = Omit<EnquiryInput, "elapsed_ms">;

const TYPE_OPTIONS: { value: EnquiryType; title: string; text: string; icon: typeof Wheat }[] = [
  { value: "buy", title: "Buying from us", text: "I need maize in bulk", icon: ShoppingCart },
  { value: "sell", title: "Selling to us", text: "I have maize to sell", icon: Wheat },
];

const COPY: Record<EnquiryType, { qty: string; location: string; locationHint: string; extraHint: string; submit: string; doneTitle: string; doneText: string }> = {
  buy: {
    qty: "Required Quantity *",
    location: "Delivery Location *",
    locationHint: "City, District, State",
    extraHint: "Delivery schedule, regular supply needs, packing, etc.",
    submit: "Get Wholesale Price",
    doneTitle: "Thank you, your enquiry is received",
    doneText: "Our team will review your requirement and get back to you with current availability and wholesale pricing.",
  },
  sell: {
    qty: "Quantity Available to Sell *",
    location: "Maize Stock Location *",
    locationHint: "Village / Town, District, State",
    extraHint: "Moisture, harvest date, bagged or loose, when it's ready for pickup, etc.",
    submit: "Submit Maize for Sale",
    doneTitle: "Thank you, we've received your maize details",
    doneText: "Our team will review your offer and contact you to discuss quantity, quality and price.",
  },
};

export function EnquiryForm({
  defaultType,
  defaultEnquiryType = "buy",
}: {
  defaultType?: (typeof MAIZE_TYPES)[number] | undefined;
  defaultEnquiryType?: EnquiryType;
}) {
  const submit = useServerFn(submitEnquiry);
  const startedAt = useRef<number>(0);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      enquiry_type: defaultEnquiryType,
      name: "",
      company: "",
      phone: "",
      email: "",
      ...(defaultType ? { maize_type: defaultType } : {}),
      quantity_unit: "MT",
      location: "",
      expected_price: "",
      requirements: "",
      website: "",
    },
  });

  const enquiryType: EnquiryType = watch("enquiry_type") ?? defaultEnquiryType;
  const copy = COPY[enquiryType];
  const waHref = enquiryType === "sell" ? whatsappLink(SELL_WHATSAPP_MESSAGE) : whatsappLink();

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await submit({ data: { ...values, elapsed_ms: Date.now() - startedAt.current } });
      setDone(true);
      reset({ ...values, name: "", company: "", phone: "", email: "", quantity: "" as unknown as number, location: "", expected_price: "", requirements: "" });
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  });

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-card" role="status">
        <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
        <h3 className="mt-5 text-2xl font-semibold text-forest-deep">{copy.doneTitle}</h3>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          {copy.doneText} For a faster response, message us on WhatsApp.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild variant="whatsapp" size="lg">
            <a href={waHref} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-4 w-4" /> Continue on WhatsApp
            </a>
          </Button>
          <Button variant="outline" size="lg" onClick={() => { setDone(false); startedAt.current = Date.now(); }}>
            Send another enquiry
          </Button>
        </div>
      </div>
    );
  }

  const err = (k: keyof typeof errors) =>
    errors[k]?.message ? <p className="mt-1.5 text-xs text-destructive">{String(errors[k]?.message)}</p> : null;

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-9">
      <fieldset>
        <legend className="text-sm font-medium">Enquiry Type *</legend>
        <Controller
          control={control}
          name="enquiry_type"
          render={({ field }) => (
            <div role="radiogroup" aria-label="Enquiry type" className="mt-2 grid gap-3 sm:grid-cols-2">
              {TYPE_OPTIONS.map((o) => {
                const active = field.value === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => field.onChange(o.value)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors",
                      active ? "border-forest bg-secondary" : "border-border hover:border-forest/40",
                    )}
                  >
                    <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-lg", active ? "bg-forest text-gold" : "bg-muted text-forest")}>
                      <o.icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-semibold text-forest-deep">{o.title}</span>
                      <span className="block text-xs text-muted-foreground">{o.text}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        />
        {err("enquiry_type")}
      </fieldset>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" autoComplete="name" className="mt-1.5 h-11" {...register("name")} />
          {err("name")}
        </div>
        <div>
          <Label htmlFor="company">Company / Business Name</Label>
          <Input id="company" autoComplete="organization" className="mt-1.5 h-11" {...register("company")} />
          {err("company")}
        </div>
        <div>
          <Label htmlFor="phone">Mobile Number *</Label>
          <div className="mt-1.5 flex">
            <span
              aria-hidden="true"
              className="inline-flex h-11 shrink-0 items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm font-semibold text-forest-deep"
            >
              +91
            </span>
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="98765 43210"
              maxLength={14}
              aria-describedby="phone-prefix"
              className="h-11 rounded-l-none"
              {...register("phone")}
            />
          </div>
          <span id="phone-prefix" className="sr-only">Country code +91 is added automatically</span>
          {err("phone")}
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" autoComplete="email" className="mt-1.5 h-11" {...register("email")} />
          {err("email")}
        </div>
        <div>
          <Label htmlFor="maize_type">Maize Type *</Label>
          <Controller
            control={control}
            name="maize_type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="maize_type" className="mt-1.5 h-11 w-full">
                  <SelectValue placeholder="Select maize type" />
                </SelectTrigger>
                <SelectContent>
                  {MAIZE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {err("maize_type")}
        </div>
        <div>
          <Label htmlFor="quantity">{copy.qty}</Label>
          <div className="mt-1.5 flex gap-2">
            <Input
              id="quantity"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              placeholder="e.g. 100"
              className="h-11 min-w-0 flex-1"
              {...register("quantity")}
            />
            <Controller
              control={control}
              name="quantity_unit"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-label="Measurement unit" className="h-11 w-[11.5rem] shrink-0">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {QUANTITY_UNITS.map((u) => (
                      <SelectItem key={u} value={u}>
                        {QUANTITY_UNIT_LABELS[u]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {err("quantity")}
          {err("quantity_unit")}
        </div>
        <div className={enquiryType === "sell" ? "" : "md:col-span-2"}>
          <Label htmlFor="location">{copy.location}</Label>
          <Input id="location" placeholder={copy.locationHint} className="mt-1.5 h-11" {...register("location")} />
          {err("location")}
        </div>
        {enquiryType === "sell" && (
          <div>
            <Label htmlFor="expected_price">Expected Selling Price</Label>
            <Input id="expected_price" placeholder="Your price, e.g. per quintal or per tonne" className="mt-1.5 h-11" {...register("expected_price")} />
            {err("expected_price")}
          </div>
        )}
        <div className="md:col-span-2">
          <Label htmlFor="requirements">Additional Requirements</Label>
          <Textarea id="requirements" rows={4} placeholder={copy.extraHint} className="mt-1.5" {...register("requirements")} />
          {err("requirements")}
        </div>
        {/* Honeypot: hidden from people, bots tend to fill it */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">Website</label>
          <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>
      </div>
      {serverError && (
        <p className="mt-5 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
          {serverError}
        </p>
      )}
      <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Your details are used only to respond to your enquiry.
        </p>
        <Button type="submit" variant="gold" size="xl" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {copy.submit}
        </Button>
      </div>
    </form>
  );
}

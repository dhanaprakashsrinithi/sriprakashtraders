import { z } from "zod";

export const MAIZE_TYPES = ["Yellow Maize", "White Maize"] as const;

/** buy = visitor is buying maize from us; sell = visitor is selling maize to us. */
export const ENQUIRY_TYPES = ["buy", "sell"] as const;
export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

export const ENQUIRY_TYPE_LABELS: Record<EnquiryType, string> = {
  buy: "Buying from us",
  sell: "Selling to us",
};

export const QUANTITY_UNITS = ["T", "MT", "KG", "QTL"] as const;
export type QuantityUnit = (typeof QUANTITY_UNITS)[number];

export const QUANTITY_UNIT_LABELS: Record<QuantityUnit, string> = {
  T: "Tonnes (T)",
  MT: "Metric Tonnes (MT)",
  KG: "Kilograms (KG)",
  QTL: "Quintals (QTL)",
};

const MT_PER_UNIT: Record<QuantityUnit, number> = { T: 1, MT: 1, KG: 0.001, QTL: 0.1 };

/** Converts a quantity in any supported unit to metric tonnes (rounded to 2 decimals). */
export function toMetricTonnes(quantity: number, unit: QuantityUnit) {
  return Math.round(quantity * MT_PER_UNIT[unit] * 100) / 100;
}

/** Smallest and largest accepted enquiry, in metric tonnes. */
export const MIN_QUANTITY_MT = 0.01;
export const MAX_QUANTITY_MT = 100000;

/**
 * Indian mobile numbers only: visitors type the 10 digits next to a fixed +91 prefix.
 * Accepts a pasted +91 / 0 prefix too, and always stores "+91 XXXXXXXXXX".
 */
export function normaliseIndianMobile(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? `+91 ${digits}` : null;
}

const baseSchema = z.object({
  enquiry_type: z.enum(ENQUIRY_TYPES, { errorMap: () => ({ message: "Choose whether you are buying or selling" }) }),
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  company: z.string().trim().max(150).default(""),
  phone: z
    .string()
    .trim()
    .max(20, "Enter a valid 10-digit mobile number")
    .transform((v, ctx) => {
      const n = normaliseIndianMobile(v);
      if (!n) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a valid 10-digit mobile number" });
        return z.NEVER;
      }
      return n;
    }),
  email: z
    .string()
    .trim()
    .max(255)
    .refine((v) => v === "" || z.string().email().safeParse(v).success, "Enter a valid email")
    .default(""),
  maize_type: z.enum(MAIZE_TYPES, { errorMap: () => ({ message: "Choose a maize type" }) }),
  quantity: z.coerce
    .number({ invalid_type_error: "Enter the quantity" })
    .positive("Quantity must be more than 0"),
  quantity_unit: z.enum(QUANTITY_UNITS, { errorMap: () => ({ message: "Choose a unit" }) }),
  location: z.string().trim().min(2, "Enter the location").max(200),
  expected_price: z.string().trim().max(100, "Keep this under 100 characters").default(""),
  requirements: z.string().trim().max(2000).default(""),
  // Spam protection: hidden field that real visitors leave empty, and time spent on form.
  website: z.string().max(0).optional().default(""),
  elapsed_ms: z.number().int().nonnegative().optional().default(0),
});

function quantityInRange(
  v: { quantity: number; quantity_unit: QuantityUnit },
  ctx: z.RefinementCtx,
) {
  const mt = v.quantity * MT_PER_UNIT[v.quantity_unit];
  if (mt < MIN_QUANTITY_MT) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["quantity"], message: "Minimum quantity is 10 kg" });
  } else if (mt > MAX_QUANTITY_MT) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["quantity"], message: "Please contact us directly for this quantity" });
  }
}

export const enquirySchema = baseSchema.superRefine(quantityInRange);
/** Same rules as the server, without the timing field the form adds on submit. */
export const enquiryFormSchema = baseSchema.omit({ elapsed_ms: true }).superRefine(quantityInRange);

export type EnquiryInput = z.input<typeof enquirySchema>;
export type Enquiry = z.output<typeof enquirySchema>;

/** Minimum time a genuine visitor needs to fill the form. */
export const MIN_FILL_MS = 3000;

export function isLikelySpam(e: Pick<Enquiry, "website" | "elapsed_ms">) {
  return (e.website ?? "") !== "" || (e.elapsed_ms ?? 0) < MIN_FILL_MS;
}

import { createServerFn } from "@tanstack/react-start";
import { enquirySchema, isLikelySpam, toMetricTonnes } from "./enquiry-schema";

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => enquirySchema.parse(input))
  .handler(async ({ data }) => {
    // Silently accept bot submissions without storing them.
    if (isLikelySpam(data)) return { ok: true as const };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Basic rate limit: max 3 enquiries per phone number in 10 minutes.
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("enquiries")
      .select("id", { count: "exact", head: true })
      .eq("phone", data.phone)
      .gte("created_at", since);
    if ((count ?? 0) >= 3) {
      throw new Error("Too many enquiries from this number. Please try again later or call us.");
    }

    const { error } = await supabaseAdmin.from("enquiries").insert({
      enquiry_type: data.enquiry_type,
      name: data.name,
      company: data.company,
      phone: data.phone,
      email: data.email,
      maize_type: data.maize_type,
      quantity: data.quantity,
      quantity_unit: data.quantity_unit,
      quantity_mt: toMetricTonnes(data.quantity, data.quantity_unit),
      delivery_location: data.location,
      expected_price: data.enquiry_type === "sell" ? data.expected_price : "",
      requirements: data.requirements,
    });
    if (error) {
      console.error("enquiry insert failed", error);
      throw new Error("We could not save your enquiry. Please try again or contact us on WhatsApp.");
    }
    return { ok: true as const };
  });

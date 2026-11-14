import { describe, expect, it } from "vitest";
import { enquirySchema, isLikelySpam, MIN_FILL_MS, toMetricTonnes } from "@/lib/enquiry-schema";

const valid = {
  enquiry_type: "buy",
  name: "Ravi Kumar",
  company: "Ravi Feeds",
  phone: "+91 98765 43210",
  email: "",
  maize_type: "Yellow Maize",
  quantity: "100",
  quantity_unit: "MT",
  location: "Namakkal, Tamil Nadu",
  expected_price: "",
  requirements: "",
  website: "",
  elapsed_ms: 8000,
};

describe("maize enquiry rules", () => {
  it("accepts a complete enquiry and keeps the chosen unit", () => {
    const r = enquirySchema.parse(valid);
    expect(r.quantity).toBe(100);
    expect(r.quantity_unit).toBe("MT");
  });

  it("requires choosing buying from us or selling to us", () => {
    expect(enquirySchema.safeParse({ ...valid, enquiry_type: "sell" }).success).toBe(true);
    expect(enquirySchema.safeParse({ ...valid, enquiry_type: "" }).success).toBe(false);
  });

  it("only allows Tonnes, Metric Tonnes, Kilograms or Quintals", () => {
    for (const u of ["T", "MT", "KG", "QTL"]) {
      expect(enquirySchema.safeParse({ ...valid, quantity_unit: u }).success).toBe(true);
    }
    expect(enquirySchema.safeParse({ ...valid, quantity_unit: "LB" }).success).toBe(false);
  });

  it("converts each unit to metric tonnes", () => {
    expect(toMetricTonnes(100, "MT")).toBe(100);
    expect(toMetricTonnes(100, "T")).toBe(100);
    expect(toMetricTonnes(5000, "KG")).toBe(5);
    expect(toMetricTonnes(250, "QTL")).toBe(25);
  });

  it("rejects quantities below 10 kg", () => {
    expect(enquirySchema.safeParse({ ...valid, quantity: "5", quantity_unit: "KG" }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...valid, quantity: "10", quantity_unit: "KG" }).success).toBe(true);
  });

  it("only allows Yellow Maize or White Maize", () => {
    expect(enquirySchema.safeParse({ ...valid, maize_type: "White Maize" }).success).toBe(true);
    expect(enquirySchema.safeParse({ ...valid, maize_type: "Red Maize" }).success).toBe(false);
  });

  it("requires a mobile number with at least 10 digits", () => {
    expect(enquirySchema.safeParse({ ...valid, phone: "12345" }).success).toBe(false);
  });

  it("adds the +91 country code to a 10-digit mobile number", () => {
    expect(enquirySchema.parse({ ...valid, phone: "98765 43210" }).phone).toBe("+91 9876543210");
    expect(enquirySchema.parse({ ...valid, phone: "+91 98765 43210" }).phone).toBe("+91 9876543210");
    expect(enquirySchema.parse({ ...valid, phone: "09876543210" }).phone).toBe("+91 9876543210");
  });

  it("only accepts Indian mobile numbers starting with 6, 7, 8 or 9", () => {
    expect(enquirySchema.safeParse({ ...valid, phone: "5876543210" }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...valid, phone: "98765432101" }).success).toBe(false);
  });

  it("rejects zero quantity", () => {
    expect(enquirySchema.safeParse({ ...valid, quantity: "0" }).success).toBe(false);
  });

  it("flags submissions that fill the hidden field or are too fast", () => {
    expect(isLikelySpam({ website: "spam.com", elapsed_ms: 10000 })).toBe(true);
    expect(isLikelySpam({ website: "", elapsed_ms: MIN_FILL_MS - 1 })).toBe(true);
    expect(isLikelySpam({ website: "", elapsed_ms: 10000 })).toBe(false);
  });
});

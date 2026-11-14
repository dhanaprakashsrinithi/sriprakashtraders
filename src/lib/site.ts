export const SITE = {
  name: "Sri Prakash Traders",
  domain: "www.sriprakashtraders.com",
  email: "sriprakashtradersco@gmail.com",
  phoneDisplay: "+91 88388 11466",
  phoneE164: "+918838811466",
  whatsappNumber: "918838811466",
  whatsappMessage:
    "Hello Sri Prakash Traders, I am interested in purchasing maize in bulk. Please share your current stock availability and wholesale price.",
} as const;

/** Pre-filled WhatsApp message for farmers, traders and suppliers selling maize to us. */
export const SELL_WHATSAPP_MESSAGE =
  "Hello Sri Prakash Traders, I have maize available to sell in bulk. Please share your current buying price.";

export function whatsappLink(message: string = SITE.whatsappMessage) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function productWhatsappLink(productName: string) {
  return whatsappLink(
    `Hello Sri Prakash Traders, I am interested in purchasing ${productName} in bulk. Please share your current stock availability and wholesale price.`,
  );
}

export const telLink = `tel:${SITE.phoneE164}`;
export const mailLink = `mailto:${SITE.email}?subject=${encodeURIComponent("Wholesale Maize Enquiry")}`;

export const AVAILABILITY_LABELS: Record<string, string> = {
  available: "Available for bulk orders",
  limited: "Limited stock",
  subject_to_availability: "Subject to availability",
  unavailable: "Currently unavailable",
};

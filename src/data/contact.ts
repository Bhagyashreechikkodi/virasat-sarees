export const STORE_PHONES = [
  "8970084941",
  "9108769479",
  "8861637931",
  "8861781722",
] as const;

export type StorePhone = (typeof STORE_PHONES)[number];

/** Primary number shown first */
export const PRIMARY_PHONE: StorePhone = STORE_PHONES[0];

export const STORE_ADDRESS = {
  lines: [
    "886, Sajjan Galli, Near SBI Bank",
    "Athani, Belagavi (Belgaum)",
    "Karnataka 591304",
  ],
  short: "Athani, Belagavi · Karnataka 591304",
  mapsUrl: "https://maps.app.goo.gl/Q9dahwLXpXPF3rMo8",
  /** Pin from shared Google Maps location */
  lat: 16.728916,
  lng: 75.066557,
} as const;

export function telHref(phone: string = PRIMARY_PHONE) {
  return `tel:+91${phone}`;
}

export function whatsappHref(text: string, phone: string = PRIMARY_PHONE) {
  return `https://wa.me/91${phone}?text=${encodeURIComponent(text)}`;
}

export function formatPhoneDisplay(phone: string) {
  return `+91 ${phone}`;
}

export function buildWhatsAppOrderMessage(
  lines: { name: string; quantity: number; lineTotal: string }[],
  subtotal: string,
  orderId?: string
) {
  const items = lines
    .map((l, i) => `${i + 1}. ${l.name} × ${l.quantity} — ${l.lineTotal}`)
    .join("\n");

  return [
    "Hi Virasat Sarees, I'd like to place an order:",
    orderId ? `Order ID: ${orderId}` : "",
    "",
    items,
    "",
    `Subtotal: ${subtotal}`,
    "",
    "Please confirm availability and payment details. Thank you!",
  ]
    .filter((line, i, arr) => line !== "" || arr[i - 1] !== "")
    .join("\n");
}

export const ORDER_STATUS_WHATSAPP_TEXT =
  "Hi Virasat Sarees, I'd like to check my order status.";

/** Public contact info for footer and lead flows (aligned with torpedoweb.org). */
export const CONTACT_PHONE = "+1 (808) 3018338";
export const CONTACT_PHONE_TEL = "tel:+18083018338";
export const CONTACT_EMAIL = "hello@torpedoweb.org";
export const CONTACT_ADDRESS =
  "8 The Green, Suite B, Dover, Delaware, USA-19901";

export const GOOGLE_CALENDAR_APPOINTMENT_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2u5zwDGc4tZMwvrltp0naFPFBh16oCo03NnFZoitMzY31I4QvqW_YIa8nRKX92mabsA-lC8Eyx";

export const CONTACT_INDIA_PHONES = [
  { label: "+91 9889301201", tel: "tel:+919889301201" },
] as const;

export const CONTACT_INDIA = {
  address:
    "616/145, Sitapur Rd, Aziz Nagar, Madiyanva, Lucknow, Uttar Pradesh 226021",
} as const;

/** Marketing site base — footer nav links open on torpedoweb.org. */
export const TORPEDO_WEB_SITE = "https://torpedoweb.org";

export function torpedoSitePath(segment: string): string {
  const path = segment.startsWith("/") ? segment : `/${segment}`;
  return `${TORPEDO_WEB_SITE}${path}`;
}

/** Public booking shortlink (same as main site `book.torpedoweb.org`). */
export const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL?.replace(/\/$/, "") ??
  "https://book.torpedoweb.org";

export const CONTACT_EMAIL = "hello@torpedoweb.org";

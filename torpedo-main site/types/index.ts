export interface BookingPayload {
  name: string;
  email: string;
  project_type: string;
  timeline?: string;
  business_info?: string;
  description?: string;
  scheduled_at?: string;
  source?: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  body: string;
}

export interface PreviewSessionPayload {
  slug: string;
  exp: number;
  iat: number;
}

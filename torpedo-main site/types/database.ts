export type AppRole = 'admin' | 'team' | 'client';

export interface Profile {
  id: string;
  role: AppRole;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  slug: string;
  staging_url: string;
  status: 'draft' | 'active' | 'delivered' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface PreviewToken {
  id: string;
  project_id: string;
  token_hash: string;
  expires_at: string;
  max_views: number;
  current_views: number;
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  project_type: string;
  timeline: string | null;
  business_info: string | null;
  description: string | null;
  scheduled_at: string | null;
  source?: string | null;
  created_by?: string | null;
  created_at: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'done';
  due_date: string | null;
  created_at: string;
}

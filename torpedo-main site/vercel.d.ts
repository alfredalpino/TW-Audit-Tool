import type { NextRequest } from 'next/server';

declare module 'next/server' {
  interface NextRequest {
    geo?: {
      country?: string;
      region?: string;
      city?: string;
    };
  }
}

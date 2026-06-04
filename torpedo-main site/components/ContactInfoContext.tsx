'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import {
  CONTACT_PHONE,
  CONTACT_PHONE_TEL,
  CONTACT_EMAIL,
  CONTACT_ADDRESS,
  CONTACT_INDIA_PHONES,
} from '@/lib/constants';
import { getLocaleFromPathname, localeByCode } from '@/lib/i18n/config';

export type ContactInfo = {
  phone: string;
  phoneTel: string;
  /** First secondary (e.g. first Indian number) */
  phoneSecondary: string | null;
  phoneSecondaryTel: string | null;
  /** Second secondary (e.g. second Indian number) - separate link */
  phoneSecondary2: string | null;
  phoneSecondaryTel2: string | null;
  email: string;
  address: string;
  /** Base path for internal links from active locale prefix */
  basePath: string;
  locale: string;
};

const defaultContact: ContactInfo = {
  phone: CONTACT_PHONE,
  phoneTel: CONTACT_PHONE_TEL,
  phoneSecondary: null,
  phoneSecondaryTel: null,
  phoneSecondary2: null,
  phoneSecondaryTel2: null,
  email: CONTACT_EMAIL,
  address: CONTACT_ADDRESS,
  basePath: '',
  locale: 'en-US',
};

const ContactInfoContext = createContext<ContactInfo>(defaultContact);

export function ContactInfoProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const value = useMemo(() => {
    const locale = getLocaleFromPathname(pathname ?? '/');
    const basePath = localeByCode[locale].prefix;
    const isIndia = locale === 'en-IN';

    if (!isIndia) {
      return { ...defaultContact, basePath, locale };
    }

    return {
      ...defaultContact,
      phoneSecondary: CONTACT_INDIA_PHONES.at(0)?.label ?? null,
      phoneSecondaryTel: CONTACT_INDIA_PHONES.at(0)?.tel ?? null,
      phoneSecondary2: CONTACT_INDIA_PHONES.at(1)?.label ?? null,
      phoneSecondaryTel2: CONTACT_INDIA_PHONES.at(1)?.tel ?? null,
      basePath,
      locale,
    };
  }, [pathname]);

  return <ContactInfoContext.Provider value={value}>{children}</ContactInfoContext.Provider>;
}

export function useContactInfo(): ContactInfo {
  const ctx = useContext(ContactInfoContext);
  if (!ctx) {
    return defaultContact;
  }
  return ctx;
}

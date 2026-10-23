import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../lib/api';
import type { PublicSettings } from '../types';

const FALLBACK: PublicSettings = {
  announcement: '',
  business: {
    name: 'Acharika',
    tagline: 'Har Bite Mein Ghar Ka Swaad',
    supportPhone: '',
    whatsapp: '',
    supportEmail: '',
    supportHours: '',
    address: '',
    fssaiNumber: '',
    instagram: '',
    facebook: '',
  },
  shipping: { flatRate: 0, freeShippingThreshold: 0, processingTime: '', deliveryEstimate: '' },
  cod: { enabled: false, fee: 0, maxOrderValue: 0 },
  onlinePayment: false,
};

const Ctx = createContext<{ settings: PublicSettings; loaded: boolean }>({ settings: FALLBACK, loaded: false });

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({ settings: FALLBACK, loaded: false });
  useEffect(() => {
    api<PublicSettings>('/settings/public')
      .then((settings) => setState({ settings, loaded: true }))
      .catch(() => setState((s) => ({ ...s, loaded: true })));
  }, []);
  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export const useSettings = () => useContext(Ctx);

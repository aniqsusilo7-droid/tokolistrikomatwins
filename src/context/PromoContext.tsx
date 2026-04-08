import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PromoItem {
  id: number;
  title: string;
  description: string;
  discount: string;
  image: string;
  terms: string;
}

export interface PromoSettings {
  isActive: boolean;
  endDate: string;
  promos: PromoItem[];
}

interface PromoContextType {
  promoSettings: PromoSettings;
  updatePromoSettings: (settings: PromoSettings) => void;
  addPromoItem: (promo: Omit<PromoItem, 'id'>) => void;
  updatePromoItem: (id: number, promo: Omit<PromoItem, 'id'>) => void;
  deletePromoItem: (id: number) => void;
}

const defaultPromoSettings: PromoSettings = {
  isActive: true,
  endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Default 24 jam dari sekarang
  promos: [
    {
      id: 1,
      title: 'Paket Lampu LED Hemat Energi',
      description: 'Beli 5 Lampu LED Philips 12W Gratis 1. Cocok untuk penerangan rumah hemat listrik.',
      discount: 'Beli 5 Gratis 1',
      image: 'https://picsum.photos/seed/promo1/600/400',
      terms: 'Berlaku kelipatan. Selama persediaan masih ada.',
    },
    {
      id: 2,
      title: 'Bundle Saklar + Stop Kontak Broco',
      description: 'Paket hemat renovasi rumah. 10 Saklar Engkel + 10 Stop Kontak Arde.',
      discount: 'Diskon 15%',
      image: 'https://picsum.photos/seed/promo2/600/400',
      terms: 'Minimal pembelian 1 bundle.',
    },
    {
      id: 3,
      title: 'Promo Spesial Genset Mini',
      description: 'Persiapan mati lampu! Genset portable 1000W harga miring.',
      discount: 'Potongan Rp 500.000',
      image: 'https://picsum.photos/seed/promo3/600/400',
      terms: 'Garansi resmi 1 tahun. Free ongkir Jakarta.',
    },
  ],
};

const PromoContext = createContext<PromoContextType | undefined>(undefined);

export function PromoProvider({ children }: { children: ReactNode }) {
  const [promoSettings, setPromoSettings] = useState<PromoSettings>(() => {
    const saved = localStorage.getItem('oma_promo');
    return saved ? JSON.parse(saved) : defaultPromoSettings;
  });

  useEffect(() => {
    localStorage.setItem('oma_promo', JSON.stringify(promoSettings));
  }, [promoSettings]);

  const updatePromoSettings = (settings: PromoSettings) => {
    setPromoSettings(settings);
  };

  const addPromoItem = (promo: Omit<PromoItem, 'id'>) => {
    setPromoSettings((prev) => ({
      ...prev,
      promos: [...(prev.promos || []), { ...promo, id: Date.now() }],
    }));
  };

  const updatePromoItem = (id: number, promo: Omit<PromoItem, 'id'>) => {
    setPromoSettings((prev) => ({
      ...prev,
      promos: (prev.promos || []).map((p) => (p.id === id ? { ...promo, id } : p)),
    }));
  };

  const deletePromoItem = (id: number) => {
    setPromoSettings((prev) => ({
      ...prev,
      promos: (prev.promos || []).filter((p) => p.id !== id),
    }));
  };

  return (
    <PromoContext.Provider value={{ promoSettings, updatePromoSettings, addPromoItem, updatePromoItem, deletePromoItem }}>
      {children}
    </PromoContext.Provider>
  );
}

export const usePromo = () => {
  const context = useContext(PromoContext);
  if (!context) throw new Error('usePromo must be used within PromoProvider');
  return context;
};

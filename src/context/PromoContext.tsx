import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

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
  updatePromoSettings: (settings: PromoSettings) => Promise<void>;
  addPromoItem: (promo: Omit<PromoItem, 'id'>) => Promise<void>;
  updatePromoItem: (id: number, promo: Omit<PromoItem, 'id'>) => Promise<void>;
  deletePromoItem: (id: number) => Promise<void>;
  loading: boolean;
}

const defaultPromoSettings: PromoSettings = {
  isActive: true,
  endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  promos: [],
};

const PromoContext = createContext<PromoContextType | undefined>(undefined);

export function PromoProvider({ children }: { children: ReactNode }) {
  const [promoSettings, setPromoSettings] = useState<PromoSettings>(defaultPromoSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromoData();
  }, []);

  const fetchPromoData = async () => {
    try {
      setLoading(true);
      
      // Fetch settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('promo_settings')
        .select('*')
        .single();
        
      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Error fetching promo settings:', settingsError);
      }

      // Fetch promos
      const { data: promosData, error: promosError } = await supabase
        .from('promos')
        .select('*')
        .order('id', { ascending: true });
        
      if (promosError) {
        console.error('Error fetching promos:', promosError);
      }

      setPromoSettings({
        isActive: settingsData ? settingsData.is_active : true,
        endDate: settingsData ? settingsData.end_date : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        promos: promosData || []
      });
      
    } catch (error) {
      console.error('Error in fetchPromoData:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePromoSettings = async (settings: PromoSettings) => {
    try {
      const { error } = await supabase
        .from('promo_settings')
        .upsert({ 
          id: 1, 
          is_active: settings.isActive, 
          end_date: settings.endDate 
        });

      if (error) throw error;
      
      setPromoSettings(prev => ({
        ...prev,
        isActive: settings.isActive,
        endDate: settings.endDate
      }));
    } catch (error) {
      console.error('Error updating promo settings:', error);
      throw error;
    }
  };

  const addPromoItem = async (promo: Omit<PromoItem, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('promos')
        .insert([promo])
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        setPromoSettings(prev => ({
          ...prev,
          promos: [...(prev.promos || []), data[0]]
        }));
      }
    } catch (error) {
      console.error('Error adding promo:', error);
      throw error;
    }
  };

  const updatePromoItem = async (id: number, promo: Omit<PromoItem, 'id'>) => {
    try {
      const { error } = await supabase
        .from('promos')
        .update(promo)
        .eq('id', id);

      if (error) throw error;
      
      setPromoSettings(prev => ({
        ...prev,
        promos: (prev.promos || []).map(p => p.id === id ? { ...promo, id } : p)
      }));
    } catch (error) {
      console.error('Error updating promo:', error);
      throw error;
    }
  };

  const deletePromoItem = async (id: number) => {
    try {
      const { error } = await supabase
        .from('promos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPromoSettings(prev => ({
        ...prev,
        promos: (prev.promos || []).filter(p => p.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting promo:', error);
      throw error;
    }
  };

  return (
    <PromoContext.Provider value={{ promoSettings, updatePromoSettings, addPromoItem, updatePromoItem, deletePromoItem, loading }}>
      {children}
    </PromoContext.Provider>
  );
}

export const usePromo = () => {
  const context = useContext(PromoContext);
  if (!context) throw new Error('usePromo must be used within PromoProvider');
  return context;
};

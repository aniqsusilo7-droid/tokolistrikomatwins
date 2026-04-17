import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export interface PromoItem {
  id: string; // Changed to string for Firestore defaults
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
  updatePromoItem: (id: string, promo: Omit<PromoItem, 'id'>) => Promise<void>;
  deletePromoItem: (id: string) => Promise<void>;
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
    // Realtime listeners via onSnapshot
    setLoading(true);

    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'promo'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setPromoSettings(prev => ({
          ...prev,
          isActive: data.isActive,
          endDate: data.endDate
        }));
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/promo');
    });

    const unsubscribePromos = onSnapshot(collection(db, 'promos'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PromoItem[];
      setPromoSettings(prev => ({
        ...prev,
        promos: data
      }));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'promos');
    });

    return () => {
      unsubscribeSettings();
      unsubscribePromos();
    };
  }, []);

  const updatePromoSettings = async (settings: PromoSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'promo'), {
        isActive: settings.isActive,
        endDate: settings.endDate
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/promo');
    }
  };

  const addPromoItem = async (promo: Omit<PromoItem, 'id'>) => {
    try {
      await addDoc(collection(db, 'promos'), promo);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'promos');
    }
  };

  const updatePromoItem = async (id: string, promo: Omit<PromoItem, 'id'>) => {
    try {
      await updateDoc(doc(db, 'promos', id), { ...promo });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `promos/${id}`);
    }
  };

  const deletePromoItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'promos', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `promos/${id}`);
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

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export interface Product {
  id: string; // Changed to string for Firestore defaults
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  image: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Brand {
  id: string;
  name: string;
}

interface ProductContextType {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  addProduct: (p: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, p: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addBrand: (name: string) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Realtime listeners via onSnapshot
    setLoading(true);
    
    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'products');
    });

    const unsubscribeCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      setCategories(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'categories');
    });

    const unsubscribeBrands = onSnapshot(collection(db, 'brands'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Brand[];
      setBrands(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'brands');
    });

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
      unsubscribeBrands();
    };
  }, []);

  const addProduct = async (p: Omit<Product, 'id'>) => {
    try {
      await addDoc(collection(db, 'products'), p);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    }
  };

  const updateProduct = async (id: string, p: Omit<Product, 'id'>) => {
    try {
      await updateDoc(doc(db, 'products', id), { ...p });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const addCategory = async (name: string) => {
    try {
      await addDoc(collection(db, 'categories'), { name });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'categories');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
    }
  };

  const addBrand = async (name: string) => {
    try {
      await addDoc(collection(db, 'brands'), { name });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'brands');
    }
  };

  const deleteBrand = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'brands', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `brands/${id}`);
    }
  };

  return (
    <ProductContext.Provider value={{ 
      products, categories, brands, 
      addProduct, updateProduct, deleteProduct, 
      addCategory, deleteCategory, addBrand, deleteBrand,
      loading 
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
};

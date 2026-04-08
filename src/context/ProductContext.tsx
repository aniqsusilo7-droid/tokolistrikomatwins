import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  image: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (p: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: number, p: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        // Map database snake_case to camelCase
        const formattedData = data.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          brand: item.brand,
          price: item.price,
          originalPrice: item.original_price,
          rating: item.rating,
          image: item.image
        }));
        setProducts(formattedData);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (p: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: p.name,
          category: p.category,
          brand: p.brand,
          price: p.price,
          original_price: p.originalPrice,
          rating: p.rating,
          image: p.image
        }])
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        const newItem = data[0];
        setProducts([...products, {
          id: newItem.id,
          name: newItem.name,
          category: newItem.category,
          brand: newItem.brand,
          price: newItem.price,
          originalPrice: newItem.original_price,
          rating: newItem.rating,
          image: newItem.image
        }]);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: number, p: Omit<Product, 'id'>) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: p.name,
          category: p.category,
          brand: p.brand,
          price: p.price,
          original_price: p.originalPrice,
          rating: p.rating,
          image: p.image
        })
        .eq('id', id);

      if (error) throw error;
      
      setProducts(products.map(x => x.id === id ? { ...p, id } : x));
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProducts(products.filter(x => x.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, loading }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
};

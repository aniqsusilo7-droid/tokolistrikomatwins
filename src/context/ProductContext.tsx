import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

const defaultProducts: Product[] = [
  { id: 1, name: 'Kabel NYA ETERNA 2x2.5mm (50m)', category: 'Kabel', brand: 'Eterna', price: 350000, originalPrice: 400000, rating: 4.9, image: 'https://picsum.photos/seed/kabel1/400/400' },
  { id: 2, name: 'Lampu LED Philips 12W Putih', category: 'Lampu LED', brand: 'Philips', price: 45000, originalPrice: 55000, rating: 4.8, image: 'https://picsum.photos/seed/lampu1/400/400' },
  { id: 3, name: 'Saklar Ganda Broco', category: 'Saklar & Stop Kontak', brand: 'Broco', price: 18500, originalPrice: 22000, rating: 4.7, image: 'https://picsum.photos/seed/saklar1/400/400' },
  { id: 4, name: 'MCB Schneider 1 Phase 20A', category: 'MCB', brand: 'Schneider', price: 65000, originalPrice: 75000, rating: 5.0, image: 'https://picsum.photos/seed/mcb1/400/400' },
  { id: 5, name: 'Lampu LED Hannochs 9W', category: 'Lampu LED', brand: 'Hannochs', price: 25000, originalPrice: 30000, rating: 4.6, image: 'https://picsum.photos/seed/lampu2/400/400' },
  { id: 6, name: 'Stop Kontak Arde Broco', category: 'Saklar & Stop Kontak', brand: 'Broco', price: 15000, originalPrice: 18000, rating: 4.8, image: 'https://picsum.photos/seed/stopkontak1/400/400' },
  { id: 7, name: 'Kabel NYM ETERNA 3x1.5mm (50m)', category: 'Kabel', brand: 'Eterna', price: 420000, originalPrice: 480000, rating: 4.9, image: 'https://picsum.photos/seed/kabel2/400/400' },
  { id: 8, name: 'Fiting Plafon Broco', category: 'Fiting', brand: 'Broco', price: 8500, originalPrice: 10000, rating: 4.5, image: 'https://picsum.photos/seed/fiting1/400/400' },
  { id: 9, name: 'Kapasitor Mesin Air 8uF', category: 'Kapasitor', brand: 'Lainnya', price: 25000, originalPrice: 35000, rating: 4.4, image: 'https://picsum.photos/seed/kapasitor1/400/400' },
];

interface ProductContextType {
  products: Product[];
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, p: Omit<Product, 'id'>) => void;
  deleteProduct: (id: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('oma_products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  useEffect(() => {
    localStorage.setItem('oma_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (p: Omit<Product, 'id'>) => {
    const newId = products.length > 0 ? Math.max(...products.map(x => x.id)) + 1 : 1;
    setProducts([...products, { ...p, id: newId }]);
  };

  const updateProduct = (id: number, p: Omit<Product, 'id'>) => {
    setProducts(products.map(x => x.id === id ? { ...p, id } : x));
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(x => x.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
};

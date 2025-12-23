import axios from 'axios';
import React, { createContext, ReactNode, useState } from 'react';

/* =======================
   Types & Interfaces
======================= */

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

interface ApiContextType {
  products: Product[];
  fetchProducts: (refresh?: boolean) => Promise<void>;
}

interface ApiProviderProps {
  children: ReactNode;
}

/* =======================
   Context
======================= */

export const ApiContext = createContext<ApiContextType>({
  products: [],
  fetchProducts: async () => {},
});

/* =======================
   Provider
======================= */

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);

  const fetchProducts = async (refresh: boolean = false): Promise<void> => {
    const currentPage = refresh ? 1 : page;

    const res = await axios.get<Product[]>(
      `https://fakestoreapi.com/products?limit=10&page=${currentPage}`
    );

    setProducts(prev =>
      refresh ? res.data : [...prev, ...res.data]
    );

    setPage(currentPage + 1);
  };

  return (
    <ApiContext.Provider value={{ products, fetchProducts }}>
      {children}
    </ApiContext.Provider>
  );
};

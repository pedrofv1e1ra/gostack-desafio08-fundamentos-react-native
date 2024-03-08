import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const StoredProducts = await AsyncStorage.getItem('@GoStack:Products');
      if (StoredProducts !== null) setProducts(JSON.parse(StoredProducts));
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const projectIndex = products.findIndex(p => p.id === product.id);

      let new_products = products.slice();
      if (projectIndex < 0) {
        // ADD A NEW ITEM TO THE CART
        const new_product = {
          id: product.id,
          title: product.title,
          image_url: product.image_url,
          price: product.price,
          quantity: 1,
        };
        new_products = [...products, new_product];
      } else {
        // INCREMENT A NEW ITEM TO EXISTENT PRODUCT THE CART
        new_products[projectIndex].quantity += 1;
      }
      setProducts(new_products);
      await AsyncStorage.setItem(
        '@GoStack:Products',
        JSON.stringify(new_products),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      // INCREMENTS A PRODUCT QUANTITY IN THE CART
      const projectIndex = products.findIndex(p => p.id === id);
      if (projectIndex >= 0) {
        const new_products = products.slice();
        new_products[projectIndex].quantity += 1;
        setProducts(new_products);
        await AsyncStorage.setItem(
          '@GoStack:Products',
          JSON.stringify(new_products),
        );
      }
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // DECREMENTS A PRODUCT QUANTITY IN THE CART
      const projectIndex = products.findIndex(p => p.id === id);
      if (projectIndex >= 0) {
        const new_products = products.slice();
        if (new_products[projectIndex].quantity > 0) {
          new_products[projectIndex].quantity -= 1;

          setProducts(new_products);
          await AsyncStorage.setItem(
            '@GoStack:Products',
            JSON.stringify(new_products),
          );
        }
      }
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image_url?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("jordigpt_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart", e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("jordigpt_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems((currentItems) => {
      const exists = currentItems.find((item) => item.id === newItem.id);
      if (exists) {
        toast.info("Este producto ya está en el carrito");
        setIsOpen(true);
        return currentItems;
      }
      toast.success("Agregado al carrito");
      setIsOpen(true);
      return [...currentItems, newItem];
    });
  };

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        isOpen,
        setIsOpen,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
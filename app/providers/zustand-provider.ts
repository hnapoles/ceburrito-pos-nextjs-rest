import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { OrderLineBase } from '../models/orders-model';

interface StoreState {
  storeName: string | null;
  storeColor: string | null;
  setStoreName: (name: string) => void;
  setStoreColor: (color: string) => void;
}

export const useStoreName = create<StoreState>()(
  persist(
    (set) => ({
      storeName: null,
      storeColor: 'purple-500', // Default color
      setStoreName: (name) => set({ storeName: name }),
      setStoreColor: (color) => {
        set(() => ({ storeColor: color }));
      },
    }),
    {
      name: 'store-settings', // Key used in localStorage
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// Define Zustand store with localStorage persistence
interface CartStoreState {
  orderLines: OrderLineBase[];
  addOrUpdateOrderLine: (newOrder: OrderLineBase) => void;
  replaceAllOrderLines: (newOrderLines: OrderLineBase[]) => void;
  removeOrderLine: (
    productName: string,
    sizeOption?: string,
    spiceOption?: string,
  ) => void;
  clearCart: () => void;
  totalAmount: () => number; // Function to get total amount
  totalItems: () => number; // Function to get total quantity count
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      orderLines: [],

      // Store Update Function - Adding or Updating Order Line
      addOrUpdateOrderLine: (newOrder) => {
        set((state) => {
          // Check if the order exists based on unique criteria (productName, sizeOption, spiceOption)
          const existingIndex = state.orderLines.findIndex(
            (order) =>
              order.productName === newOrder.productName &&
              order.sizeOption === newOrder.sizeOption &&
              order.spiceOption === newOrder.spiceOption,
          );

          if (existingIndex !== -1) {
            // Update the existing order line (increase quantity and recalculate amount)
            const updatedOrderLines = [...state.orderLines];
            const existingOrder = updatedOrderLines[existingIndex];

            // Increase quantity and recalculate amount
            updatedOrderLines[existingIndex] = {
              ...existingOrder,
              quantity: existingOrder.quantity + newOrder.quantity, // Increase by the new quantity
              amount:
                existingOrder.unitPrice *
                (existingOrder.quantity + newOrder.quantity), // Update amount
            };

            return { orderLines: updatedOrderLines }; // Return updated state
          } else {
            // Add new order line if it doesn't exist
            return { orderLines: [...state.orderLines, newOrder] };
          }
        });
      },

      replaceAllOrderLines: (newOrderLines) => {
        set(() => ({ orderLines: newOrderLines }));
      },

      removeOrderLine: (productName, sizeOption, spiceOption) => {
        set((state) => ({
          orderLines: state.orderLines.filter(
            (order) =>
              order.productName !== productName ||
              order.sizeOption !== sizeOption ||
              order.spiceOption !== spiceOption,
          ),
        }));
      },

      clearCart: () => set({ orderLines: [] }),
      totalAmount: () =>
        get().orderLines.reduce((sum, item) => sum + item.amount, 0),
      totalItems: () =>
        get().orderLines.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'cart-storage', // Key used in localStorage
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

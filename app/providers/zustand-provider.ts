import { create } from 'zustand';

import { ProductBase, ProductSellingPriceBase } from '../models/products-model';
import { OrderLineBase } from '../models/orders-model';

//this is the only being used for now -- all other store is not used
interface StoreState {
  storeName: string | null;
  setStoreName: (name: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  storeName:
    typeof window !== 'undefined' ? localStorage.getItem('storeName') : null,
  setStoreName: (name) => {
    localStorage.setItem('storeName', name);
    set({ storeName: name });
  },
}));

interface CartStoreState {
  orderLines: OrderLineBase[];
  addOrUpdateOrderLine: (newOrder: OrderLineBase) => void;
  removeOrderLine: (
    productName: string,
    sizeOption?: string,
    spiceOption?: string,
  ) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStoreState>((set) => ({
  orderLines: [],

  addOrUpdateOrderLine: (newOrder) => {
    set((state) => {
      const existingIndex = state.orderLines.findIndex(
        (order) =>
          order.productName === newOrder.productName &&
          order.sizeOption === newOrder.sizeOption &&
          order.spiceOption === newOrder.spiceOption,
      );

      if (existingIndex !== -1) {
        // Update the existing order line (increase quantity)
        const updatedOrderLines = [...state.orderLines];
        updatedOrderLines[existingIndex] = {
          ...updatedOrderLines[existingIndex],
          quantity:
            updatedOrderLines[existingIndex].quantity + newOrder.quantity,
          amount: updatedOrderLines[existingIndex].amount + newOrder.amount,
        };
        return { orderLines: updatedOrderLines };
      } else {
        // Add a new order line
        return { orderLines: [...state.orderLines, newOrder] };
      }
    });
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
}));

/*
import { useCartStore } from "@/store/CartStore";

const addItemToCart = () => {
  const addOrUpdateOrderLine = useCartStore((state) => state.addOrUpdateOrderLine);

  addOrUpdateOrderLine({
    productId: "123",
    productName: "Classic Beef Burrito",
    sizeOption: "Large",
    spiceOption: "Medium",
    quantity: 2,
    unitPrice: 100,
    amount: 200,
  });
};

const removeItem = () => {
  const removeOrderLine = useCartStore((state) => state.removeOrderLine);

  removeOrderLine("Classic Beef Burrito", "Large", "Medium");
};


const clearCart = useCartStore((state) => state.clearCart);
clearCart();

*/

//not used - for now
type DialogStore = {
  isCreateDialogOpen: boolean;
  openCreateDialog: () => void;
  closeCreateDialog: () => void;
  toggleCreateDialog: () => void;
  isUpdateDialogOpen: boolean;
  openUpdateDialog: () => void;
  closeUpdateDialog: () => void;
  toggleUpdateDialog: () => void;
  updateDialogId: string;
  setUpdateDialogId: (currentId: string) => void;
};

export const useDialogStore = create<DialogStore>((set, get) => ({
  isCreateDialogOpen: false,
  openCreateDialog: () => set({ isCreateDialogOpen: true }),
  closeCreateDialog: () => set({ isCreateDialogOpen: false }),
  toggleCreateDialog: () =>
    set((state) => ({ isCreateDialogOpen: !state.isCreateDialogOpen })),
  isUpdateDialogOpen: false,
  openUpdateDialog: () => set({ isUpdateDialogOpen: true }),
  closeUpdateDialog: () => set({ isUpdateDialogOpen: false }),
  toggleUpdateDialog: () =>
    set((state) => ({ isUpdateDialogOpen: !state.isUpdateDialogOpen })),
  updateDialogId: '',
  //setUpdateDialogId: (currentId) => set({ updateDialogId: currentId }),
  setUpdateDialogId: (currentId) => {
    set({ updateDialogId: currentId });
    get().updateDialogId;
  },
}));

export type DataStore<T> = {
  data: T | null;
  setData: (data: T) => void;
};

// Function to create a generic Zustand store
export const createDataStore = <T>() =>
  create<DataStore<T>>((set) => ({
    data: null,
    setData: (data: T) => set(() => ({ data })),
  }));

// Define the structure of your global store
type GlobalStore = {
  products: ProductBase[] | null;
  product: ProductBase | null;
  productSellingPrices: ProductSellingPriceBase | null;
  setProducts: (products: ProductBase[]) => void;
  setProduct: (product: ProductBase) => void;
  setProductSellingPrices: (
    productSellingPrices: ProductSellingPriceBase,
  ) => void;
};

// Create a global store with Zustand
export const useGlobalStore = create<GlobalStore>((set) => ({
  products: null,
  product: null,
  productSellingPrices: null,
  setProducts: (products) => set(() => ({ products })),
  setProduct: (product) => set(() => ({ product })),
  setProductSellingPrices: (productSellingPrices) =>
    set(() => ({ productSellingPrices })),
}));

/* Example usage:
import { useGlobalStore } from "@/store/globalStore"; // Adjust the path as needed

function SomeComponent() {
  const setProduct = useGlobalStore((state) => state.setProduct);
  const setUser = useGlobalStore((state) => state.setUser);

  return (
    <button
      onClick={() => {
        setProduct({ id: "101", name: "Gaming Laptop", price: 1499.99 });
        setUser({ id: "1", username: "johndoe", email: "john@example.com" });
      }}
    >
      Set Global Data
    </button>
  );
}

import { useGlobalStore } from "@/store/globalStore"; 

function DisplayComponent() {
  const product = useGlobalStore((state) => state.product);
  const user = useGlobalStore((state) => state.user);

  return (
    <div>
      <h2>Product: {product?.name || "No product selected"}</h2>
      <h2>User: {user?.username || "No user set"}</h2>
    </div>
  );
}


*/

/* Example usage of DataStore 
type User = {
  id: string;
  username: string;
  email: string;
};

const useUserStore = createDataStore<User>();

useUserStore.getState().setData({ id: "1", username: "john_doe", email: "john@example.com" });

console.log(useUserStore.getState().data); // Output: { id: "1", username: "john_doe", email: "john@example.com" }
*/

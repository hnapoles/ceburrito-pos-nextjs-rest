import { create } from 'zustand';

import { ProductData, ProductSellingPricesData } from '../model/products-model';

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
  products: ProductData[] | null;
  product: ProductData | null;
  productSellingPrices: ProductSellingPricesData | null;
  setProducts: (products: ProductData[]) => void;
  setProduct: (product: ProductData) => void;
  setProductSellingPrices: (
    productSellingPrices: ProductSellingPricesData,
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

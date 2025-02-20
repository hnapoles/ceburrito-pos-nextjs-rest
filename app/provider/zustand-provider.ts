import { create } from "zustand";

type DialogStore = {
    isCreateDialogOpen: boolean;
    openCreateDialog: () => void;
    closeCreateDialog: () => void;
    toggleCreateDialog: () => void;
};



export const useDialogStore = create<DialogStore>((set) => ({
    isCreateDialogOpen: false,
    openCreateDialog: () => set({ isCreateDialogOpen: true }),
    closeCreateDialog: () => set({ isCreateDialogOpen: false }),
    toggleCreateDialog: () => set((state) => ({ isCreateDialogOpen: !state.isCreateDialogOpen })),
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
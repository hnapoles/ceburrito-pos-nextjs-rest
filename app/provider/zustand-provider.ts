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
  toggleCreateDialog: () => set( (state) => ({ isCreateDialogOpen: !state.isCreateDialogOpen }) ),
}));


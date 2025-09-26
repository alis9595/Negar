import { create } from "zustand";

type TInitialValues = { id: string; title: string };
type TRenameModal = {
  isOpen: boolean;
  initialValues: TInitialValues;
  onOpen: (id: string, title: string) => void;
  onClose: () => void;
};

const defaultValues = { id: "", title: "" };

export const useRenameModal = create<TRenameModal>((set) => ({
  isOpen: false,
  initialValues: defaultValues,
  onOpen: (id, title) =>
    set({
      isOpen: true,
      initialValues: { id, title },
    }),
  onClose: () =>
    set({
      isOpen: false,
      initialValues: defaultValues,
    }),
}));

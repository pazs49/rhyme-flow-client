import { create } from "zustand";

const useCurrentActiveMenu = create((set) => ({
  currentActiveMenu: "Feed",
  setActiveMenu: (menu) => set(() => ({ currentActiveMenu: menu })),
}));

export default useCurrentActiveMenu;

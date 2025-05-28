import { create } from "zustand";

const useCurrentUserInfo = create((set) => ({
  currentUserInfo: { email: "qwerty123@email.com" },
  setActiveUser: (user) =>
    set(() => ({
      currentUserInfo: {
        email: user.email,
      },
    })),
}));

export default useCurrentUserInfo;

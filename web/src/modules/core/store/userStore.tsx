import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the store

export interface User {
  id: string;
  email: string;
  roleId:string
  token:string
}

interface UserState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null, // Initial state
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "user-storage",
    }
  )
);

export default useUserStore;

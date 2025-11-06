import { create } from "zustand"
import type { User, UserRole } from "@/types"

interface StoreState {
  currentUser?: User
  currentRole: UserRole
  isAuthenticated: boolean
  setUser: (user: User | undefined) => void
  setRole: (role: UserRole) => void
  login: (user: User) => void
  logout: () => void
  switchRole: (role: UserRole) => void
}

export const useAppStore = create<StoreState>((set) => ({
  currentUser: undefined,
  currentRole: "guest",
  isAuthenticated: false,

  setUser: (user: User | undefined) => set({ currentUser: user }),

  setRole: (role: UserRole) => set({ currentRole: role }),

  login: (user: User) =>
    set({
      currentUser: user,
      currentRole: user.role,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      currentUser: undefined,
      currentRole: "guest",
      isAuthenticated: false,
    }),

  switchRole: (role: UserRole) =>
    set({
      currentRole: role,
    }),
}))

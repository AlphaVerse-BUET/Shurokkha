import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, UserRole } from "@/types"
import type { CurrencyUnit } from "@/lib/currency-formatter"

interface StoreState {
  currentUser?: User
  currentRole: UserRole
  isAuthenticated: boolean
  currencyUnit: CurrencyUnit
  setUser: (user: User | undefined) => void
  setRole: (role: UserRole) => void
  setCurrencyUnit: (unit: CurrencyUnit) => void
  login: (user: User) => void
  logout: () => void
  switchRole: (role: UserRole) => void
}

export const useAppStore = create<StoreState>()(
  persist(
    (set) => ({
      currentUser: undefined,
      currentRole: "guest",
      isAuthenticated: false,
      currencyUnit: "default",

      setUser: (user: User | undefined) => set({ currentUser: user }),

      setRole: (role: UserRole) => set({ currentRole: role }),

      setCurrencyUnit: (unit: CurrencyUnit) => set({ currencyUnit: unit }),

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
    }),
    {
      name: "shurokkha-storage",
      partialize: (state) => ({
        currencyUnit: state.currencyUnit,
      }),
    }
  )
)

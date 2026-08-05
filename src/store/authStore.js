import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Auth store: holds the logged-in user + JWT.
 * Persisted to localStorage so a page refresh doesn't log the user out.
 * Any module that calls the real API (Category, Product, ...) reads the
 * token from here via the axios interceptor in services/api.js.
 */
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: ({ user, token }) => set({ user, token, isAuthenticated: true }),

      updateUser: (user) => set({ user }),

      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "petshop-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;

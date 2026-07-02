import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserInfo {
  id: number;
  phoneNumber: string;
  firstName: string | null;
  lastName: string | null;
}

interface Organization {
  id: number;
  name: string;
  role: string;
}

interface AuthState {
  // state
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: UserInfo | null;
  selectedOrganization: Organization | null;

  // actions
  login: (accessToken: string, refreshToken: string, user: UserInfo) => void;
  logout: () => void;
  setSelectedOrganization: (org: Organization) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // initial state
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      user: null,
      selectedOrganization: null,

      // actions
      login: (accessToken, refreshToken, user) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
          user,
        }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          user: null,
          selectedOrganization: null,
        }),

      setSelectedOrganization: (org) =>
        set({ selectedOrganization: org }),
    }),
    {
      name: "auth-storage", // saves to localStorage with this key
    }
  )
);
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch (e) {
      return null;
    }
  })(),
  token: localStorage.getItem('access_token') || null,
  
  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('access_token', token);
    set({ user, token });
  },
  
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    set({ user: null, token: null });
  },
  
  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  activeTab: 'dashboard',
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

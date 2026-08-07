import { create } from 'zustand';

type AppState = {
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (hasCompletedOnboarding: boolean) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  hasCompletedOnboarding: false,
  setHasCompletedOnboarding: (hasCompletedOnboarding) => set({ hasCompletedOnboarding }),
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  resetOnboarding: () => set({ hasCompletedOnboarding: false }),
}));

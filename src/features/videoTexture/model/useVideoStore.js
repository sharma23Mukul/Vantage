import { create } from 'zustand';

export const useVideoStore = create((set) => ({
  isVideoActive: false,
  toggleVideo: () => set((state) => ({ isVideoActive: !state.isVideoActive })),
}));

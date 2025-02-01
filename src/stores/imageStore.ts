// stores/imageStore.ts
import { create } from 'zustand';

interface ImageState {
  imageUrl: string | null;
  setImageUrl: (url: string) => void;
  clearImage: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useImageStore = create<ImageState>((set) => ({
  imageUrl: null,
  setImageUrl: (url) => set({ imageUrl: url, error: null }),
  clearImage: () => set({ imageUrl: null }),
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  error: null,
  setError: (error) => set({ error }),
}));
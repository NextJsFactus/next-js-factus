// components/ImageStatus.tsx
"use client";

import { useImageStore } from '@/stores/imageStore';

export const ImageStatus = () => {
  const { imageUrl, isLoading, error } = useImageStore();

  if (isLoading) {
    return <p className="text-blue-600">Subiendo imagen...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (imageUrl) {
    return (
      <div className="mt-4">
        <p className="text-green-600">¡Imagen subida exitosamente!</p>
        <input
          type="hidden"
          name="imageUrl"
          value={imageUrl}
          readOnly
        />
      </div>
    );
  }

  return null;
};
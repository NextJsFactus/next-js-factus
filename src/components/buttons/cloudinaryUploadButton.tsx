// components/CloudinaryUploadButton.tsx
"use client";

import { useRef, useState } from 'react';
import { useImageStore } from '@/stores/imageStore';

export const CloudinaryUploadButton = () => {
  const { setImageUrl, setLoading, setError } = useImageStore();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE = Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB || 5) * 1024 * 1024;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Validaciones
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen');
      return;
    }

    if (file.size > MAX_SIZE) {
      setError(`El archivo no puede superar ${process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB || 5}MB`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Mostrar preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      // Subir a través de tu API
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error en la subida');
      }

      const data = await response.json();
      setImageUrl(data.secure_url);

    } catch (error) {
      console.error('Error:', error);
      setError('Error al subir el archivo');
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Subir Imagen
      </button>

      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Preview"
            className="max-w-[200px] h-auto rounded-lg border"
          />
        </div>
      )}
    </div>
  );
};
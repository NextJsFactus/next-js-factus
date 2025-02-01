// app/company/form.tsx
"use client";

import { useState, useEffect } from 'react';
import { useImageStore } from '@/stores/imageStore';
import { CloudinaryUploadButton } from '@/components/buttons/cloudinaryUploadButton';
import { ImageStatus }  from '../image/imageStatus';

export const CompanyForm = ({ initialData }: { initialData?: any }) => {
  const { imageUrl, clearImage } = useImageStore();
  const [formData, setFormData] = useState({
    name: '',
    nit: '',
    phone: '',
    address: '',
    email: '',
    urllogo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, urllogo: imageUrl || '' }));
  }, [imageUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validación básica
      if (!formData.name || !formData.nit || !formData.email) {
        throw new Error('Nombre, NIT y Email son campos requeridos');
      }

      const method = initialData ? 'PUT' : 'POST';
      const url = '/api/company' + (initialData ? `?id=${initialData.id}` : '');

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar los datos');
      }

      const result = await response.json();
      clearImage();
      alert(initialData ? 'Empresa actualizada!' : 'Empresa creada!');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? 'Editar Empresa' : 'Crear Nueva Empresa'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Logo de la empresa</label>
            <CloudinaryUploadButton />
            <ImageStatus />
            <input
              type="hidden"
              name="urllogo"
              value={formData.urllogo}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nombre de la empresa *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">NIT *</label>
            <input
              type="text"
              name="nit"
              value={formData.nit}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !formData.urllogo}
        className={`mt-6 w-full py-2 px-4 rounded-lg font-medium text-white transition-colors
          ${isSubmitting || !formData.urllogo
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isSubmitting ? 'Guardando...' : 'Guardar Empresa'}
      </button>
    </form>
  );
};
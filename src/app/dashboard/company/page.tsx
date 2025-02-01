// app/company/page.tsx
"use client";

import { CompanyForm } from '@/components/forms/companyForm';
import { useEffect } from 'react';
import { useImageStore } from '@/stores/imageStore';

export default function CompanyPage() {
  const { clearImage } = useImageStore();

  // Limpiar el estado al salir de la página
  useEffect(() => {
    return () => clearImage();
  }, [clearImage]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <CompanyForm />
    </div>
  );
}
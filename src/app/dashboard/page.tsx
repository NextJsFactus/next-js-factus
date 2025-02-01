'use client'
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { 
  Menu, X, Home, Building2, Users, Package, 
  LogOut, BadgeDollarSign, FileCheck 
} from 'lucide-react';

export default function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { data: session } = useSession();

  const menuItems = [
    { icon: Home, label: 'Inicio', href: '/dashboard' },
    { icon: Building2, label: 'Perfil Empresa', href: '/dashboard/company' },
    { icon: Users, label: 'Clientes', href: '/dashboard/clientes' },
    { icon: Package, label: 'Productos', href: '/dashboard/productos' },    
    { icon: BadgeDollarSign, label: 'Ventas', href: '/dashboard/ventas' },
    { icon: FileCheck, label: 'Facturar', href: '/dashboard/facturar' },

  ];

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar para móvil - overlay */}
      <div 
        className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-20 lg:hidden ${
          isSidebarOpen ? 'block' : 'hidden'
        }`} 
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-blue-600 text-white transform transition-transform duration-300 ease-in-out z-30
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-500">
          <h1 className="text-xl font-bold">Factus</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-blue-500">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        {/* Top navbar */}
        <nav className="bg-white shadow-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-blue-600">
              Dashboard de Factus
            </h1>
          </div>
          <div className="flex items-center space-x-4 gap-3">
            Bienvenido
            <span>
              {session?.user?.name}
            </span>
            <span className="hidden md:block text-gray-600 gap-4">
                {session?.user?.email}
            </span>
          </div>
        </nav>

        {/* Page content */}
        <div className="p-8">
          <h2 className="text-xl font-semibold mb-4">Bienvenido al Dashboard</h2>
          <p>Aquí puedes gestionar tus facturas electrónicas.</p>
        </div>
      </div>
    </div>
  );
}
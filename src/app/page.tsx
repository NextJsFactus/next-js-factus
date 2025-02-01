import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white">
      {/* Navbar */}
      <nav className="absolute top-0 w-full p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Factus</h1>
        <div className="space-x-4">
          <Link href="/login" className="hover:underline">
            Iniciar Sesión
          </Link>
          <Link href="/register" className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100">
            Registrarse
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">Bienvenido a Factus</h1>
        <p className="text-xl mb-8">
          Simplifica tu facturación electrónica con nuestra plataforma.
        </p>
        <div className="space-x-4">
          <Link
            href="/dashboard"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Comenzar a facturar
          </Link>
          <Link
            href="/register"
            className="bg-transparent border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600"
          >
            Crear Cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}
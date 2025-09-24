import Link from "next/link";
import "../globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <div className="w-64 bg-slate-800 text-white">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GD</span>
                </div>
                <span className="text-xl font-semibold">GymDash</span>
              </div>
              
              <nav className="space-y-2">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                  Dashboard
                </Link>
                
                <Link href="/clientes" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                  </svg>
                  Clientes
                </Link>
                
                <Link href="/membresias" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                  Rutinas
                </Link>
                
                <Link href="/estadisticas" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                  </svg>
                  Estadísticas
                </Link>
                
                <Link href="/entradas" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                  Notificaciones
                </Link>
                
                <Link href="/tipos-membresia" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                  </svg>
                  Configuración
                </Link>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Top Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">CR</span>
                  <span className="text-sm font-medium text-gray-900">Carlos Rodríguez</span>
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </header>
            
            {/* Page Content */}
            <main className="flex-1 p-6 bg-gray-50">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

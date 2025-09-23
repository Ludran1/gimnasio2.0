import Link from "next/link";
import "../globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <nav className="bg-gray-800 p-4 text-white flex gap-4">
          <Link href="/clientes">Clientes</Link>
          <Link href="/membresias">Membresías</Link>
          <Link href="/entradas">Entradas</Link>
          <Link href="/estadisticas">Estadísticas</Link>
          <Link href="/tipos-membresia">Tipos de Membresía</Link>
        </nav>
        <div className="container mx-auto mt-8">
          {children}
        </div>
      </body>
    </html>
  );
}

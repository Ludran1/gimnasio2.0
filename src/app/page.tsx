import Link from "next/link";

export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Sistema de Membresías Gym</h1>
      <nav className="flex flex-col gap-4">
        <Link href="/clientes" className="text-blue-600 underline">Clientes</Link>
        <Link href="/membresias" className="text-blue-600 underline">Membresías</Link>
        <Link href="/entradas" className="text-blue-600 underline">Entradas</Link>
        <Link href="/estadisticas" className="text-blue-600 underline">Estadísticas</Link>
      </nav>
    </main>
  );
}

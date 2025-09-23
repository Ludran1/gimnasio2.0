"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type EstadisticaMensual = {
  mes: string;
  membresiasVendidas: number;
};

export default function EstadisticasPage() {
  const [estadisticas, setEstadisticas] = useState<EstadisticaMensual[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchEstadisticas() {
      setLoading(true);
      const { data, error } = await supabase.from("membresias").select("fecha_inicio");
      if (!error && data) {
        // Agrupar por mes
        const stats: { [mes: string]: number } = {};
        data.forEach((m: { fecha_inicio: string }) => {
          const mes = m.fecha_inicio?.slice(0, 7); // yyyy-mm
          if (mes) stats[mes] = (stats[mes] || 0) + 1;
        });
        setEstadisticas(Object.entries(stats).map(([mes, membresiasVendidas]) => ({ mes, membresiasVendidas })));
      }
      setLoading(false);
    }
    fetchEstadisticas();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Estadísticas Mensuales</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Mes</th>
            <th className="py-2 px-4 border">Membresías vendidas</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={2} className="py-4 px-4 text-center">Cargando...</td>
            </tr>
          ) : estadisticas.length === 0 ? (
            <tr>
              <td colSpan={2} className="py-4 px-4 text-center">No hay datos disponibles.</td>
            </tr>
          ) : (
            estadisticas.map(e => (
              <tr key={e.mes}>
                <td className="py-2 px-4 border">{e.mes}</td>
                <td className="py-2 px-4 border">{e.membresiasVendidas}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
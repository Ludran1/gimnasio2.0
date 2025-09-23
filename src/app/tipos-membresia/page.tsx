"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// Tipo de membresía
interface TipoMembresia {
  id: string;
  nombre: string;
  duracion_dias: number;
  frecuencia: string;
}

export default function TiposMembresiaPage() {
  const [form, setForm] = useState({ nombre: "", duracion_dias: 30, frecuencia: "diario" });
  const [error, setError] = useState("");
  const [tipos, setTipos] = useState<TipoMembresia[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTipos() {
      setLoading(true);
      const { data } = await supabase.from("tipos_membresia").select("*");
      if (data) setTipos(data);
      setLoading(false);
    }
    fetchTipos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    setError("");
    const { error: insertError } = await supabase.from("tipos_membresia").insert({
      nombre: form.nombre,
      duracion_dias: Number(form.duracion_dias),
      frecuencia: form.frecuencia,
    });
    if (insertError) {
      setError("Error al registrar tipo de membresía");
      return;
    }
    setForm({ nombre: "", duracion_dias: 30, frecuencia: "diario" });
    const { data } = await supabase.from("tipos_membresia").select("*");
    if (data) setTipos(data);
  };

  async function eliminarTipo(id: string) {
    await supabase.from("tipos_membresia").delete().eq("id", id);
    const { data } = await supabase.from("tipos_membresia").select("*");
    if (data) setTipos(data);
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tipos de Membresía</h1>
      <form className="mb-8 bg-gray-100 p-4 rounded" onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block mb-1 font-semibold">Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="border px-2 py-1 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1 font-semibold">Duración (días) *</label>
          <input
            type="number"
            name="duracion_dias"
            value={form.duracion_dias}
            onChange={handleChange}
            required
            min={1}
            className="border px-2 py-1 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1 font-semibold">Frecuencia *</label>
          <select
            name="frecuencia"
            value={form.frecuencia}
            onChange={handleChange}
            required
            className="border px-2 py-1 w-full"
          >
            <option value="diario">Diario</option>
            <option value="interdiario">Interdiario</option>
          </select>
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Registrar tipo</button>
      </form>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Nombre</th>
            <th className="py-2 px-4 border">Duración (días)</th>
            <th className="py-2 px-4 border">Frecuencia</th>
            <th className="py-2 px-4 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="py-4 px-4 text-center">Cargando...</td>
            </tr>
          ) : tipos.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-4 px-4 text-center">No hay tipos registrados.</td>
            </tr>
          ) : (
            tipos.map(tipo => (
              <tr key={tipo.id}>
                <td className="py-2 px-4 border">{tipo.nombre}</td>
                <td className="py-2 px-4 border">{tipo.duracion_dias}</td>
                <td className="py-2 px-4 border">{tipo.frecuencia}</td>
                <td className="py-2 px-4 border">
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => eliminarTipo(tipo.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}

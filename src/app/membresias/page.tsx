"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Membresia = {
  id: string;
  cliente_id: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
};

export default function MembresiasPage() {
  const [form, setForm] = useState({
    cliente_id: "",
    tipo: "",
    fecha_inicio: "",
    fecha_fin: "",
  });
  const [error, setError] = useState("");
  const [membresias, setMembresias] = useState<Membresia[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<{id: string, nombre: string}[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: membs } = await supabase.from("membresias").select("*");
      if (membs) setMembresias(membs);
      const { data: clis } = await supabase.from("clientes").select("id, nombre");
      if (clis) setClientes(clis);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cliente_id || !form.tipo || !form.fecha_inicio || !form.fecha_fin) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    const { error: insertError } = await supabase.from("membresias").insert({
      cliente_id: form.cliente_id,
      tipo: form.tipo,
      fecha_inicio: form.fecha_inicio,
      fecha_fin: form.fecha_fin,
    });
    if (insertError) {
      setError("Error al registrar membresía");
      return;
    }
    setForm({ cliente_id: "", tipo: "", fecha_inicio: "", fecha_fin: "" });
    // Recargar membresías
    const { data } = await supabase.from("membresias").select("*");
    if (data) setMembresias(data);
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Membresías</h1>
      <form className="mb-8 bg-gray-100 p-4 rounded" onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block mb-1 font-semibold">Cliente *</label>
          <select
            name="cliente_id"
            value={form.cliente_id}
            onChange={handleChange}
            required
            className="border px-2 py-1 w-full"
          >
            <option value="">Selecciona un cliente</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block mb-1 font-semibold">Tipo de membresía *</label>
          <input
            type="text"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            required
            className="border px-2 py-1 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1 font-semibold">Fecha inicio *</label>
          <input
            type="date"
            name="fecha_inicio"
            value={form.fecha_inicio}
            onChange={handleChange}
            required
            className="border px-2 py-1 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1 font-semibold">Fecha fin *</label>
          <input
            type="date"
            name="fecha_fin"
            value={form.fecha_fin}
            onChange={handleChange}
            required
            className="border px-2 py-1 w-full"
          />
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Registrar membresía</button>
      </form>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Cliente</th>
            <th className="py-2 px-4 border">Tipo</th>
            <th className="py-2 px-4 border">Fecha inicio</th>
            <th className="py-2 px-4 border">Fecha fin</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="py-4 px-4 text-center">Cargando...</td>
            </tr>
          ) : membresias.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-4 px-4 text-center">No hay membresías registradas.</td>
            </tr>
          ) : (
            membresias.map(m => (
              <tr key={m.id}>
                <td className="py-2 px-4 border">{clientes.find(c => c.id === m.cliente_id)?.nombre || m.cliente_id}</td>
                <td className="py-2 px-4 border">
                  <input
                    type="text"
                    value={m.tipo}
                    onChange={async e => {
                      await supabase.from("membresias").update({ tipo: e.target.value }).eq("id", m.id);
                      const { data } = await supabase.from("membresias").select("*");
                      if (data) setMembresias(data);
                    }}
                    className="border px-2 py-1 w-24"
                  />
                </td>
                <td className="py-2 px-4 border">
                  <input
                    type="date"
                    value={m.fecha_inicio}
                    onChange={async e => {
                      await supabase.from("membresias").update({ fecha_inicio: e.target.value }).eq("id", m.id);
                      const { data } = await supabase.from("membresias").select("*");
                      if (data) setMembresias(data);
                    }}
                    className="border px-2 py-1 w-32"
                  />
                </td>
                <td className="py-2 px-4 border">
                  <input
                    type="date"
                    value={m.fecha_fin}
                    onChange={async e => {
                      await supabase.from("membresias").update({ fecha_fin: e.target.value }).eq("id", m.id);
                      const { data } = await supabase.from("membresias").select("*");
                      if (data) setMembresias(data);
                    }}
                    className="border px-2 py-1 w-32"
                  />
                </td>
                <td className="py-2 px-4 border">
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={async () => {
                      await supabase.from("membresias").delete().eq("id", m.id);
                      const { data } = await supabase.from("membresias").select("*");
                      if (data) setMembresias(data);
                    }}
                  >Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Entrada = {
  id: string;
  cliente_id: string;
  fecha: string;
};

export default function EntradasPage() {
  const [form, setForm] = useState({ cliente_id: "" });
  const [error, setError] = useState("");
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<{id: string, nombre: string}[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: ents } = await supabase.from("entradas").select("*");
      if (ents) setEntradas(ents);
      const { data: clis } = await supabase.from("clientes").select("id, nombre");
      if (clis) setClientes(clis);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cliente_id) {
      setError("Selecciona un cliente.");
      return;
    }
    setError("");
    const { error: insertError } = await supabase.from("entradas").insert({
      cliente_id: form.cliente_id,
      fecha: new Date().toISOString(),
    });
    if (insertError) {
      setError("Error al registrar entrada");
      return;
    }
    setForm({ cliente_id: "" });
    // Recargar entradas
    const { data } = await supabase.from("entradas").select("*");
    if (data) setEntradas(data);
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Historial de Entradas</h1>
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
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Registrar entrada</button>
      </form>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Cliente</th>
            <th className="py-2 px-4 border">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={2} className="py-4 px-4 text-center">Cargando...</td>
            </tr>
          ) : entradas.length === 0 ? (
            <tr>
              <td colSpan={2} className="py-4 px-4 text-center">No hay entradas registradas.</td>
            </tr>
          ) : (
            entradas.map(e => (
              <tr key={e.id}>
                <td className="py-2 px-4 border">{clientes.find(c => c.id === e.cliente_id)?.nombre || e.cliente_id}</td>
                <td className="py-2 px-4 border">{new Date(e.fecha).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
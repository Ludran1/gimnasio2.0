"use client";
import { useEffect } from "react";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";


type Cliente = {
  id: string;
  nombre: string;
  dni?: string;
  fechaNacimiento?: string;
  telefono?: string;
  saldoPendiente: number;
};

export default function ClientesPage() {
  const [form, setForm] = useState({
    nombre: "",
    dni: "",
    fechaNacimiento: "",
    telefono: "",
  });
  const [error, setError] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchClientes() {
      setLoading(true);
      const { data, error } = await supabase.from("clientes").select("*");
      if (!error && data) setClientes(data);
      setLoading(false);
    }
    fetchClientes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    setError("");
    const { error: insertError } = await supabase.from("clientes").insert({
      nombre: form.nombre,
      dni: form.dni || null,
      fecha_nacimiento: form.fechaNacimiento || null,
      telefono: form.telefono || null,
      saldo_pendiente: 0,
    });
    if (insertError) {
      setError("Error al registrar cliente");
      return;
    }
    setForm({ nombre: "", dni: "", fechaNacimiento: "", telefono: "" });
    // Recargar clientes
    const { data } = await supabase.from("clientes").select("*");
    if (data) setClientes(data);
  };

  async function actualizarSaldo(id: string, nuevoSaldo: number) {
    await supabase.from("clientes").update({ saldo_pendiente: nuevoSaldo }).eq("id", id);
    const { data } = await supabase.from("clientes").select("*");
    if (data) setClientes(data);
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>
      <form className="mb-8 bg-gray-100 p-4 rounded" onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block mb-1 font-semibold">Nombres completos *</label>
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
          <label className="block mb-1 font-semibold">DNI</label>
          <input
            type="text"
            name="dni"
            value={form.dni}
            onChange={handleChange}
            className="border px-2 py-1 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1 font-semibold">Fecha de nacimiento</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={form.fechaNacimiento}
            onChange={handleChange}
            className="border px-2 py-1 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1 font-semibold">Número de celular</label>
          <input
            type="text"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            className="border px-2 py-1 w-full"
          />
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Registrar cliente</button>
      </form>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Nombre</th>
            <th className="py-2 px-4 border">DNI</th>
            <th className="py-2 px-4 border">Fecha de nacimiento</th>
            <th className="py-2 px-4 border">Celular</th>
            <th className="py-2 px-4 border">Saldo Pendiente</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="py-4 px-4 text-center">Cargando...</td>
            </tr>
          ) : clientes.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-4 px-4 text-center">No hay clientes registrados.</td>
            </tr>
          ) : (
            clientes.map(cliente => (
              <tr key={cliente.id}>
                <td className="py-2 px-4 border">{cliente.nombre}</td>
                <td className="py-2 px-4 border">{cliente.dni || "-"}</td>
                <td className="py-2 px-4 border">{cliente.fechaNacimiento || "-"}</td>
                  <td className="py-2 px-4 border">{(cliente.fechaNacimiento || "-")}</td>
                <td className="py-2 px-4 border">{cliente.telefono || "-"}</td>
                <td className="py-2 px-4 border">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={cliente.saldoPendiente}
                    onChange={e => actualizarSaldo(cliente.id, parseFloat(e.target.value))}
                    className="border px-2 py-1 w-24"
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
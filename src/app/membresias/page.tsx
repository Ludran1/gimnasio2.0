"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Membresia = {
  id: string;
  cliente_id: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  frecuencia?: string;
  saldoPendiente?: number;
  metodoPago?: string;
  tipoPago?: string;
  montoCuenta?: number;
};

export default function MembresiasPage() {
  const [form, setForm] = useState({
    cliente_id: "",
    tipo_id: "",
    fecha_inicio: "",
    saldoPendiente: "",
    metodoPago: "Efectivo", // Predeterminado
    tipoPago: "Al contado", // Predeterminado
    montoCuenta: "", // Solo si es "A cuenta"
  });
  const [error, setError] = useState("");
  const [membresias, setMembresias] = useState<Membresia[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<{id: string, nombre: string}[]>([]);
  const [tipos, setTipos] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: membs } = await supabase.from("membresias").select("*");
      if (membs) setMembresias(membs);
      const { data: clis } = await supabase.from("clientes").select("id, nombre");
      if (clis) setClientes(clis);
      const { data: tps } = await supabase.from("tipos_membresia").select("*");
      if (tps) setTipos(tps);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cliente_id || !form.tipo_id || !form.fecha_inicio) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    // Validaciones adicionales
    if (form.tipoPago === "A cuenta" && (!form.montoCuenta || Number(form.montoCuenta) <= 0)) {
      setError("Debe especificar un monto válido para el pago a cuenta.");
      return;
    }
    
    if (form.saldoPendiente && Number(form.saldoPendiente) < 0) {
      setError("El saldo pendiente no puede ser negativo.");
      return;
    }
    const tipo = tipos.find(t => t.id === form.tipo_id);
    if (!tipo) {
      setError("Tipo de membresía no válido.");
      return;
    }
    // Calcular fecha fin
    const fechaInicio = new Date(form.fecha_inicio);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + tipo.duracion_dias);
    const { error: insertError } = await supabase.from("membresias").insert({
      cliente_id: form.cliente_id,
      tipo: tipo.nombre,
      fecha_inicio: form.fecha_inicio,
      fecha_fin: fechaFin.toISOString().slice(0,10),
      frecuencia: tipo.frecuencia,
      saldo_pendiente: form.saldoPendiente ? Number(form.saldoPendiente) : 0,
      metodo_pago: form.metodoPago,
      tipo_pago: form.tipoPago,
      monto_cuenta: form.tipoPago === "A cuenta" ? Number(form.montoCuenta) : 0,
    });
    
    if (insertError) {
      console.error("Error detallado:", insertError);
      setError(`Error al registrar membresía: ${insertError.message}`);
      return;
    }
    
    // Limpiar formulario solo si el insert fue exitoso
    setForm({
      cliente_id: "",
      tipo_id: "",
      fecha_inicio: "",
      saldoPendiente: "",
      metodoPago: "Efectivo",
      tipoPago: "Al contado",
      montoCuenta: ""
    });
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
          <select
            name="tipo_id"
            value={form.tipo_id}
            onChange={handleChange}
            required
            className="border px-2 py-1 w-full"
          >
            <option value="">Selecciona un tipo</option>
            {tipos.map(t => (
              <option key={t.id} value={t.id}>{t.nombre} ({t.duracion_dias} días, {t.frecuencia})</option>
            ))}
          </select>
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
          <label className="block mb-1 font-semibold">Método de pago</label>
          <select
            name="metodoPago"
            value={form.metodoPago}
            onChange={handleChange}
            className="border px-2 py-1 w-full"
          >
            <option value="Efectivo">Efectivo</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Tarjeta">Tarjeta</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block mb-1 font-semibold">Tipo de pago</label>
          <select
            name="tipoPago"
            value={form.tipoPago}
            onChange={handleChange}
            className="border px-2 py-1 w-full"
          >
            <option value="Al contado">Al contado</option>
            <option value="A cuenta">A cuenta</option>
          </select>
        </div>
        {form.tipoPago === "A cuenta" && (
          <div className="mb-2">
            <label className="block mb-1 font-semibold">Monto a cuenta</label>
            <input
              type="number"
              name="montoCuenta"
              value={form.montoCuenta}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="border px-2 py-1 w-full"
              placeholder="Monto que deja a cuenta"
            />
          </div>
        )}
        <div className="mb-2">
          <label className="block mb-1 font-semibold">Saldo pendiente</label>
          <input
            type="number"
            name="saldoPendiente"
            value={form.saldoPendiente}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="border px-2 py-1 w-full"
            placeholder="Saldo pendiente del cliente"
          />
        </div>
        {/* La fecha fin se calcula automáticamente */}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Registrar membresía</button>
      </form>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Cliente</th>
            <th className="py-2 px-4 border">Tipo</th>
            <th className="py-2 px-4 border">Frecuencia</th>
            <th className="py-2 px-4 border">Fecha inicio</th>
            <th className="py-2 px-4 border">Fecha fin</th>
            <th className="py-2 px-4 border">Saldo pendiente</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="py-4 px-4 text-center">Cargando...</td>
            </tr>
          ) : membresias.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-4 px-4 text-center">No hay membresías registradas.</td>
            </tr>
          ) : (
            membresias.map(m => (
              <tr key={m.id}>
                <td className="py-2 px-4 border">{clientes.find(c => c.id === m.cliente_id)?.nombre || m.cliente_id}</td>
                <td className="py-2 px-4 border">{m.tipo}</td>
                <td className="py-2 px-4 border">{m.frecuencia || "-"}</td>
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
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={m.saldoPendiente ?? 0}
                    onBlur={async e => {
                      await supabase.from("membresias").update({ saldo_pendiente: parseFloat(e.target.value) }).eq("id", m.id);
                      const { data } = await supabase.from("membresias").select("*");
                      if (data) setMembresias(data);
                    }}
                    className="border px-2 py-1 w-24"
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
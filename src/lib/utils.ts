// Funciones utilitarias para manejo de datos
import { clientes, membresias, entradas, estadisticas, Cliente, Membresia, Entrada, EstadisticaMensual } from "./data";

export function agregarCliente(cliente: Cliente) {
  clientes.push(cliente);
}

export function agregarMembresia(membresia: Membresia) {
  membresias.push(membresia);
}

export function agregarEntrada(entrada: Entrada) {
  entradas.push(entrada);
}

export function calcularEstadisticasMensuales(): EstadisticaMensual[] {
  // Agrupa membresías por mes y cuenta cuántas se vendieron
  const stats: { [mes: string]: number } = {};
  membresias.forEach(m => {
    const mes = m.fechaInicio.slice(0, 7); // yyyy-mm
    stats[mes] = (stats[mes] || 0) + 1;
  });
  return Object.entries(stats).map(([mes, membresiasVendidas]) => ({ mes, membresiasVendidas }));
}

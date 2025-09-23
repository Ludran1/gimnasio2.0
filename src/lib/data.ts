// Estructuras de datos simuladas para clientes, membresías, entradas y estadísticas
export type Cliente = {
  id: string;
  nombre: string; // obligatorio
  dni?: string;
  fechaNacimiento?: string;
  telefono?: string;
  saldoPendiente: number; // Saldo pendiente si no pagó completo
};

export type Membresia = {
  id: string;
  clienteId: string;
  tipo: string;
  fechaInicio: string;
  fechaFin: string;
};

export type Entrada = {
  id: string;
  clienteId: string;
  fecha: string;
};

export type EstadisticaMensual = {
  mes: string;
  membresiasVendidas: number;
};

// Datos simulados
export const clientes: Cliente[] = [];
export const membresias: Membresia[] = [];
export const entradas: Entrada[] = [];
export const estadisticas: EstadisticaMensual[] = [];

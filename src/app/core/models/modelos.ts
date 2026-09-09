/** Tipos de dominio compartidos por toda la aplicacion. */

export type EstadoEnvio =
  | 'REGISTRADO'
  | 'EN_ALMACEN_ORIGEN'
  | 'EN_TRANSITO'
  | 'EN_ALMACEN_DESTINO'
  | 'LISTO_PARA_RECOJO'
  | 'ENTREGADO'
  | 'INCIDENCIA'
  | 'DEVUELTO'
  | 'ANULADO';

export type Rol = 'OPERADOR' | 'ALMACEN' | 'ADMIN';

export interface Persona {
  nombres: string;
  dni: string;
  telefono?: string;
}

export interface Carga {
  descripcion: string;
  pesoKg: number;
  largoCm: number;
  anchoCm: number;
  altoCm: number;
  fragil: boolean;
}

export interface Tarifa {
  pesoVolumetrico: number;
  pesoFacturable: number;
  montoBase: number;
  recargo: number;
  total: number;
  moneda: string;
}

export interface EventoSeguimiento {
  estado: EstadoEnvio;
  fecha: string;
  agenciaId?: string;
  usuario?: string;
  observacion?: string;
}

/** Constancia de cómo se verificó el derecho a retirar la encomienda. */
export interface Entrega {
  receptorNombres: string;
  receptorDni: string;
  parentesco?: string;
  relacion?: 'TITULAR' | 'AUTORIZADO';
  claveVerificada: boolean;
  motivoSinClave?: string;
  fechaEntrega: string;
  usuario?: string;
}

export interface Envio {
  codigoRastreo: string;
  /** Código corto que el cliente presenta junto al número para consultar. */
  codigoVerificacion?: string;
  estadoActual: EstadoEnvio;
  remitente: Persona;
  destinatario: Persona;
  autorizados?: Persona[];
  carga: Carga;
  tarifa: Tarifa;
  agenciaOrigenId: string;
  agenciaDestinoId: string;
  historial: EventoSeguimiento[];
  entrega?: Entrega;
  fechaRegistro: string;
}

/** Respuesta de la admisión: la encomienda y los datos que solo se ven una vez. */
export interface Comprobante {
  envio: Envio;
  codigoVerificacion: string;
  claveRecojo: string;
  aviso: string;
}

export interface ClaveRecojo {
  codigoRastreo: string;
  claveRecojo: string;
  aviso: string;
}

/** Lo que ve el cliente en el portal público: cuatro etapas, sin jerga interna. */
export interface Tracking {
  codigoRastreo: string;
  etapa: number;
  etapaEtiqueta: string;
  mensaje: string;
  desde?: string;
  listoParaRecojo: boolean;
  finalizado: boolean;
  destinatario: string;
  documentoDestinatario: string;
  descripcionCarga: string;
  agenciaOrigen: string;
  agenciaDestino: string;
  entrega?: { receptorNombres: string; documento: string; fecha: string };
  historial: EventoSeguimiento[];
}

export interface Pagina<T> {
  contenido: T[];
  pagina: number;
  tamanio: number;
  totalElementos: number;
  totalPaginas: number;
}

export interface Agencia {
  id?: string;
  codigo: string;
  nombre: string;
  ciudad: string;
  direccion?: string;
  telefono?: string;
  activo: boolean;
}

export interface Usuario {
  id?: string;
  username: string;
  nombreCompleto: string;
  rol: Rol;
  agenciaId: string;
  activo: boolean;
  debeCambiarClave?: boolean;
}

export interface LoginResponse {
  token: string;
  /** Permite renovar el token de acceso sin volver a pedir la contraseña. */
  refreshToken: string;
  tipo: string;
  expiraEnSegundos: number;
  usuario: Usuario;
}

/** Situación de un aviso enviado al destinatario. */
export type EstadoAviso = 'PENDIENTE' | 'ENVIADO' | 'ERROR';

export interface AvisoCliente {
  id: string;
  codigoRastreo: string;
  canal: string;
  destino?: string;
  mensaje: string;
  estado: EstadoAviso;
  intentos: number;
  /** false cuando el mensaje solo quedó en la bitácora y no salió al teléfono. */
  entregaReal: boolean;
  ultimoError?: string;
  referenciaProveedor?: string;
  agenciaDestinoId?: string;
  fechaEnvio: string;
  fechaActualizacion: string;
}

export interface ClaveTemporal {
  username: string;
  claveTemporal: string;
  mensaje: string;
}

export interface ResultadoLote {
  total: number;
  actualizados: number;
  codigosActualizados: string[];
  fallidos: { codigo: string; motivo: string }[];
}

export interface Tarifario {
  id?: string;
  ruta: string;
  montoBase: number;
  precioPorKg: number;
  factorVolumetrico: number;
  recargoFragil: number;
  vigenteDesde?: string;
  activo: boolean;
}

export interface ConteoAgencia {
  agenciaId: string;
  nombre: string;
  cantidad: number;
}

export interface Resumen {
  totalEnvios: number;
  enTransito: number;
  listosParaRecojo: number;
  entregadosHoy: number;
  /** Encomiendas que llevan más de tres días esperando a su destinatario. */
  porRecogerHace3Dias: number;
  /** Arqueo del propio usuario: lo que admitió y cobró hoy. */
  misAdmisionesHoy?: number;
  miCajaHoy?: number;
  /**
   * Los importes de la red son información económica de la empresa: la API
   * solo los devuelve a la administración, por eso son opcionales aquí.
   */
  ingresosHoy?: number;
  ingresosMes?: number;
  ticketPromedio?: number;
  porEstado: Record<string, number>;
  porAgenciaDestino: ConteoAgencia[];
}

export interface FiltroEnvios {
  estado?: EstadoEnvio | '';
  agenciaDestinoId?: string;
  agenciaOrigenId?: string;
  desde?: string;
  hasta?: string;
  texto?: string;
  pagina?: number;
  tamanio?: number;
}

/** Etiquetas legibles y color de cada estado. */
export const ESTADOS: Record<EstadoEnvio, { etiqueta: string; color: string }> = {
  REGISTRADO:         { etiqueta: 'Registrado',          color: 'azul' },
  EN_ALMACEN_ORIGEN:  { etiqueta: 'En almacén origen',   color: 'azul' },
  EN_TRANSITO:        { etiqueta: 'En tránsito',         color: 'naranja' },
  EN_ALMACEN_DESTINO: { etiqueta: 'En almacén destino',  color: 'azul' },
  LISTO_PARA_RECOJO:  { etiqueta: 'Listo para recojo',   color: 'morado' },
  ENTREGADO:          { etiqueta: 'Entregado',           color: 'verde' },
  INCIDENCIA:         { etiqueta: 'Incidencia',          color: 'rojo' },
  DEVUELTO:           { etiqueta: 'Devuelto',            color: 'gris' },
  ANULADO:            { etiqueta: 'Anulado',             color: 'gris' },
};

export const ORDEN_ESTADOS: EstadoEnvio[] = [
  'REGISTRADO', 'EN_ALMACEN_ORIGEN', 'EN_TRANSITO',
  'EN_ALMACEN_DESTINO', 'LISTO_PARA_RECOJO', 'ENTREGADO',
];

/** Estados desde los que todavia se puede anular la admision. */
export const ANULABLES: EstadoEnvio[] = ['REGISTRADO', 'EN_ALMACEN_ORIGEN'];

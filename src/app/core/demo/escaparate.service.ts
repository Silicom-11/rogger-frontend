import { Injectable, signal } from '@angular/core';
import {
  Agencia, AvisoCliente, Comprobante, Envio, EstadoEnvio, Pagina,
  Resumen, Rol, Tarifa, Tarifario, Tracking, Usuario,
} from '../models/modelos';
import {
  AGENCIAS_DEMO, AVISOS_DEMO, ENVIOS_DEMO, RASTREOS_DEMO,
  TARIFARIO_DEMO, USUARIOS_DEMO,
} from './datos-demo';

/**
 * Estado del modo escaparate.
 *
 * La aplicación publicada no tiene back-end: este servicio guarda los datos en
 * memoria y responde lo mismo que respondería la API, de modo que las pantallas
 * se recorren completas —incluidas las acciones— sin nada detrás. Al recargar
 * la página todo vuelve a su punto de partida.
 */
@Injectable({ providedIn: 'root' })
export class EscaparateService {

  private readonly envios = signal<Envio[]>(clonar(ENVIOS_DEMO));
  private readonly agencias = signal<Agencia[]>(clonar(AGENCIAS_DEMO));
  private readonly usuarios = signal<Usuario[]>(clonar(USUARIOS_DEMO));
  private readonly tarifario = signal<Tarifario[]>(clonar(TARIFARIO_DEMO));
  private readonly avisos = signal<AvisoCliente[]>(clonar(AVISOS_DEMO));

  /** Claves de recojo en claro: en el sistema real solo existe su hash. */
  private readonly claves = new Map<string, string>();

  private secuencia = 100;

  // ------------------------------------------------------------------ acceso

  usuarioPorNombre(username: string): Usuario | undefined {
    return this.usuarios().find((u) => u.username === username);
  }

  usuarioPorRol(rol: Rol): Usuario {
    return this.usuarios().find((u) => u.rol === rol) ?? this.usuarios()[0];
  }

  // ---------------------------------------------------------------- consultas

  buscar(params: URLSearchParams): Pagina<Envio> {
    const estado = params.get('estado');
    const texto = (params.get('texto') ?? '').trim().toLowerCase();
    const destino = params.get('agenciaDestinoId');
    const origen = params.get('agenciaOrigenId');
    const pagina = Number(params.get('pagina') ?? 0);
    const tamanio = Number(params.get('tamanio') ?? 10);

    const filtrados = this.envios().filter((e) => {
      if (estado && e.estadoActual !== estado) return false;
      if (destino && e.agenciaDestinoId !== destino) return false;
      if (origen && e.agenciaOrigenId !== origen) return false;
      if (texto) {
        const campos = [
          e.codigoRastreo, e.destinatario.dni, e.destinatario.nombres, e.remitente.dni,
        ].join(' ').toLowerCase();
        if (!campos.includes(texto)) return false;
      }
      return true;
    });

    const desde = pagina * tamanio;
    return {
      contenido: filtrados.slice(desde, desde + tamanio),
      pagina,
      tamanio,
      totalElementos: filtrados.length,
      totalPaginas: Math.ceil(filtrados.length / tamanio),
    };
  }

  porCodigo(codigo: string): Envio | undefined {
    return this.envios().find((e) => e.codigoRastreo === codigo);
  }

  paraEntrega(dni: string): Envio[] {
    return this.envios().filter((e) =>
      e.estadoActual === 'LISTO_PARA_RECOJO'
      && (e.destinatario.dni === dni || (e.autorizados ?? []).some((a) => a.dni === dni)));
  }

  rastrear(codigo: string, verificacion: string): Tracking | undefined {
    const directo = RASTREOS_DEMO[`${codigo.toUpperCase()}|${verificacion.toUpperCase()}`];
    if (directo) return directo;

    // Encomiendas creadas durante el recorrido: se arma la respuesta al vuelo.
    const envio = this.porCodigo(codigo.toUpperCase());
    if (!envio || (envio.codigoVerificacion ?? '').toUpperCase() !== verificacion.toUpperCase()) {
      return undefined;
    }
    return this.trackingDe(envio);
  }

  listaAgencias(): Agencia[] { return this.agencias(); }
  listaUsuarios(): Usuario[] { return this.usuarios(); }
  listaTarifario(): Tarifario[] { return this.tarifario(); }
  listaAvisos(): AvisoCliente[] { return this.avisos(); }

  /**
   * Indicadores del tablero, calculados sobre los datos que hay en memoria.
   *
   * Se calculan en lugar de venir fijos para que sigan cuadrando cuando durante
   * el recorrido se admite o se entrega una encomienda. Cada rol recibe lo
   * suyo: el arqueo propio para quien atiende ventanilla y los importes de la
   * red solo para la administración.
   */
  resumen(rol: Rol): Resumen {

    const lista = this.envios();
    const conteo = this.conteoPorEstado();
    const agencia = this.usuarioPorRol(rol).agenciaId;
    const haceTresDias = Date.now() - 3 * 24 * 60 * 60 * 1000;

    const admitidasAqui = lista.filter((e) =>
      e.agenciaOrigenId === agencia && e.estadoActual !== 'ANULADO');

    const atiendeVentanilla = rol === 'OPERADOR' || rol === 'ADMIN';
    const esAdministracion = rol === 'ADMIN';

    const suma = (envios: Envio[]) =>
      redondear(envios.reduce((total, e) => total + (e.tarifa?.total ?? 0), 0));

    return {
      totalEnvios: lista.length,
      enTransito: conteo['EN_TRANSITO'],
      listosParaRecojo: conteo['LISTO_PARA_RECOJO'],
      entregadosHoy: conteo['ENTREGADO'],
      porRecogerHace3Dias: lista.filter((e) =>
        e.estadoActual === 'LISTO_PARA_RECOJO'
        && new Date(e.fechaRegistro).getTime() < haceTresDias).length,

      misAdmisionesHoy: atiendeVentanilla ? admitidasAqui.length : undefined,
      miCajaHoy: atiendeVentanilla ? suma(admitidasAqui) : undefined,

      ingresosHoy: esAdministracion ? suma(admitidasAqui) : undefined,
      ingresosMes: esAdministracion
        ? suma(lista.filter((e) => e.estadoActual !== 'ANULADO')) : undefined,
      ticketPromedio: esAdministracion && lista.length > 0
        ? redondear(suma(lista.filter((e) => e.estadoActual !== 'ANULADO')) / lista.length)
        : undefined,

      porEstado: conteo,
      porAgenciaDestino: this.conteoPorAgencia(),
    };
  }

  private conteoPorAgencia() {
    const cuenta = new Map<string, number>();
    for (const e of this.envios()) {
      cuenta.set(e.agenciaDestinoId, (cuenta.get(e.agenciaDestinoId) ?? 0) + 1);
    }
    return [...cuenta.entries()]
      .map(([agenciaId, cantidad]) => ({
        agenciaId,
        nombre: this.nombreAgencia(agenciaId),
        cantidad,
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }

  conteoPorEstado(): Record<string, number> {
    const conteo: Record<string, number> = {
      REGISTRADO: 0, EN_ALMACEN_ORIGEN: 0, EN_TRANSITO: 0, EN_ALMACEN_DESTINO: 0,
      LISTO_PARA_RECOJO: 0, ENTREGADO: 0, INCIDENCIA: 0, DEVUELTO: 0, ANULADO: 0,
    };
    for (const e of this.envios()) {
      conteo[e.estadoActual] = (conteo[e.estadoActual] ?? 0) + 1;
    }
    return conteo;
  }

  // ---------------------------------------------------------------- acciones

  cotizar(carga: { pesoKg: number; largoCm: number; anchoCm: number; altoCm: number; fragil: boolean }): Tarifa {
    const tarifa = this.tarifario()[0];
    const base = tarifa?.montoBase ?? 8;
    const porKg = tarifa?.precioPorKg ?? 3;
    const factor = tarifa?.factorVolumetrico ?? 6000;
    const recargoFragil = tarifa?.recargoFragil ?? 5;

    const volumetrico = redondear((carga.largoCm * carga.anchoCm * carga.altoCm) / factor);
    const facturable = Math.max(carga.pesoKg, volumetrico);
    const recargo = carga.fragil ? recargoFragil : 0;

    return {
      pesoVolumetrico: volumetrico,
      pesoFacturable: redondear(facturable),
      montoBase: base,
      recargo,
      total: redondear(base + facturable * porKg + recargo),
      moneda: 'PEN',
    };
  }

  admitir(cuerpo: any, usuario: string): Comprobante {
    const tarifa = this.cotizar(cuerpo.carga);
    const codigo = `RE-2026-${String(++this.secuencia).padStart(6, '0')}`;
    const verificacion = codigoCorto();
    const clave = (cuerpo.claveRecojo || '').trim() || String(Math.floor(Math.random() * 1e6)).padStart(6, '0');

    const envio: Envio = {
      codigoRastreo: codigo,
      codigoVerificacion: verificacion,
      estadoActual: 'REGISTRADO',
      remitente: cuerpo.remitente,
      destinatario: cuerpo.destinatario,
      autorizados: cuerpo.autorizados ?? [],
      carga: cuerpo.carga,
      tarifa,
      agenciaOrigenId: cuerpo.agenciaOrigenId,
      agenciaDestinoId: cuerpo.agenciaDestinoId,
      historial: [{
        estado: 'REGISTRADO',
        fecha: new Date().toISOString(),
        agenciaId: cuerpo.agenciaOrigenId,
        usuario,
        observacion: 'Encomienda admitida en ' + this.nombreAgencia(cuerpo.agenciaOrigenId),
      }],
      fechaRegistro: new Date().toISOString(),
    };

    this.claves.set(codigo, clave);
    this.envios.update((lista) => [envio, ...lista]);

    return {
      envio,
      codigoVerificacion: verificacion,
      claveRecojo: clave,
      aviso: 'Entregue al cliente el código de verificación y la clave de seguridad. '
        + 'La clave no vuelve a mostrarse: si se pierde, debe generarse una nueva.',
    };
  }

  cambiarEstado(codigo: string, estado: EstadoEnvio, agenciaId: string,
                usuario: string, observacion?: string): Envio | undefined {
    return this.actualizar(codigo, (envio) => {
      envio.estadoActual = estado;
      envio.historial = [...envio.historial, {
        estado, fecha: new Date().toISOString(), agenciaId, usuario, observacion,
      }];
    });
  }

  anular(codigo: string, motivo: string, usuario: string): Envio | undefined {
    return this.actualizar(codigo, (envio) => {
      envio.estadoActual = 'ANULADO';
      envio.historial = [...envio.historial, {
        estado: 'ANULADO', fecha: new Date().toISOString(),
        agenciaId: envio.agenciaOrigenId, usuario, observacion: 'Anulada: ' + motivo,
      }];
    });
  }

  entregar(codigo: string, datos: any, usuario: string): { envio?: Envio; error?: string } {
    const envio = this.porCodigo(codigo);
    if (!envio) return { error: 'No existe una encomienda con ese código' };

    const esTitular = envio.destinatario.dni === datos.receptorDni;
    const esAutorizado = (envio.autorizados ?? []).some((a) => a.dni === datos.receptorDni);
    if (!esTitular && !esAutorizado) {
      return { error: 'El documento presentado no corresponde al destinatario ni a una persona autorizada' };
    }

    const esperada = this.claves.get(codigo);
    if (!datos.omitirClave) {
      const digitada = (datos.claveRecojo ?? '').trim();
      if (!digitada) {
        return { error: 'Pida la clave de seguridad al cliente. Si no la tiene, indique el motivo' };
      }
      // Las encomiendas del juego de datos no traen su clave en claro: en el
      // escaparate se acepta cualquier clave de 4 a 8 dígitos para poder
      // recorrer el flujo completo.
      if (esperada && digitada !== esperada) {
        return { error: 'La clave de seguridad no coincide. Verifíquela con el cliente o genere una nueva' };
      }
      if (!/^\d{4,8}$/.test(digitada)) {
        return { error: 'La clave de seguridad no coincide. Verifíquela con el cliente o genere una nueva' };
      }
    } else if ((datos.motivoSinClave ?? '').trim().length < 5) {
      return { error: 'Indique el motivo por el que se entrega solo con el documento' };
    }

    const actualizado = this.actualizar(codigo, (e) => {
      e.estadoActual = 'ENTREGADO';
      e.entrega = {
        receptorNombres: datos.receptorNombres,
        receptorDni: datos.receptorDni,
        parentesco: datos.parentesco,
        relacion: esTitular ? 'TITULAR' : 'AUTORIZADO',
        claveVerificada: !datos.omitirClave,
        motivoSinClave: datos.omitirClave ? datos.motivoSinClave : undefined,
        fechaEntrega: new Date().toISOString(),
        usuario,
      };
      e.historial = [...e.historial, {
        estado: 'ENTREGADO', fecha: new Date().toISOString(),
        agenciaId: e.agenciaDestinoId, usuario,
        observacion: `Entregado a ${datos.receptorNombres} (DNI ${datos.receptorDni}, `
          + `${esTitular ? 'titular' : 'autorizado'})`
          + (datos.omitirClave ? ', sin clave: ' + datos.motivoSinClave : ', clave de seguridad verificada'),
      }];
    });

    return { envio: actualizado };
  }

  nuevaClave(codigo: string): string {
    const clave = String(Math.floor(Math.random() * 1e6)).padStart(6, '0');
    this.claves.set(codigo, clave);
    return clave;
  }

  crearAgencia(agencia: Agencia): Agencia {
    const nueva = { ...agencia, activo: true };
    this.agencias.update((l) => [...l, nueva]);
    return nueva;
  }

  crearUsuario(usuario: Usuario): Usuario {
    const nuevo = { ...usuario, id: 'demo-' + Date.now(), activo: true, debeCambiarClave: true };
    this.usuarios.update((l) => [...l, nuevo]);
    return nuevo;
  }

  cambiarEstadoUsuario(id: string, activo: boolean): Usuario | undefined {
    let encontrado: Usuario | undefined;
    this.usuarios.update((l) => l.map((u) => {
      if (u.id !== id) return u;
      encontrado = { ...u, activo };
      return encontrado;
    }));
    return encontrado;
  }

  crearTarifario(tarifa: Tarifario): Tarifario {
    const nueva = { ...tarifa, activo: true };
    this.tarifario.update((l) => [...l, nueva]);
    return nueva;
  }

  reintentarAviso(id: string): AvisoCliente | undefined {
    let encontrado: AvisoCliente | undefined;
    this.avisos.update((l) => l.map((a) => {
      if (a.id !== id) return a;
      encontrado = {
        ...a, estado: 'ENVIADO', intentos: a.intentos + 1,
        ultimoError: undefined, fechaActualizacion: new Date().toISOString(),
      };
      return encontrado;
    }));
    return encontrado;
  }

  // ---------------------------------------------------------------- auxiliares

  private actualizar(codigo: string, cambio: (envio: Envio) => void): Envio | undefined {
    let resultado: Envio | undefined;
    this.envios.update((lista) => lista.map((e) => {
      if (e.codigoRastreo !== codigo) return e;
      const copia: Envio = JSON.parse(JSON.stringify(e));
      cambio(copia);
      resultado = copia;
      return copia;
    }));
    return resultado;
  }

  private nombreAgencia(codigo: string): string {
    return this.agencias().find((a) => a.codigo === codigo)?.nombre ?? codigo;
  }

  /** Arma la respuesta pública para una encomienda creada en el recorrido. */
  private trackingDe(envio: Envio): Tracking {
    const etapas: Record<string, { n: number; etiqueta: string; mensaje: string }> = {
      REGISTRADO: { n: 1, etiqueta: 'En origen', mensaje: 'Su encomienda fue recibida y está en la agencia de origen.' },
      EN_ALMACEN_ORIGEN: { n: 1, etiqueta: 'En origen', mensaje: 'Su encomienda fue recibida y está en la agencia de origen.' },
      EN_TRANSITO: { n: 2, etiqueta: 'En tránsito', mensaje: 'Su encomienda va en camino a la agencia de destino.' },
      EN_ALMACEN_DESTINO: { n: 3, etiqueta: 'En destino', mensaje: 'Su encomienda llegó a la agencia de destino.' },
      LISTO_PARA_RECOJO: { n: 3, etiqueta: 'En destino', mensaje: 'Su encomienda está lista para el recojo. Acérquese con su DNI y su clave de seguridad.' },
      ENTREGADO: { n: 4, etiqueta: 'Entregado', mensaje: 'Su encomienda fue entregada.' },
    };
    const etapa = etapas[envio.estadoActual]
      ?? { n: 0, etiqueta: 'Requiere atención', mensaje: 'Su encomienda necesita una gestión en la agencia.' };
    const ultimo = envio.historial[envio.historial.length - 1];

    return {
      codigoRastreo: envio.codigoRastreo,
      etapa: etapa.n,
      etapaEtiqueta: etapa.etiqueta,
      mensaje: etapa.mensaje,
      desde: ultimo?.fecha ?? envio.fechaRegistro,
      listoParaRecojo: envio.estadoActual === 'LISTO_PARA_RECOJO',
      finalizado: envio.estadoActual === 'ENTREGADO',
      destinatario: envio.destinatario.nombres,
      documentoDestinatario: enmascarar(envio.destinatario.dni),
      descripcionCarga: envio.carga.descripcion,
      agenciaOrigen: this.nombreAgencia(envio.agenciaOrigenId),
      agenciaDestino: this.nombreAgencia(envio.agenciaDestinoId),
      historial: envio.historial,
    };
  }
}

function clonar<T>(datos: T[]): T[] {
  return JSON.parse(JSON.stringify(datos));
}

function redondear(valor: number): number {
  return Math.round(valor * 100) / 100;
}

function enmascarar(documento: string): string {
  if (!documento || documento.length < 4) return '****';
  return '*'.repeat(documento.length - 3) + documento.slice(-3);
}

function codigoCorto(): string {
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 4 }, () =>
    alfabeto[Math.floor(Math.random() * alfabeto.length)]).join('');
}

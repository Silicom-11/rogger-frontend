import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Carga, ClaveRecojo, Comprobante, Envio, EstadoEnvio, FiltroEnvios,
  Pagina, ResultadoLote, Tarifa, Tracking,
} from '../models/modelos';

@Injectable({ providedIn: 'root' })
export class EnvioService {

  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/envios`;

  cotizar(carga: Carga, ruta: string): Observable<Tarifa> {
    return this.http.post<Tarifa>(`${environment.apiUrl}/tarifas/cotizar`, { carga, ruta });
  }

  /** La admisión devuelve el comprobante: la encomienda y sus dos claves. */
  registrar(cuerpo: unknown): Observable<Comprobante> {
    return this.http.post<Comprobante>(this.url, cuerpo);
  }

  buscar(filtro: FiltroEnvios): Observable<Pagina<Envio>> {
    let params = new HttpParams()
      .set('pagina', filtro.pagina ?? 0)
      .set('tamanio', filtro.tamanio ?? 10);

    if (filtro.estado) params = params.set('estado', filtro.estado);
    if (filtro.agenciaDestinoId) params = params.set('agenciaDestinoId', filtro.agenciaDestinoId);
    if (filtro.agenciaOrigenId) params = params.set('agenciaOrigenId', filtro.agenciaOrigenId);
    if (filtro.desde) params = params.set('desde', filtro.desde);
    if (filtro.hasta) params = params.set('hasta', filtro.hasta);
    if (filtro.texto) params = params.set('texto', filtro.texto);

    return this.http.get<Pagina<Envio>>(this.url, { params });
  }

  obtener(codigo: string): Observable<Envio> {
    return this.http.get<Envio>(`${this.url}/${codigo}`);
  }

  siguientesEstados(codigo: string): Observable<EstadoEnvio[]> {
    return this.http.get<EstadoEnvio[]>(`${this.url}/${codigo}/siguientes-estados`);
  }

  cambiarEstado(codigo: string, estado: EstadoEnvio, agenciaId?: string,
                observacion?: string): Observable<Envio> {
    return this.http.patch<Envio>(`${this.url}/${codigo}/estado`, { estado, agenciaId, observacion });
  }

  /** Aplica el mismo cambio de estado a varias encomiendas a la vez. */
  cambiarEstadoLote(codigos: string[], estado: EstadoEnvio, agenciaId?: string,
                    observacion?: string): Observable<ResultadoLote> {
    return this.http.patch<ResultadoLote>(`${this.url}/estado-lote`,
      { codigos, estado, agenciaId, observacion });
  }

  /**
   * Encomiendas que puede retirar quien presenta este documento. Es el orden
   * real del mostrador: el cliente llega con su DNI, no con un código.
   */
  paraEntrega(dni: string): Observable<Envio[]> {
    return this.http.get<Envio[]>(`${this.url}/para-entrega`, {
      params: new HttpParams().set('dni', dni),
    });
  }

  /** Entrega verificando documento y clave de seguridad. */
  registrarEntrega(codigo: string, datos: {
    receptorNombres: string;
    receptorDni: string;
    parentesco?: string;
    claveRecojo?: string;
    omitirClave?: boolean;
    motivoSinClave?: string;
  }): Observable<Envio> {
    return this.http.post<Envio>(`${this.url}/${codigo}/entrega`, datos);
  }

  /** Genera una clave de seguridad nueva cuando el cliente perdió la suya. */
  regenerarClave(codigo: string): Observable<ClaveRecojo> {
    return this.http.post<ClaveRecojo>(`${this.url}/${codigo}/clave-recojo`, {});
  }

  /** Anula una admision registrada por error (exige motivo). */
  anular(codigo: string, motivo: string): Observable<Envio> {
    return this.http.post<Envio>(`${this.url}/${codigo}/anulacion`, { motivo });
  }

  /**
   * Consulta pública de rastreo. No requiere sesión, pero sí los dos datos del
   * comprobante: el número de la encomienda y su código de verificación.
   */
  rastrear(codigo: string, verificacion: string): Observable<Tracking> {
    return this.http.get<Tracking>(`${environment.apiUrl}/tracking/${codigo}`, {
      params: new HttpParams().set('verificacion', verificacion),
    });
  }
}

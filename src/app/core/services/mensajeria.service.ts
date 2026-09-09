import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AvisoCliente, EstadoAviso } from '../models/modelos';

/** Bitacora de los avisos enviados al destinatario. */
@Injectable({ providedIn: 'root' })
export class MensajeriaService {

  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  listar(estado?: EstadoAviso, limite = 50): Observable<AvisoCliente[]> {
    let params = new HttpParams().set('limite', limite);
    if (estado) {
      params = params.set('estado', estado);
    }
    return this.http.get<AvisoCliente[]>(`${this.api}/notificaciones`, { params });
  }

  reintentar(id: string): Observable<AvisoCliente> {
    return this.http.post<AvisoCliente>(`${this.api}/notificaciones/${id}/reintento`, {});
  }
}

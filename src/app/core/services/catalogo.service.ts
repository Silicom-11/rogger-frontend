import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Agencia, ClaveTemporal, Resumen, Tarifario, Usuario } from '../models/modelos';

/** Catalogos y administracion: agencias, usuarios, tarifario y reportes. */
@Injectable({ providedIn: 'root' })
export class CatalogoService {

  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  agencias(): Observable<Agencia[]> {
    return this.http.get<Agencia[]>(`${this.api}/agencias`);
  }

  crearAgencia(agencia: Partial<Agencia>): Observable<Agencia> {
    return this.http.post<Agencia>(`${this.api}/agencias`, agencia);
  }

  usuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.api}/usuarios`);
  }

  crearUsuario(usuario: unknown): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.api}/usuarios`, usuario);
  }

  cambiarEstadoUsuario(id: string, activo: boolean): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.api}/usuarios/${id}/estado?activo=${activo}`, {});
  }

  /** Restablece la contrasena y devuelve la clave temporal generada. */
  restablecerClave(id: string): Observable<ClaveTemporal> {
    return this.http.post<ClaveTemporal>(`${this.api}/usuarios/${id}/reset-clave`, {});
  }

  tarifario(): Observable<Tarifario[]> {
    return this.http.get<Tarifario[]>(`${this.api}/tarifario`);
  }

  crearTarifario(tarifario: Partial<Tarifario>): Observable<Tarifario> {
    return this.http.post<Tarifario>(`${this.api}/tarifario`, tarifario);
  }

  resumen(): Observable<Resumen> {
    return this.http.get<Resumen>(`${this.api}/reportes/resumen`);
  }
}

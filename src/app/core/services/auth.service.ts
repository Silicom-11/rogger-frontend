import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, finalize, map, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse, Rol, Usuario } from '../models/modelos';

const CLAVE_TOKEN = 'rogger.token';
const CLAVE_REFRESCO = 'rogger.refresco';
const CLAVE_USUARIO = 'rogger.usuario';

/**
 * Estado de sesion de la aplicacion.
 *
 * El token de acceso dura poco y se renueva solo con el token de refresco, de
 * modo que al trabajador no se le cierra la sesion en medio de una atencion.
 * Al salir, el refresco se invalida tambien en el servidor.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _usuario = signal<Usuario | null>(this.leerUsuario());

  /** Renovacion en curso: varias peticiones que caducan a la vez comparten una sola. */
  private renovacion: Observable<string> | null = null;

  readonly usuario = this._usuario.asReadonly();
  readonly autenticado = computed(() => this._usuario() !== null);
  readonly rol = computed<Rol | null>(() => this._usuario()?.rol ?? null);
  readonly debeCambiarClave = computed(() => this._usuario()?.debeCambiarClave === true);

  /** Agencia a la que pertenece el usuario; delimita lo que ve en el sistema. */
  readonly agencia = computed(() => this._usuario()?.agenciaId ?? null);

  /** La administracion consulta toda la red; el resto solo su agencia. */
  readonly veTodaLaRed = computed(() => this.rol() === 'ADMIN');

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(tap((respuesta) => this.guardarSesion(respuesta)));
  }

  /**
   * Pide un token de acceso nuevo con el de refresco. Si ya hay una renovacion
   * en curso devuelve la misma, para no gastar el refresco dos veces: el
   * servidor lo rota en cada uso.
   */
  renovar(): Observable<string> {

    const refresco = this.refreshToken;
    if (!refresco) {
      return throwError(() => new Error('No hay una sesión que renovar'));
    }
    if (this.renovacion) {
      return this.renovacion;
    }

    this.renovacion = this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken: refresco })
      .pipe(
        tap((respuesta) => this.guardarSesion(respuesta)),
        map((respuesta) => respuesta.token),
        shareReplay(1),
        finalize(() => (this.renovacion = null)),
      );

    return this.renovacion;
  }

  /** Cambia la contrasena del propio usuario. */
  cambiarClave(claveActual: string, claveNueva: string): Observable<Usuario> {
    return this.http
      .post<Usuario>(`${environment.apiUrl}/auth/cambiar-clave`, { claveActual, claveNueva })
      .pipe(tap((usuario) => this.actualizarUsuario(usuario)));
  }

  /** Cierra la sesion aqui y tambien en el servidor. */
  logout(): void {

    const refresco = this.refreshToken;

    // El cierre se avisa al servidor para que el refresco quede revocado; si la
    // API no responde igual se limpia la sesion local.
    if (refresco) {
      this.http
        .post<void>(`${environment.apiUrl}/auth/logout`, { refreshToken: refresco })
        .subscribe({ error: () => undefined });
    }

    this.limpiar();
    this.router.navigate(['/login']);
  }

  /**
    * Adopta un usuario sin pasar por la API. Lo usa el recorrido de
    * demostración para abrir cada pantalla con su rol ya puesto.
    */
  entrarComoDemostracion(usuario: Usuario): void {
    localStorage.setItem(CLAVE_TOKEN, 'escaparate');
    localStorage.setItem(CLAVE_REFRESCO, 'escaparate');
    this.actualizarUsuario(usuario);
  }

  get token(): string | null {
    return localStorage.getItem(CLAVE_TOKEN);
  }

  get refreshToken(): string | null {
    return localStorage.getItem(CLAVE_REFRESCO);
  }

  tieneRol(...roles: Rol[]): boolean {
    const rol = this.rol();
    return rol !== null && roles.includes(rol);
  }

  private limpiar(): void {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_REFRESCO);
    localStorage.removeItem(CLAVE_USUARIO);
    this.renovacion = null;
    this._usuario.set(null);
  }

  private actualizarUsuario(usuario: Usuario): void {
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
    this._usuario.set(usuario);
  }

  private guardarSesion(respuesta: LoginResponse): void {
    localStorage.setItem(CLAVE_TOKEN, respuesta.token);
    if (respuesta.refreshToken) {
      localStorage.setItem(CLAVE_REFRESCO, respuesta.refreshToken);
    }
    this.actualizarUsuario(respuesta.usuario);
  }

  private leerUsuario(): Usuario | null {
    const guardado = localStorage.getItem(CLAVE_USUARIO);
    try {
      return guardado ? (JSON.parse(guardado) as Usuario) : null;
    } catch {
      return null;
    }
  }
}

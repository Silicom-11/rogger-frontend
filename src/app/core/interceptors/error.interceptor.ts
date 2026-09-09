import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificacionService } from '../services/notificacion.service';

/**
 * Traduce los errores HTTP a avisos legibles y cierra la sesion cuando ya no
 * fue posible renovarla.
 *
 * El 401 llega hasta aqui solo si el interceptor de renovacion no consiguio un
 * token nuevo; en ese caso la sesion si termino de verdad.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const avisos = inject(NotificacionService);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      const esLogin = req.url.endsWith('/auth/login');
      const esCierre = req.url.endsWith('/auth/logout') || req.url.endsWith('/auth/refresh');
      const mensaje: string = error.error?.mensaje ?? mensajePorDefecto(error.status);

      if (esCierre) {
        return throwError(() => error);
      }

      if (error.status === 401 && !esLogin) {
        avisos.error('Su sesión expiró. Vuelva a iniciar sesión.');
        auth.logout();
      } else if (!esLogin) {
        avisos.error(mensaje);
      }

      return throwError(() => error);
    })
  );
};

function mensajePorDefecto(status: number): string {
  switch (status) {
    case 0:   return 'No se pudo conectar con el servidor. Verifique que la API esté en ejecución.';
    case 400: return 'Los datos enviados no son válidos.';
    case 403: return 'Su rol no tiene permiso para realizar esta operación.';
    case 404: return 'No se encontró el recurso solicitado.';
    case 409: return 'La operación no es válida para el estado actual.';
    case 429: return 'Demasiados intentos seguidos. Espere unos minutos antes de reintentar.';
    default:  return 'Ocurrió un error al procesar la solicitud.';
  }
}

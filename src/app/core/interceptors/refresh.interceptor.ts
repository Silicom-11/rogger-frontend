import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

/**
 * Renueva la sesion sin que el usuario lo note.
 *
 * Cuando el token de acceso caduca la API responde 401; en lugar de devolver al
 * trabajador a la pantalla de acceso en medio de una atencion, se pide un token
 * nuevo con el de refresco y se repite la peticion original. Solo si esa
 * renovacion falla se deja pasar el error, y entonces si se cierra la sesion.
 *
 * Debe declararse despues del interceptor de errores para que este vea el 401
 * unicamente cuando la renovacion ya no fue posible.
 */
export const refreshInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(AuthService);

  const esApi = req.url.startsWith(environment.apiUrl);
  const esAcceso = req.url.includes('/auth/login')
    || req.url.includes('/auth/refresh')
    || req.url.includes('/auth/logout');

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status !== 401 || !esApi || esAcceso || !auth.refreshToken) {
        return throwError(() => error);
      }

      return auth.renovar().pipe(
        switchMap((token) => next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))),
        catchError(() => throwError(() => error)),
      );
    }),
  );
};

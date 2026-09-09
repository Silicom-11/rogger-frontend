import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

/** Agrega el token JWT a las peticiones dirigidas a la API. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = inject(AuthService).token;
  const esApi = req.url.startsWith(environment.apiUrl);

  if (token && esApi) {
    return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
  }
  return next(req);
};

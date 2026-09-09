import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Rol } from '../models/modelos';
import { NotificacionService } from '../services/notificacion.service';

/** Exige sesion iniciada. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.autenticado() ? true : router.createUrlTree(['/login']);
};

/**
 * Obliga a definir una contrasena propia antes de usar el sistema: aplica a
 * los usuarios creados por un administrador o con la clave restablecida.
 */
export const claveGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.debeCambiarClave() ? router.createUrlTree(['/panel/cambiar-clave']) : true;
};

/** Exige que el usuario tenga alguno de los roles indicados. */
export const rolGuard = (...roles: Rol[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.autenticado()) {
    return router.createUrlTree(['/login']);
  }
  if (auth.tieneRol(...roles)) {
    return true;
  }

  inject(NotificacionService).error('Su rol no tiene acceso a ese módulo.');
  return router.createUrlTree(['/panel/inicio']);
};

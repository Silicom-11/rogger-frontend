import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EscaparateService } from '../demo/escaparate.service';
import { Rol } from '../models/modelos';
import { environment } from '../../../environments/environment';

const ROLES: Record<string, Rol> = {
  operador: 'OPERADOR',
  almacen: 'ALMACEN',
  admin: 'ADMIN',
};

/**
 * Abre una pantalla del panel sin pasar por el inicio de sesión, adoptando el
 * rol que indica la ruta.
 *
 * Existe para el recorrido de demostración: da una dirección propia y estable a
 * cada pantalla —una por rol y por módulo—, de modo que puedan verse y
 * capturarse una por una. Solo funciona con el modo escaparate encendido; con
 * la API real detrás no habilita nada.
 */
export const vistaGuard: CanActivateFn = (route) => {

  const router = inject(Router);
  if (!environment.demo) {
    return router.createUrlTree(['/login']);
  }

  const rol = ROLES[(route.params['rol'] ?? '').toLowerCase()];
  if (!rol) {
    return router.createUrlTree(['/vista']);
  }

  inject(AuthService).entrarComoDemostracion(inject(EscaparateService).usuarioPorRol(rol));
  return true;
};

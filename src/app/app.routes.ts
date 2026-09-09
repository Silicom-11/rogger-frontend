import { Routes } from '@angular/router';
import { authGuard, claveGuard, rolGuard } from './core/guards/auth.guard';
import { vistaGuard } from './core/guards/vista.guard';

export const routes: Routes = [

  // ---------- publico ----------
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
    title: 'Iniciar sesión · Rogger Express',
  },
  {
    path: 'rastrear',
    loadComponent: () => import('./pages/tracking/tracking.component').then((m) => m.TrackingComponent),
    title: 'Rastrea tu encomienda · Rogger Express',
  },
  {
    // Consulta directa: la misma pantalla, ya resuelta. Da una dirección propia
    // a cada resultado, para poder enlazarlo o mostrarlo sin escribir nada.
    path: 'rastrear/:codigo/:verificacion',
    loadComponent: () => import('./pages/tracking/tracking.component').then((m) => m.TrackingComponent),
    title: 'Estado de tu encomienda · Rogger Express',
  },

  // ---------- recorrido de demostración ----------
  {
    path: 'vista',
    loadComponent: () => import('./pages/escaparate/escaparate.component').then((m) => m.EscaparateComponent),
    title: 'Recorrido del sistema · Rogger Express',
  },
  {
    // Una dirección por pantalla y por rol, sin pasar por el inicio de sesión.
    path: 'vista/:rol',
    canActivate: [vistaGuard],
    loadComponent: () => import('./layout/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: 'tablero',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        title: 'Tablero · Rogger Express',
      },
      {
        path: 'ventanilla',
        loadComponent: () => import('./pages/ventanilla/ventanilla.component').then((m) => m.VentanillaComponent),
        title: 'Admitir encomienda · Rogger Express',
      },
      {
        path: 'encomiendas',
        loadComponent: () => import('./pages/envios/envios.component').then((m) => m.EnviosComponent),
        title: 'Encomiendas · Rogger Express',
      },
      {
        path: 'encomienda/:codigo',
        loadComponent: () => import('./pages/envios/detalle-envio.component').then((m) => m.DetalleEnvioComponent),
        title: 'Detalle de encomienda · Rogger Express',
      },
      {
        path: 'almacen',
        loadComponent: () => import('./pages/almacen/almacen.component').then((m) => m.AlmacenComponent),
        title: 'Almacén · Rogger Express',
      },
      {
        path: 'mostrador',
        loadComponent: () => import('./pages/mostrador/mostrador.component').then((m) => m.MostradorComponent),
        title: 'Mostrador de recojo · Rogger Express',
      },
      {
        path: 'avisos',
        loadComponent: () => import('./pages/mensajeria/mensajeria.component').then((m) => m.MensajeriaComponent),
        title: 'Avisos al cliente · Rogger Express',
      },
      {
        path: 'administracion',
        loadComponent: () => import('./pages/admin/admin.component').then((m) => m.AdminComponent),
        title: 'Administración · Rogger Express',
      },
      {
        path: 'contrasena',
        loadComponent: () => import('./pages/cuenta/cambiar-clave.component').then((m) => m.CambiarClaveComponent),
        title: 'Mi contraseña · Rogger Express',
      },
      { path: '', pathMatch: 'full', redirectTo: 'tablero' },
    ],
  },

  // ---------- panel interno ----------
  {
    path: 'panel',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: 'cambiar-clave',
        loadComponent: () => import('./pages/cuenta/cambiar-clave.component').then((m) => m.CambiarClaveComponent),
        title: 'Cambiar contraseña · Rogger Express',
      },
      {
        path: 'inicio',
        canActivate: [claveGuard],
        loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        title: 'Tablero · Rogger Express',
      },
      {
        path: 'ventanilla',
        canActivate: [claveGuard, rolGuard('OPERADOR', 'ADMIN')],
        loadComponent: () => import('./pages/ventanilla/ventanilla.component').then((m) => m.VentanillaComponent),
        title: 'Ventanilla · Rogger Express',
      },
      {
        path: 'envios',
        canActivate: [claveGuard],
        loadComponent: () => import('./pages/envios/envios.component').then((m) => m.EnviosComponent),
        title: 'Encomiendas · Rogger Express',
      },
      {
        path: 'envios/:codigo',
        canActivate: [claveGuard],
        loadComponent: () => import('./pages/envios/detalle-envio.component').then((m) => m.DetalleEnvioComponent),
        title: 'Detalle de encomienda · Rogger Express',
      },
      {
        path: 'mostrador',
        canActivate: [claveGuard, rolGuard('ALMACEN', 'ADMIN')],
        loadComponent: () => import('./pages/mostrador/mostrador.component').then((m) => m.MostradorComponent),
        title: 'Mostrador de recojo · Rogger Express',
      },
      {
        path: 'almacen',
        canActivate: [claveGuard, rolGuard('ALMACEN', 'ADMIN')],
        loadComponent: () => import('./pages/almacen/almacen.component').then((m) => m.AlmacenComponent),
        title: 'Almacén · Rogger Express',
      },
      {
        path: 'avisos',
        canActivate: [claveGuard],
        loadComponent: () => import('./pages/mensajeria/mensajeria.component').then((m) => m.MensajeriaComponent),
        title: 'Avisos al cliente · Rogger Express',
      },
      {
        path: 'administracion',
        canActivate: [claveGuard, rolGuard('ADMIN')],
        loadComponent: () => import('./pages/admin/admin.component').then((m) => m.AdminComponent),
        title: 'Administración · Rogger Express',
      },
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
    ],
  },

  { path: '', pathMatch: 'full', redirectTo: 'panel/inicio' },
  { path: '**', redirectTo: 'panel/inicio' },
];

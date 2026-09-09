import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { refreshInterceptor } from './core/interceptors/refresh.interceptor';
import { demoInterceptor } from './core/interceptors/demo.interceptor';

registerLocaleData(localeEsPe, 'es-PE');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),

    // El orden importa: la peticion baja por esta lista y la respuesta sube al
    // reves. Asi el interceptor de renovacion ve el 401 primero e intenta
    // recuperar la sesion; el de errores solo actua si ya no hubo remedio.
    // demoInterceptor va primero: con el modo escaparate encendido corta aquí
    // y ninguna petición sale a la red.
    provideHttpClient(withInterceptors([
      demoInterceptor, authInterceptor, errorInterceptor, refreshInterceptor,
    ])),

    { provide: LOCALE_ID, useValue: 'es-PE' },
  ],
};

# Rogger Express — Front-end waoz

Aplicación web del sistema de gestión de encomiendas, construida con **Angular 18**
(componentes standalone, signals y control de flujo `@if` / `@for`).

## Ejecutar

```bash
npm install     # solo la primera vez
npm start       # http://localhost:4200
```

Requiere que la API esté ejecutándose en `http://localhost:8080`
(ver `../rogger-backend`).

## Estructura

```
src/app/
├── core/
│   ├── models/        modelos.ts — tipos del dominio compartidos
│   ├── services/      auth · envio · catalogo · mensajeria · notificacion
│   ├── interceptors/  auth (adjunta el JWT) · error (traduce los errores)
│   │                  refresh (renueva la sesion al vencer el token)
│   └── guards/        authGuard · claveGuard · rolGuard(...roles)
├── layout/            shell.component.ts — barra lateral y cabecera
├── shared/            estado-badge · linea-tiempo · avisos
└── pages/
    ├── login/         acceso al sistema
    ├── tracking/      portal del cliente: dos datos, cuatro etapas (sin sesión)
    ├── dashboard/     tablero de indicadores
    ├── ventanilla/    cotización, registro y comprobante
    ├── envios/        listado con filtros + ficha de la encomienda
    ├── almacen/       cambio de estado y entrega verificada
    ├── mostrador/     entrega verificada: busca por DNI y pide la clave
    ├── mensajeria/    bitácora de avisos al cliente y reenvío
    ├── cuenta/        cambio de la propia contraseña
    └── admin/         agencias, personal y tarifario
```

## Decisiones técnicas

- **Carga diferida**: cada página se carga con `loadComponent`, de modo que el
  usuario solo descarga los módulos a los que tiene acceso.
- **Estado de sesión con signals**: `AuthService` expone `usuario()`, `autenticado()`
  y `rol()` como signals; la barra lateral se arma según el rol.
- **Interceptor de errores**: traduce los códigos HTTP a mensajes en español y
  cierra la sesión cuando ya no es posible recuperarla.
- **Renovación silenciosa de la sesión**: si la API responde `401` porque el token
  de acceso venció, el interceptor `refresh` pide uno nuevo con el token de refresco
  y repite la petición original; el trabajador no pierde lo que estaba haciendo.
  Varias peticiones que vencen a la vez comparten una sola renovación, porque el
  servidor rota el token de refresco en cada uso.
- **Lo que un rol no debe ver no se pide**: los importes acumulados y las
  encomiendas de otras agencias no llegan desde la API, así que la pantalla se
  adapta a lo que recibe en lugar de esconder datos que ya tendría en memoria.
- **Formularios reactivos tipados** (`nonNullable`) con validaciones equivalentes
  a las del back-end (DNI de 8 dígitos, peso y dimensiones mayores a cero).
- **Sistema de diseño propio** en `src/styles.scss` con variables CSS, sin
  librerías de UI externas.

## Configuración

`src/environments/environment.ts` define la URL de la API:

```ts
export const environment = {
  produccion: false,
  apiUrl: 'http://localhost:8080/api/v1',
  nombreSistema: 'Rogger Express',
};
```

## Compilar para producción

```bash
npm run build       # genera dist/rogger-frontend
```

---

## Publicación en Vercel — recorrido de demostración

La aplicación puede publicarse **sin back-end**. Al compilar en modo producción se
activa el *modo escaparate*: un interceptor responde en lugar de la API con un
juego de datos incluido en la propia aplicación, tomado del sistema real. Así se
recorren todas las pantallas con contenido, sin levantar nada más.

```bash
npm run build          # dist/rogger-frontend/browser
```

`vercel.json` ya trae la configuración: directorio de salida y la reescritura que
hace falta para que una aplicación de una sola página responda en cualquier
dirección.

### Direcciones del recorrido

`/vista` reúne todas en un índice. Cada una abre la pantalla con su rol adoptado,
sin pasar por el inicio de sesión, lo que permite verla —o capturarla— una por una.

| Dirección | Pantalla |
|---|---|
| `/vista` | Índice del recorrido |
| `/rastrear` | Consulta del cliente |
| `/rastrear/RE-2026-000010/B827` | Encomienda lista para el recojo |
| `/rastrear/RE-2026-000011/2CCU` | Encomienda ya entregada |
| `/login` | Acceso del personal |
| `/vista/operador/tablero` | Tablero del operador |
| `/vista/operador/ventanilla` | Admitir encomienda |
| `/vista/operador/encomiendas` | Buscar encomiendas |
| `/vista/operador/encomienda/RE-2026-000010` | Ficha de encomienda |
| `/vista/operador/encomienda/RE-2026-000011` | Constancia de entrega |
| `/vista/almacen/tablero` | Tablero del almacén |
| `/vista/almacen/almacen` | Bandejas del almacén |
| `/vista/almacen/mostrador` | Mostrador de recojo |
| `/vista/almacen/mostrador?dni=44556677` | Recojo por persona autorizada |
| `/vista/almacen/avisos` | Avisos al cliente |
| `/vista/almacen/contrasena` | Cambio de contraseña |
| `/vista/admin/tablero` | Tablero de la red, con importes |
| `/vista/admin/administracion` | Agencias, personal y tarifario |

> Los datos de la versión publicada son de un juego de demostración: no
> corresponden a personas ni a envíos reales. Los cambios que se hagan sobre ella
> se pierden al recargar la página.

### Volver a trabajar contra la API

En desarrollo el modo escaparate está apagado (`src/environments/environment.ts`,
`demo: false`), de modo que `npm start` sigue consumiendo la API en
`http://localhost:8080`. Para que la versión publicada apunte a un back-end real
basta con poner `demo: false` y la URL de la API en `environment.prod.ts`.

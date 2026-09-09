import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EscaparateService } from '../demo/escaparate.service';
import { Rol } from '../models/modelos';

/**
 * Responde en lugar de la API cuando la aplicación corre en modo escaparate.
 *
 * Va primero en la cadena: si el modo está activo, corta aquí y nunca sale una
 * petición a la red. Así la versión publicada se recorre entera —incluidas las
 * acciones— sin necesidad de levantar el back-end.
 */
export const demoInterceptor: HttpInterceptorFn = (req, next) => {

  if (!environment.demo || !req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const datos = inject(EscaparateService);
  const url = new URL(req.url, window.location.origin);
  const ruta = url.pathname.replace(/^.*\/api\/v1/, '');
  const cuerpo: any = req.body ?? {};

  // HttpClient no mete los parametros en la URL: viajan aparte, en req.params.
  // Se juntan ambas fuentes para no depender de como los haya puesto quien llama.
  const params = new URLSearchParams();
  url.searchParams.forEach((valor, clave) => params.set(clave, valor));
  req.params.keys().forEach((clave) => {
    const valor = req.params.get(clave);
    if (valor !== null) params.set(clave, valor);
  });

  const usuarioActual = (): { username: string; rol: Rol } => {
    try {
      const guardado = JSON.parse(localStorage.getItem('rogger.usuario') ?? 'null');
      return guardado ?? { username: 'admin', rol: 'ADMIN' };
    } catch {
      return { username: 'admin', rol: 'ADMIN' };
    }
  };

  const ok = (valor: unknown, estado = 200): Observable<HttpResponse<unknown>> =>
    of(new HttpResponse({ status: estado, body: valor })).pipe(delay(180));

  const error = (estado: number, mensaje: string) =>
    throwError(() => new HttpErrorResponse({
      status: estado, error: { status: estado, mensaje }, url: req.url,
    })).pipe(delay(180));

  // ------------------------------------------------------------------ acceso
  if (ruta === '/auth/login' && req.method === 'POST') {
    const usuario = datos.usuarioPorNombre(cuerpo.username);
    if (!usuario || cuerpo.password !== 'Rogger2026') {
      return error(401, 'Usuario o contraseña incorrectos');
    }
    return ok({
      token: 'escaparate', refreshToken: 'escaparate', tipo: 'Bearer',
      expiraEnSegundos: 3600, usuario,
    });
  }
  if (ruta === '/auth/refresh' && req.method === 'POST') {
    return ok({
      token: 'escaparate', refreshToken: 'escaparate', tipo: 'Bearer',
      expiraEnSegundos: 3600, usuario: usuarioActual(),
    });
  }
  if (ruta === '/auth/logout') return ok(null, 204);
  if (ruta === '/auth/me') return ok(usuarioActual());
  if (ruta === '/auth/cambiar-clave') {
    return ok({ ...usuarioActual(), debeCambiarClave: false });
  }

  // ---------------------------------------------------------------- catálogos
  if (ruta === '/agencias' && req.method === 'GET') return ok(datos.listaAgencias());
  if (ruta === '/agencias' && req.method === 'POST') return ok(datos.crearAgencia(cuerpo), 201);
  if (ruta === '/usuarios' && req.method === 'GET') return ok(datos.listaUsuarios());
  if (ruta === '/usuarios' && req.method === 'POST') return ok(datos.crearUsuario(cuerpo), 201);
  if (ruta === '/tarifario' && req.method === 'GET') return ok(datos.listaTarifario());
  if (ruta === '/tarifario' && req.method === 'POST') return ok(datos.crearTarifario(cuerpo), 201);

  let m = ruta.match(/^\/usuarios\/([^/]+)\/estado$/);
  if (m) return ok(datos.cambiarEstadoUsuario(m[1], params.get('activo') === 'true'));

  m = ruta.match(/^\/usuarios\/([^/]+)\/reset-clave$/);
  if (m) {
    return ok({
      username: datos.listaUsuarios().find((u) => u.id === m![1])?.username ?? '',
      claveTemporal: 'Rge7TkPq2M',
      mensaje: 'Entregue esta clave al trabajador. Se le pedirá cambiarla al ingresar.',
    });
  }

  // ---------------------------------------------------------------- reportes
  if (ruta === '/reportes/resumen') return ok(datos.resumen(usuarioActual().rol));
  if (ruta === '/reportes/por-estado') return ok(datos.conteoPorEstado());

  // ------------------------------------------------------------------ avisos
  if (ruta === '/notificaciones' && req.method === 'GET') return ok(datos.listaAvisos());
  m = ruta.match(/^\/notificaciones\/([^/]+)\/reintento$/);
  if (m) return ok(datos.reintentarAviso(m[1]));

  // ----------------------------------------------------------------- rastreo
  m = ruta.match(/^\/tracking\/([^/]+)$/);
  if (m) {
    const verificacion = params.get('verificacion');
    if (!verificacion) return error(400, "Falta el dato 'verificacion' en la consulta");
    const encontrado = datos.rastrear(m[1], verificacion);
    return encontrado
      ? ok(encontrado)
      : error(404, 'No encontramos una encomienda con esos datos. Verifique el número y el código de su comprobante.');
  }

  // ------------------------------------------------------------------ tarifa
  if (ruta === '/tarifas/cotizar') return ok(datos.cotizar(cuerpo.carga));

  // --------------------------------------------------------------- encomiendas
  if (ruta === '/envios/para-entrega') return ok(datos.paraEntrega(params.get('dni') ?? ''));
  if (ruta === '/envios' && req.method === 'GET') return ok(datos.buscar(params));
  if (ruta === '/envios' && req.method === 'POST') {
    return ok(datos.admitir(cuerpo, usuarioActual().username), 201);
  }

  m = ruta.match(/^\/envios\/([^/]+)\/siguientes-estados$/);
  if (m) {
    const envio = datos.porCodigo(m[1]);
    return ok(siguientes(envio?.estadoActual));
  }

  m = ruta.match(/^\/envios\/([^/]+)\/anulacion$/);
  if (m) return ok(datos.anular(m[1], cuerpo.motivo, usuarioActual().username));

  m = ruta.match(/^\/envios\/([^/]+)\/clave-recojo$/);
  if (m) {
    return ok({
      codigoRastreo: m[1],
      claveRecojo: datos.nuevaClave(m[1]),
      aviso: 'La clave anterior dejó de ser válida. Comuníquesela al cliente: no vuelve a mostrarse.',
    });
  }

  m = ruta.match(/^\/envios\/([^/]+)\/entrega$/);
  if (m) {
    const r = datos.entregar(m[1], cuerpo, usuarioActual().username);
    return r.error ? error(409, r.error) : ok(r.envio);
  }

  m = ruta.match(/^\/envios\/([^/]+)\/estado$/);
  if (m) {
    return ok(datos.cambiarEstado(m[1], cuerpo.estado, cuerpo.agenciaId,
      usuarioActual().username, cuerpo.observacion));
  }

  if (ruta === '/envios/estado-lote') {
    const codigos: string[] = cuerpo.codigos ?? [];
    codigos.forEach((c) => datos.cambiarEstado(c, cuerpo.estado, cuerpo.agenciaId,
      usuarioActual().username, cuerpo.observacion));
    return ok({
      total: codigos.length, actualizados: codigos.length,
      codigosActualizados: codigos, fallidos: [],
    });
  }

  m = ruta.match(/^\/envios\/([^/]+)$/);
  if (m) {
    const envio = datos.porCodigo(m[1]);
    return envio ? ok(envio) : error(404, 'No existe una encomienda con el código ' + m[1]);
  }

  return error(404, 'Recurso no disponible en la vista de demostración');
};

/** Mismas transiciones que valida el back-end. */
function siguientes(estado?: string): string[] {
  switch (estado) {
    case 'REGISTRADO': return ['EN_ALMACEN_ORIGEN', 'INCIDENCIA'];
    case 'EN_ALMACEN_ORIGEN': return ['EN_TRANSITO', 'INCIDENCIA'];
    case 'EN_TRANSITO': return ['EN_ALMACEN_DESTINO', 'INCIDENCIA'];
    case 'EN_ALMACEN_DESTINO': return ['LISTO_PARA_RECOJO', 'INCIDENCIA'];
    case 'LISTO_PARA_RECOJO': return ['ENTREGADO', 'DEVUELTO', 'INCIDENCIA'];
    case 'INCIDENCIA': return ['EN_ALMACEN_ORIGEN', 'EN_TRANSITO', 'EN_ALMACEN_DESTINO', 'DEVUELTO'];
    default: return [];
  }
}

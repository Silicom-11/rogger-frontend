import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Pantalla {
  ruta: string;
  nombre: string;
  detalle: string;
}

interface Grupo {
  titulo: string;
  quien: string;
  pantallas: Pantalla[];
}

/**
 * Índice del recorrido de demostración.
 *
 * Reúne en un solo lugar la dirección de cada pantalla del sistema. Cada enlace
 * abre la pantalla ya con su rol adoptado y con datos cargados, de modo que
 * pueda verse —o capturarse— sin necesidad de iniciar sesión ni de tener el
 * back-end en marcha.
 */
@Component({
  selector: 'app-escaparate',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pagina">
      <header class="cabecera">
        <div class="marca">
          <div class="marca__logo">RE</div>
          <div>
            <div class="marca__nombre">Rogger Express</div>
            <div class="marca__sub">Sistema de gestión de encomiendas · Lima – Huancayo</div>
          </div>
        </div>
      </header>

      <main class="cuerpo">
        <h1>Recorrido del sistema</h1>
        <p class="entrada">
          Cada enlace abre una pantalla del sistema con su rol y sus datos ya cargados.
          Son {{ total }} pantallas, agrupadas por quién las usa.
        </p>

        <div class="nota">
          <strong>Vista de demostración.</strong>
          Esta publicación funciona sin servidor: los datos están incluidos en la propia
          aplicación y corresponden a un juego de prueba, no a personas ni a envíos reales.
          Los cambios que se hagan aquí se pierden al recargar la página.
        </div>

        @for (grupo of grupos; track grupo.titulo) {
          <section class="grupo">
            <div class="grupo__cabecera">
              <h2>{{ grupo.titulo }}</h2>
              <span class="grupo__quien">{{ grupo.quien }}</span>
            </div>
            <div class="rejilla">
              @for (p of grupo.pantallas; track p.ruta) {
                <a class="tarjeta" [routerLink]="p.ruta">
                  <div class="tarjeta__nombre">{{ p.nombre }}</div>
                  <div class="tarjeta__detalle">{{ p.detalle }}</div>
                  <div class="tarjeta__ruta">{{ p.ruta }}</div>
                </a>
              }
            </div>
          </section>
        }
      </main>

      <footer class="pie">
        Proyecto integrador · Desarrollo Web Integrado · Universidad Tecnológica del Perú
      </footer>
    </div>
  `,
  styles: [`
    .pagina { min-height: 100vh; display: flex; flex-direction: column; background: var(--fondo); }
    .cabecera { background: var(--navy-900); padding: 1rem 2rem; }
    .marca { display: flex; align-items: center; gap: .7rem; color: #fff; }
    .marca__logo {
      width: 38px; height: 38px; border-radius: 10px; background: var(--naranja-500);
      display: grid; place-items: center; font-weight: 800; font-size: .9rem;
    }
    .marca__nombre { font-weight: 700; font-size: .95rem; }
    .marca__sub { font-size: .74rem; color: #9db0cd; }

    .cuerpo { flex: 1; width: 100%; max-width: 1080px; margin: 0 auto; padding: 2.5rem 1.5rem; }
    h1 { font-size: 2rem; margin-bottom: .2rem; }
    .entrada { color: var(--texto-sec); margin-top: 0; }

    .nota {
      background: var(--naranja-100); border: 1px solid #f0d3bb; color: #7a4a1d;
      border-radius: var(--radio); padding: .9rem 1.1rem; font-size: .88rem;
      line-height: 1.55; margin: 1.2rem 0 2rem;
    }

    .grupo { margin-bottom: 2.2rem; }
    .grupo__cabecera { display: flex; align-items: baseline; gap: .8rem; margin-bottom: .8rem; }
    h2 { font-size: 1.1rem; margin: 0; }
    .grupo__quien { font-size: .8rem; color: var(--texto-sec); }

    .rejilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: .8rem; }
    .tarjeta {
      display: block; background: #fff; border: 1px solid var(--borde);
      border-radius: var(--radio); padding: .9rem 1rem; text-decoration: none;
      color: var(--texto); box-shadow: var(--sombra);
      transition: border-color .15s ease, transform .15s ease;
    }
    .tarjeta:hover { border-color: var(--navy-600); transform: translateY(-1px); text-decoration: none; }
    .tarjeta__nombre { font-weight: 700; font-size: .95rem; }
    .tarjeta__detalle { font-size: .8rem; color: var(--texto-sec); line-height: 1.45; margin: .2rem 0 .5rem; }
    .tarjeta__ruta { font-family: 'Consolas', monospace; font-size: .72rem; color: var(--navy-600); }

    .pie { padding: 1.6rem; text-align: center; font-size: .8rem; color: var(--texto-sec); }
  `],
})
export class EscaparateComponent {

  readonly grupos: Grupo[] = [
    {
      titulo: 'Lo que ve el cliente',
      quien: 'sin iniciar sesión',
      pantallas: [
        { ruta: '/rastrear', nombre: 'Consultar encomienda',
          detalle: 'Se piden los dos datos del comprobante' },
        { ruta: '/rastrear/RE-2026-000010/B827', nombre: 'Lista para el recojo',
          detalle: 'Etapa 3 de 4, con lo que debe presentar' },
        { ruta: '/rastrear/RE-2026-000011/2CCU', nombre: 'Ya entregada',
          detalle: 'Etapa 4 de 4, con la constancia de entrega' },
        { ruta: '/login', nombre: 'Acceso del personal',
          detalle: 'Puerta de entrada al sistema interno' },
      ],
    },
    {
      titulo: 'Ventanilla',
      quien: 'operador de agencia',
      pantallas: [
        { ruta: '/vista/operador/tablero', nombre: 'Tablero del operador',
          detalle: 'Su arqueo del turno y accesos directos' },
        { ruta: '/vista/operador/ventanilla', nombre: 'Admitir encomienda',
          detalle: 'Cotización, clave de seguridad y comprobante' },
        { ruta: '/vista/operador/encomiendas', nombre: 'Buscar encomiendas',
          detalle: 'Filtros por estado, agencia, fecha y texto' },
        { ruta: '/vista/operador/encomienda/RE-2026-000010', nombre: 'Ficha de encomienda',
          detalle: 'Datos, tarifa e historial de seguimiento' },
        { ruta: '/vista/operador/encomienda/RE-2026-000011', nombre: 'Constancia de entrega',
          detalle: 'Quién retiró, con qué documento y con clave' },
      ],
    },
    {
      titulo: 'Almacén y mostrador',
      quien: 'personal de la agencia de destino',
      pantallas: [
        { ruta: '/vista/almacen/tablero', nombre: 'Tablero del almacén',
          detalle: 'Lo que llega y lo que se acumula sin recoger' },
        { ruta: '/vista/almacen/almacen', nombre: 'Bandejas del almacén',
          detalle: 'Por llegar, en almacén y para entregar' },
        { ruta: '/vista/almacen/mostrador', nombre: 'Mostrador de recojo',
          detalle: 'Se le pide el documento a quien viene' },
        { ruta: '/vista/almacen/mostrador?dni=44556677', nombre: 'Recojo por autorizado',
          detalle: 'Lo que ese documento puede retirar, y la clave' },
        { ruta: '/vista/almacen/avisos', nombre: 'Avisos al cliente',
          detalle: 'Bitácora de mensajes y reenvío de los fallidos' },
        { ruta: '/vista/almacen/contrasena', nombre: 'Mi contraseña',
          detalle: 'Cambio de la propia contraseña' },
      ],
    },
    {
      titulo: 'Administración',
      quien: 'administrador de la red',
      pantallas: [
        { ruta: '/vista/admin/tablero', nombre: 'Tablero de la red',
          detalle: 'Toda la operación, con los importes facturados' },
        { ruta: '/vista/admin/administracion', nombre: 'Agencias, personal y tarifario',
          detalle: 'Catálogos y credenciales del sistema' },
      ],
    },
  ];

  get total(): number {
    return this.grupos.reduce((n, g) => n + g.pantallas.length, 0);
  }
}

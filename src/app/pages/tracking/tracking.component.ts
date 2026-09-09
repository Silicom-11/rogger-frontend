import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EnvioService } from '../../core/services/envio.service';
import { ESTADOS, Tracking } from '../../core/models/modelos';

interface Etapa {
  numero: number;
  etiqueta: string;
}

/**
 * Portal público del cliente.
 *
 * El cliente no inicia sesión: consulta con los dos datos impresos en su
 * comprobante, igual que en cualquier agencia de encomiendas del país. El
 * recorrido se resume en cuatro etapas, que es lo que realmente necesita saber;
 * el detalle completo queda disponible más abajo para quien quiera verlo.
 */
@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="portal">

      <header class="portal__cabecera">
        <div class="marca">
          <div class="marca__logo">RE</div>
          <div>
            <div class="marca__nombre">Rogger Express</div>
            <div class="marca__sub">Encomiendas Lima – Huancayo</div>
          </div>
        </div>
        <a class="btn btn--contorno btn--sm" routerLink="/login">Acceso del personal</a>
      </header>

      <main class="portal__cuerpo">

        <h1>Conoce dónde está tu encomienda</h1>
        <p class="texto-sec">
          Ingresa los dos datos que figuran en tu comprobante de admisión.
        </p>

        <form class="buscador" (ngSubmit)="buscar()">
          <div class="campo">
            <label>N° de encomienda</label>
            <input type="text" name="codigo" [(ngModel)]="codigo" maxlength="15"
                   placeholder="RE-2026-000001" autocomplete="off" />
          </div>
          <div class="campo campo--corto">
            <label>Código</label>
            <input type="text" name="verificacion" [(ngModel)]="verificacion" maxlength="4"
                   placeholder="K7QM" autocomplete="off" class="mayusculas" />
          </div>
          <button class="btn btn--primario" type="submit" [disabled]="cargando()">
            {{ cargando() ? 'Buscando…' : 'Buscar' }}
          </button>
        </form>

        @if (error()) {
          <div class="aviso aviso--error">
            <strong>No encontramos esa encomienda.</strong>
            Revisa que el número y el código estén tal como aparecen en tu comprobante.
          </div>
        }

        @if (envio(); as e) {

          <section class="tarjeta" [class.tarjeta--final]="e.finalizado">

            <div class="tarjeta__estado">
              <div class="tarjeta__etiqueta">{{ e.etapaEtiqueta }}</div>
              @if (e.desde) {
                <div class="tarjeta__desde">
                  Desde el {{ e.desde | date: 'dd-MM-yy' }} a las {{ e.desde | date: 'HH:mm' }}
                </div>
              }
            </div>

            <ol class="pasos">
              @for (p of etapas; track p.numero) {
                <li class="paso"
                    [class.paso--hecho]="e.etapa >= p.numero && e.etapa > 0"
                    [class.paso--actual]="e.etapa === p.numero">
                  <span class="paso__numero">{{ p.numero }}</span>
                  <span class="paso__texto">{{ p.etiqueta }}</span>
                </li>
              }
            </ol>

            <p class="tarjeta__mensaje">{{ e.mensaje }}</p>

            <div class="ruta">
              <div>
                <div class="ruta__rotulo">Origen</div>
                <div class="ruta__valor">{{ e.agenciaOrigen }}</div>
              </div>
              <span class="ruta__flecha">→</span>
              <div>
                <div class="ruta__rotulo">Destino</div>
                <div class="ruta__valor">{{ e.agenciaDestino }}</div>
              </div>
            </div>

            @if (e.entrega; as entrega) {
              <div class="entrega">
                Entregada el {{ entrega.fecha | date: 'dd-MM-yy' }} a las {{ entrega.fecha | date: 'HH:mm' }}
                a <strong>{{ entrega.receptorNombres }}</strong>, DNI {{ entrega.documento }}.
              </div>
            } @else if (e.listoParaRecojo) {
              <div class="recojo">
                <strong>Para recogerla necesitas:</strong>
                <ul>
                  <li>tu DNI físico;</li>
                  <li>la clave de seguridad que te dio quien hizo el envío.</li>
                </ul>
              </div>
            }
          </section>

          <section class="detalle">
            <div class="detalle__fila">
              <span>Encomienda</span><span class="mono">{{ e.codigoRastreo }}</span>
            </div>
            <div class="detalle__fila">
              <span>Destinatario</span><span>{{ e.destinatario }} · {{ e.documentoDestinatario }}</span>
            </div>
            <div class="detalle__fila">
              <span>Contenido</span><span>{{ e.descripcionCarga }}</span>
            </div>
          </section>

          <button class="enlace" type="button" (click)="verHistorial.set(!verHistorial())">
            {{ verHistorial() ? 'Ocultar el detalle del recorrido' : 'Ver el detalle del recorrido' }}
          </button>

          @if (verHistorial()) {
            <ul class="historial">
              @for (h of e.historial; track $index) {
                <li>
                  <div class="historial__estado">{{ etiqueta(h.estado) }}</div>
                  <div class="historial__fecha">{{ h.fecha | date: 'dd/MM/yyyy HH:mm' }}</div>
                  @if (h.observacion) { <div class="historial__nota">{{ h.observacion }}</div> }
                </li>
              }
            </ul>
          }
        }

        @if (!envio() && !error()) {
          <div class="ayuda">
            <div class="ayuda__titulo">¿Dónde encuentro estos datos?</div>
            <div class="comprobante">
              <div class="comprobante__marca">ROGGER EXPRESS</div>
              <div class="comprobante__sub">Comprobante de admisión</div>
              <div class="comprobante__campos">
                <span class="resaltado">N° RE-2026-000001</span>
                <span class="resaltado">CÓDIGO: K7QM</span>
              </div>
              <div class="comprobante__pie">Clave de seguridad: la necesitarás al recoger</div>
            </div>
          </div>
        }
      </main>

      <footer class="portal__pie">
        Rogger Express · Proyecto integrador UTP · Desarrollo Web Integrado
      </footer>
    </div>
  `,
  styles: [`
    .portal { min-height: 100vh; display: flex; flex-direction: column; background: var(--fondo); }
    .portal__cabecera {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 2rem; background: var(--navy-900);
    }
    .marca { display: flex; align-items: center; gap: .7rem; color: #fff; }
    .marca__logo {
      width: 38px; height: 38px; border-radius: 10px; background: var(--naranja-500);
      display: grid; place-items: center; font-weight: 800; font-size: .9rem;
    }
    .marca__nombre { font-weight: 700; font-size: .95rem; }
    .marca__sub { font-size: .74rem; color: #9db0cd; }
    .portal__cabecera .btn { color: #fff; border-color: rgba(255,255,255,.35); }
    .portal__cabecera .btn:hover { background: rgba(255,255,255,.1); }

    .portal__cuerpo { flex: 1; width: 100%; max-width: 720px; margin: 0 auto; padding: 2.5rem 1.5rem; }
    h1 { font-size: 1.95rem; margin-bottom: .3rem; }

    .buscador { display: flex; gap: .7rem; align-items: flex-end; margin: 1.5rem 0 1.2rem; }
    .buscador .campo { flex: 1; }
    .buscador .campo--corto { flex: 0 0 120px; }
    .buscador input { font-family: 'Consolas', monospace; }
    .mayusculas { text-transform: uppercase; }
    .buscador .btn { height: 42px; }

    .aviso { border-radius: var(--radio); padding: .85rem 1rem; font-size: .9rem; line-height: 1.5; }
    .aviso--error { background: #fdeaea; color: #b42318; border: 1px solid #f3c4c0; }

    .tarjeta {
      background: #fff; border: 1px solid var(--borde); border-radius: var(--radio);
      box-shadow: var(--sombra); padding: 1.6rem; margin-top: 1.4rem;
      border-top: 4px solid var(--navy-600);
    }
    .tarjeta--final { border-top-color: var(--verde-600); }
    .tarjeta__estado { text-align: center; }
    .tarjeta__etiqueta {
      font-size: 1.6rem; font-weight: 800; color: var(--navy-700);
      text-transform: uppercase; letter-spacing: .01em;
    }
    .tarjeta--final .tarjeta__etiqueta { color: var(--verde-600); }
    .tarjeta__desde { font-size: .85rem; color: var(--texto-sec); margin-top: .2rem; }

    .pasos { display: flex; gap: .6rem; justify-content: center; list-style: none;
             padding: 0; margin: 1.3rem 0 1rem; }
    .paso { text-align: center; flex: 0 0 84px; }
    .paso__numero {
      display: grid; place-items: center; width: 46px; height: 46px; margin: 0 auto .35rem;
      border-radius: 12px; background: var(--gris-100); color: var(--texto-sec);
      font-size: 1.25rem; font-weight: 800;
    }
    .paso--hecho .paso__numero { background: var(--navy-100, #dbe4f3); color: var(--navy-700); }
    .paso--actual .paso__numero { background: var(--navy-700); color: #fff; }
    .paso__texto { font-size: .7rem; text-transform: uppercase; letter-spacing: .03em;
                   color: var(--texto-sec); font-weight: 600; }
    .paso--actual .paso__texto { color: var(--navy-700); }

    .tarjeta__mensaje { text-align: center; margin: 0 0 1.1rem; color: var(--texto); }

    .ruta {
      display: flex; align-items: center; justify-content: space-around; gap: 1rem;
      background: var(--navy-50); border-radius: 10px; padding: .8rem 1rem;
    }
    .ruta__rotulo { font-size: .7rem; text-transform: uppercase; letter-spacing: .04em;
                    color: var(--texto-sec); font-weight: 700; }
    .ruta__valor { font-weight: 700; color: var(--navy-700); }
    .ruta__flecha { color: var(--naranja-500); font-size: 1.3rem; font-weight: 700; }

    .entrega, .recojo {
      margin-top: 1rem; border-radius: 10px; padding: .8rem 1rem; font-size: .9rem; line-height: 1.55;
    }
    .entrega { background: #e6f5ec; color: #1a7f43; }
    .recojo { background: var(--naranja-100); color: #7a4a1d; }
    .recojo ul { margin: .35rem 0 0; padding-left: 1.1rem; }

    .detalle { background: #fff; border: 1px solid var(--borde); border-radius: var(--radio);
               margin-top: 1rem; padding: .4rem 1.1rem; }
    .detalle__fila { display: flex; justify-content: space-between; gap: 1rem;
                     padding: .6rem 0; border-bottom: 1px solid var(--borde); font-size: .9rem; }
    .detalle__fila:last-child { border-bottom: none; }
    .detalle__fila span:first-child { color: var(--texto-sec); }

    .enlace { background: none; border: none; color: var(--navy-600); cursor: pointer;
              font: inherit; font-size: .88rem; padding: .8rem 0; text-decoration: underline; }

    .historial { list-style: none; padding: 0; margin: 0 0 1rem; }
    .historial li { border-left: 2px solid var(--borde); padding: .5rem 0 .5rem .9rem; }
    .historial__estado { font-weight: 600; font-size: .9rem; }
    .historial__fecha { font-size: .78rem; color: var(--texto-sec); }
    .historial__nota { font-size: .82rem; color: var(--texto-sec); }

    .ayuda { margin-top: 2rem; }
    .ayuda__titulo { font-weight: 600; margin-bottom: .6rem; color: var(--texto-sec); font-size: .9rem; }
    .comprobante {
      border: 2px dashed var(--borde); border-radius: var(--radio);
      background: #fff; padding: 1.1rem 1.3rem; text-align: center; max-width: 380px;
    }
    .comprobante__marca { font-weight: 800; letter-spacing: .06em; font-size: .8rem; }
    .comprobante__sub { font-size: .72rem; color: var(--texto-sec); margin-bottom: .8rem; }
    .comprobante__campos { display: flex; gap: .5rem; justify-content: center; flex-wrap: wrap; }
    .resaltado {
      border: 1px solid var(--naranja-500); color: var(--naranja-600);
      border-radius: 6px; padding: .2rem .5rem; font-family: 'Consolas', monospace; font-size: .78rem;
    }
    .comprobante__pie { font-size: .72rem; color: var(--texto-sec); margin-top: .7rem; }

    .portal__pie { padding: 1.4rem; text-align: center; font-size: .8rem; color: var(--texto-sec); }

    @media (max-width: 640px) {
      .buscador { flex-wrap: wrap; }
      .buscador .campo--corto { flex: 1 1 100px; }
      .paso { flex: 0 0 70px; }
    }
  `],
})
export class TrackingComponent implements OnInit {

  private readonly servicio = inject(EnvioService);
  private readonly ruta = inject(ActivatedRoute);

  codigo = '';
  verificacion = '';

  readonly envio = signal<Tracking | null>(null);
  readonly cargando = signal(false);
  readonly error = signal(false);
  readonly verHistorial = signal(false);

  readonly etapas: Etapa[] = [
    { numero: 1, etiqueta: 'En origen' },
    { numero: 2, etiqueta: 'En tránsito' },
    { numero: 3, etiqueta: 'En destino' },
    { numero: 4, etiqueta: 'Entregado' },
  ];

  /**
   * Cuando la dirección ya trae el código y su verificación, la consulta se
   * resuelve sola: es el enlace que se le puede pasar al cliente.
   */
  ngOnInit(): void {
    const p = this.ruta.snapshot.params;
    if (p['codigo'] && p['verificacion']) {
      this.codigo = p['codigo'];
      this.verificacion = p['verificacion'];
      this.buscar();
    }
  }

  buscar(): void {
    const codigo = this.codigo.trim().toUpperCase();
    const verificacion = this.verificacion.trim().toUpperCase();
    if (!codigo || !verificacion) {
      this.error.set(true);
      return;
    }

    this.cargando.set(true);
    this.error.set(false);
    this.envio.set(null);
    this.verHistorial.set(false);

    this.servicio.rastrear(codigo, verificacion).subscribe({
      next: (envio) => { this.envio.set(envio); this.cargando.set(false); },
      error: () => { this.error.set(true); this.cargando.set(false); },
    });
  }

  etiqueta(estado: string): string {
    return ESTADOS[estado as keyof typeof ESTADOS]?.etiqueta ?? estado;
  }
}

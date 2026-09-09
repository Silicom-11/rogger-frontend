import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MensajeriaService } from '../../core/services/mensajeria.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { AvisoCliente, EstadoAviso } from '../../core/models/modelos';

/**
 * Bitacora de avisos al cliente.
 *
 * Deja ver que aviso salio, cual fallo y por que, y permite reenviar los que no
 * llegaron. Sin esta pantalla el personal no tendria como saber si el
 * destinatario fue realmente informado.
 */
@Component({
  selector: 'app-mensajeria',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="fila fila--entre mb-2">
      <div>
        <h1>Avisos al cliente</h1>
        <p class="texto-sec mt-0">
          Mensajes que el sistema envía al destinatario cuando su encomienda queda lista para el recojo.
          @if (!auth.veTodaLaRed()) {
            <span class="mono">Agencia {{ auth.agencia() }}.</span>
          }
        </p>
      </div>
      <button class="btn btn--suave" (click)="cargar()" [disabled]="cargando()">Actualizar</button>
    </div>

    <div class="fila mb-2 filtros">
      @for (f of filtros; track f.valor) {
        <button class="chip" [class.chip--activo]="estado() === f.valor" (click)="filtrar(f.valor)">
          {{ f.etiqueta }}
        </button>
      }
    </div>

    @if (soloRegistro()) {
      <div class="nota mb-2">
        <strong>Modo bitácora.</strong>
        La empresa aún no tiene contratada una pasarela de SMS o WhatsApp, así que los mensajes
        quedan registrados aquí pero <strong>no llegan al teléfono del cliente</strong>.
        Al contratar el servicio basta configurar el proveedor en la API: la aplicación no cambia.
      </div>
    }

    <div class="card">
      @if (cargando()) {
        <div class="cargando">Cargando avisos…</div>
      } @else {
        <div class="tabla-contenedor">
          <table class="tabla">
            <thead>
              <tr>
                <th>Encomienda</th><th>Destino</th><th>Canal</th>
                <th>Situación</th><th class="centrado">Intentos</th>
                <th>Último movimiento</th><th></th>
              </tr>
            </thead>
            <tbody>
              @for (a of avisos(); track a.id) {
                <tr>
                  <td>
                    <a class="mono" [routerLink]="['/panel/envios', a.codigoRastreo]">{{ a.codigoRastreo }}</a>
                  </td>
                  <td class="mono">{{ a.destino || '—' }}</td>
                  <td class="texto-sm">{{ a.canal }}</td>
                  <td>
                    <span class="pastilla" [class]="'pastilla--' + color(a)">{{ situacion(a) }}</span>
                    @if (a.ultimoError) {
                      <div class="texto-xs texto-sec error">{{ a.ultimoError }}</div>
                    }
                    @if (a.referenciaProveedor) {
                      <div class="texto-xs texto-sec mono">ref. {{ a.referenciaProveedor }}</div>
                    }
                  </td>
                  <td class="centrado">{{ a.intentos }}</td>
                  <td class="texto-sm">{{ a.fechaActualizacion | date: 'dd/MM/yy HH:mm' }}</td>
                  <td class="centrado">
                    @if (puedeReenviar() && a.estado !== 'ENVIADO') {
                      <button class="btn btn--suave btn--sm" (click)="reenviar(a)"
                              [disabled]="enviando() === a.id">
                        {{ enviando() === a.id ? 'Enviando…' : 'Reenviar' }}
                      </button>
                    }
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="tabla__vacia">
                    @if (auth.veTodaLaRed()) {
                      Todavía no hay avisos registrados.
                    } @else {
                      Todavía no hay avisos registrados para su agencia.
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <p class="texto-xs texto-sec mt-1">
          Los avisos fallidos se reintentan solos cada pocos minutos. El botón <em>Reenviar</em>
          fuerza un intento inmediato.
        </p>
      }
    </div>
  `,
  styles: [`
    .filtros { gap: .4rem; flex-wrap: wrap; }
    .chip {
      border: 1px solid var(--borde); background: #fff; border-radius: 999px;
      padding: .3rem .85rem; font-size: .84rem; cursor: pointer; color: var(--texto-sec);
    }
    .chip:hover { border-color: var(--navy-600); color: var(--navy-700); }
    .chip--activo { background: var(--navy-600); border-color: var(--navy-600); color: #fff; font-weight: 600; }

    .pastilla {
      display: inline-block; border-radius: 999px; padding: .16rem .6rem;
      font-size: .76rem; font-weight: 700;
    }
    .pastilla--verde  { background: #e6f5ec; color: #1a7f43; }
    .pastilla--gris   { background: var(--gris-100); color: var(--gris-600); }
    .pastilla--rojo   { background: #fdeaea; color: #b42318; }
    .pastilla--naranja{ background: var(--naranja-100); color: var(--naranja-600); }

    .error { max-width: 320px; }

    .nota {
      background: var(--naranja-100); border: 1px solid #f0d3bb; color: #7a4a1d;
      border-radius: var(--radio); padding: .8rem 1rem; font-size: .88rem; line-height: 1.5;
    }
  `],
})
export class MensajeriaComponent implements OnInit {

  private readonly mensajeria = inject(MensajeriaService);
  private readonly avisosUi = inject(NotificacionService);
  readonly auth = inject(AuthService);

  readonly avisos = signal<AvisoCliente[]>([]);
  readonly cargando = signal(true);
  readonly estado = signal<EstadoAviso | ''>('');
  readonly enviando = signal<string | null>(null);

  readonly filtros: { etiqueta: string; valor: EstadoAviso | '' }[] = [
    { etiqueta: 'Todos', valor: '' },
    { etiqueta: 'Enviados', valor: 'ENVIADO' },
    { etiqueta: 'Con problema', valor: 'ERROR' },
    { etiqueta: 'Pendientes', valor: 'PENDIENTE' },
  ];

  /** Solo puede reenviar quien opera el almacen de destino. */
  readonly puedeReenviar = computed(() => this.auth.tieneRol('ALMACEN', 'ADMIN'));

  /** true cuando ningun aviso salio realmente hacia el telefono del cliente. */
  readonly soloRegistro = computed(() => {
    const lista = this.avisos();
    return lista.length > 0 && lista.every((a) => !a.entregaReal);
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    const filtro = this.estado();
    this.mensajeria.listar(filtro === '' ? undefined : filtro).subscribe({
      next: (lista) => { this.avisos.set(lista); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }

  filtrar(valor: EstadoAviso | ''): void {
    this.estado.set(valor);
    this.cargar();
  }

  reenviar(aviso: AvisoCliente): void {
    this.enviando.set(aviso.id);
    this.mensajeria.reintentar(aviso.id).subscribe({
      next: (actualizado) => {
        this.enviando.set(null);
        this.avisos.update((lista) => lista.map((a) => (a.id === actualizado.id ? actualizado : a)));
        if (actualizado.estado === 'ENVIADO') {
          this.avisosUi.exito('Aviso reenviado a ' + actualizado.destino);
        } else {
          this.avisosUi.error('El aviso volvió a fallar: ' + (actualizado.ultimoError ?? 'sin detalle'));
        }
      },
      error: () => this.enviando.set(null),
    });
  }

  situacion(a: AvisoCliente): string {
    if (a.estado === 'ERROR') { return 'No entregado'; }
    if (a.estado === 'PENDIENTE') { return 'Pendiente'; }
    return a.entregaReal ? 'Entregado al proveedor' : 'Solo registrado';
  }

  color(a: AvisoCliente): string {
    if (a.estado === 'ERROR') { return 'rojo'; }
    if (a.estado === 'PENDIENTE') { return 'naranja'; }
    return a.entregaReal ? 'verde' : 'gris';
  }
}

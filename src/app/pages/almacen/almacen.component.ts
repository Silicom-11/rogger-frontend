import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EnvioService } from '../../core/services/envio.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { AuthService } from '../../core/services/auth.service';
import { ESTADOS, Envio, EstadoEnvio } from '../../core/models/modelos';
import { EstadoBadgeComponent } from '../../shared/estado-badge.component';
import { LineaTiempoComponent } from '../../shared/linea-tiempo.component';

interface Bandeja {
  clave: string;
  etiqueta: string;
  estado: EstadoEnvio;
  siguiente: EstadoEnvio | null;
  accion: string;
  ayuda: string;
}

/**
 * Control de almacen: lista de trabajo de la agencia, cambio de estado
 * individual o en lote, y entrega verificada.
 */
@Component({
  selector: 'app-almacen',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink,
            EstadoBadgeComponent, LineaTiempoComponent],
  template: `
    <div class="fila fila--entre mb-2">
      <div>
        <h1>Almacén</h1>
        <p class="texto-sec mt-0">
          Lista de trabajo de {{ auth.usuario()?.agenciaId }}. Marque varias encomiendas
          y muévalas de una sola vez, o busque una por su código.
        </p>
      </div>
      <button class="btn btn--suave btn--sm" (click)="cargarBandeja()">Actualizar</button>
    </div>

    <!-- ================= LISTA DE TRABAJO ================= -->
    <div class="card mb-2">
      <div class="pestanias">
        @for (b of bandejas; track b.clave) {
          <button class="pestania" [class.pestania--activa]="bandeja().clave === b.clave"
                  (click)="cambiarBandeja(b)">
            {{ b.etiqueta }}
            @if (bandeja().clave === b.clave) { <span class="cuenta">{{ lista().length }}</span> }
          </button>
        }
      </div>

      <p class="texto-sm texto-sec">{{ bandeja().ayuda }}</p>

      <div class="tabla-contenedor mt-1">
        <table class="tabla">
          <thead>
            <tr>
              <th style="width:44px">
                <input type="checkbox" [checked]="todasMarcadas()" (change)="alternarTodas()"
                       [disabled]="!lista().length" title="Seleccionar todas" />
              </th>
              <th>Código</th><th>Destinatario</th><th>Contenido</th>
              <th>Peso</th><th>Estado</th><th></th>
            </tr>
          </thead>
          <tbody>
            @if (cargandoLista()) {
              <tr><td colspan="7" class="tabla__vacia">Cargando…</td></tr>
            } @else {
              @for (e of lista(); track e.codigoRastreo) {
                <tr [class.marcada]="marcadas().has(e.codigoRastreo)">
                  <td>
                    <input type="checkbox" [checked]="marcadas().has(e.codigoRastreo)"
                           (change)="alternar(e.codigoRastreo)" />
                  </td>
                  <td class="mono negrita">{{ e.codigoRastreo }}</td>
                  <td>
                    <div>{{ e.destinatario.nombres }}</div>
                    <div class="texto-xs texto-sec mono">{{ e.destinatario.dni }}</div>
                  </td>
                  <td class="texto-sm">{{ e.carga.descripcion }}</td>
                  <td class="texto-sm">{{ e.carga.pesoKg }} kg</td>
                  <td><app-estado-badge [estado]="e.estadoActual" /></td>
                  <td>
                    <button class="btn btn--suave btn--sm" (click)="abrir(e.codigoRastreo)">Abrir</button>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="7" class="tabla__vacia">
                  No hay encomiendas en esta bandeja.
                </td></tr>
              }
            }
          </tbody>
        </table>
      </div>

      @if (marcadas().size > 0 && bandeja().siguiente) {
        <div class="barra-lote">
          <span class="negrita">{{ marcadas().size }} seleccionada(s)</span>
          <input type="text" [(ngModel)]="observacionLote" class="lote__obs"
                 placeholder="Observación (opcional)" />
          <button class="btn btn--secundario" (click)="aplicarLote()" [disabled]="procesandoLote()">
            {{ procesandoLote() ? 'Procesando…' : bandeja().accion }}
          </button>
          <button class="btn btn--contorno btn--sm" (click)="limpiarSeleccion()">Quitar selección</button>
        </div>
      }
    </div>

    <!-- ================= BUSQUEDA PUNTUAL ================= -->
    <div class="card mb-2">
      <div class="buscador">
        <input type="text" [(ngModel)]="codigo" class="buscador__input mono"
               placeholder="Buscar por código: RE-2026-000001" (keyup.enter)="cargar()" />
        <button class="btn btn--secundario" (click)="cargar()" [disabled]="buscando()">
          {{ buscando() ? 'Buscando…' : 'Cargar' }}
        </button>
      </div>
      @if (noEncontrado()) {
        <div class="aviso-inline mt-2">No existe una encomienda con ese código.</div>
      }
    </div>

    <!-- ================= DETALLE ================= -->
    @if (envio(); as e) {
      <div class="rejilla rejilla--2">

        <div class="columna">
          <div class="card">
            <div class="fila fila--entre mb-2">
              <div>
                <div class="texto-xs texto-sec">ENCOMIENDA</div>
                <div class="mono negrita codigo">{{ e.codigoRastreo }}</div>
              </div>
              <app-estado-badge [estado]="e.estadoActual" />
            </div>

            <div class="dato"><span>Destinatario</span><span>{{ e.destinatario.nombres }}</span></div>
            <div class="dato"><span>DNI del destinatario</span><span class="mono">{{ e.destinatario.dni }}</span></div>
            <div class="dato"><span>Contenido</span><span>{{ e.carga.descripcion }}</span></div>
            <div class="dato"><span>Peso</span><span>{{ e.carga.pesoKg }} kg</span></div>
            <div class="dato"><span>Ruta</span><span class="mono">{{ e.agenciaOrigenId }} → {{ e.agenciaDestinoId }}</span></div>
            <div class="dato"><span>Importe</span><span>{{ e.tarifa.total | currency: 'PEN':'S/ ':'1.2-2' }}</span></div>

            <a class="btn btn--suave btn--sm mt-2" [routerLink]="['/panel/envios', e.codigoRastreo]">
              Ver ficha completa
            </a>
          </div>

          <div class="card mt-2">
            <div class="card__titulo"><h3>Actualizar estado</h3></div>

            @if (siguientes().length) {
              <p class="texto-sec texto-sm">Seleccione el nuevo estado de la carga:</p>

              <div class="campo mt-1">
                <label>Observación @if (requiereMotivo()) { <span class="obligatorio">· obligatoria</span> }</label>
                <input type="text" [(ngModel)]="observacion"
                       placeholder="Ej.: paquete con embalaje dañado" />
              </div>

              <div class="acciones-estado">
                @for (s of siguientes(); track s) {
                  <button class="btn" [class]="claseBoton(s)" (click)="cambiar(s)"
                          [disabled]="guardando() || (s === 'INCIDENCIA' && !observacion.trim())"
                          [title]="s === 'INCIDENCIA' && !observacion.trim()
                                   ? 'Escriba el motivo de la incidencia' : ''">
                    {{ etiqueta(s) }}
                  </button>
                }
              </div>

              @if (requiereMotivo()) {
                <p class="texto-xs texto-sec mt-1">
                  Para registrar una incidencia debe indicar el motivo: queda en el historial del envío.
                </p>
              }
            } @else {
              <p class="texto-sec texto-sm">
                Esta encomienda ya se encuentra en un estado final y no admite más cambios.
              </p>
            }
          </div>

          @if (e.estadoActual === 'LISTO_PARA_RECOJO') {
            <div class="card mt-2 entrega">
              <div class="card__titulo"><h3>Lista para el recojo</h3></div>
              <p class="texto-sec texto-sm">
                La entrega se registra en el <strong>mostrador de recojo</strong>, donde se verifica
                el documento de quien viene y su clave de seguridad.
              </p>
              <a class="btn btn--exito mt-1" routerLink="/panel/mostrador">
                Ir al mostrador de recojo →
              </a>
            </div>
          }
        </div>

        <div class="card">
          <div class="card__titulo"><h3>Historial</h3></div>
          <app-linea-tiempo [eventos]="e.historial" />
        </div>
      </div>
    }
  `,
  styles: [`
    .pestanias { display: flex; gap: .3rem; margin-bottom: .8rem; border-bottom: 2px solid var(--borde); }
    .pestania {
      background: transparent; border: none; cursor: pointer;
      padding: .55rem 1rem; font: inherit; font-weight: 600; font-size: .9rem;
      color: var(--texto-sec); border-bottom: 3px solid transparent; margin-bottom: -2px;
      display: flex; align-items: center; gap: .45rem;
    }
    .pestania:hover { color: var(--navy-700); }
    .pestania--activa { color: var(--navy-700); border-bottom-color: var(--naranja-500); }
    .cuenta {
      background: var(--navy-700); color: #fff; border-radius: 999px;
      font-size: .72rem; padding: .05rem .45rem;
    }
    tr.marcada { background: var(--navy-50); }
    .barra-lote {
      display: flex; align-items: center; gap: .7rem; flex-wrap: wrap;
      margin-top: .9rem; padding: .75rem .9rem;
      background: var(--navy-50); border: 1px solid var(--navy-100); border-radius: 10px;
    }
    .lote__obs {
      flex: 1; min-width: 180px; padding: .45rem .7rem;
      border: 1px solid var(--borde); border-radius: 8px; font: inherit; font-size: .88rem;
    }
    .buscador { display: flex; gap: .6rem; }
    .buscador__input {
      flex: 1; padding: .7rem 1rem; font-size: 1rem;
      border: 1px solid var(--borde); border-radius: 10px;
    }
    .buscador__input:focus { outline: none; border-color: var(--navy-600); box-shadow: 0 0 0 3px rgba(47,84,150,.13); }
    .codigo { font-size: 1.25rem; }
    .columna { display: flex; flex-direction: column; }
    .dato {
      display: flex; justify-content: space-between; gap: 1rem;
      padding: .4rem 0; border-bottom: 1px solid var(--borde); font-size: .9rem;
    }
    .dato > span:first-child { color: var(--texto-sec); }
    .dato > span:last-child { font-weight: 600; text-align: right; }
    .acciones-estado { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: .6rem; }
    .aviso-inline { background: var(--rojo-100); color: var(--rojo-600); padding: .5rem .75rem; border-radius: 8px; font-size: .85rem; }
    .entrega { border-left: 4px solid var(--verde-600); }
    .obligatorio { color: var(--rojo-600); }
  `],
})
export class AlmacenComponent implements OnInit {

  private readonly servicio = inject(EnvioService);
  private readonly avisos = inject(NotificacionService);
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthService);

  /** Bandejas de trabajo del almacen, en el orden del flujo logistico. */
  readonly bandejas: Bandeja[] = [
    {
      clave: 'porLlegar', etiqueta: 'Por llegar', estado: 'EN_TRANSITO',
      siguiente: 'EN_ALMACEN_DESTINO', accion: 'Registrar llegada al almacén',
      ayuda: 'Encomiendas que vienen en camino hacia esta agencia. Al descargar la unidad, márquelas y registre su llegada.',
    },
    {
      clave: 'enAlmacen', etiqueta: 'En almacén', estado: 'EN_ALMACEN_DESTINO',
      siguiente: 'LISTO_PARA_RECOJO', accion: 'Marcar listas para recojo',
      ayuda: 'Ya verificadas en el almacén. Al marcarlas como listas, el sistema avisa al destinatario.',
    },
    {
      clave: 'paraEntregar', etiqueta: 'Para entregar', estado: 'LISTO_PARA_RECOJO',
      siguiente: null, accion: '',
      ayuda: 'Esperando que el destinatario las recoja. Abra cada una para registrar la entrega con su DNI.',
    },
  ];

  readonly bandeja = signal<Bandeja>(this.bandejas[0]);
  readonly lista = signal<Envio[]>([]);
  readonly marcadas = signal<Set<string>>(new Set());
  readonly cargandoLista = signal(false);
  readonly procesandoLote = signal(false);

  codigo = '';
  observacion = '';
  observacionLote = '';

  readonly envio = signal<Envio | null>(null);
  readonly siguientes = signal<EstadoEnvio[]>([]);
  readonly buscando = signal(false);
  readonly guardando = signal(false);
  readonly noEncontrado = signal(false);

  readonly formEntrega = this.fb.nonNullable.group({
    receptorNombres: ['', Validators.required],
    receptorDni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    parentesco: ['Titular'],
  });

  ngOnInit(): void { this.cargarBandeja(); }

  // ---------------- lista de trabajo ----------------

  cambiarBandeja(b: Bandeja): void {
    this.bandeja.set(b);
    this.marcadas.set(new Set());
    this.cargarBandeja();
  }

  cargarBandeja(): void {
    this.cargandoLista.set(true);
    this.servicio.buscar({
      estado: this.bandeja().estado,
      agenciaDestinoId: this.auth.usuario()?.agenciaId,
      pagina: 0,
      tamanio: 100,
    }).subscribe({
      next: (p) => { this.lista.set(p.contenido); this.cargandoLista.set(false); },
      error: () => this.cargandoLista.set(false),
    });
  }

  alternar(codigo: string): void {
    const copia = new Set(this.marcadas());
    if (copia.has(codigo)) { copia.delete(codigo); } else { copia.add(codigo); }
    this.marcadas.set(copia);
  }

  alternarTodas(): void {
    this.marcadas.set(this.todasMarcadas()
      ? new Set()
      : new Set(this.lista().map((e) => e.codigoRastreo)));
  }

  limpiarSeleccion(): void {
    this.marcadas.set(new Set());
  }

  todasMarcadas(): boolean {
    return this.lista().length > 0 && this.marcadas().size === this.lista().length;
  }

  aplicarLote(): void {
    const siguiente = this.bandeja().siguiente;
    if (!siguiente || this.marcadas().size === 0) return;

    this.procesandoLote.set(true);
    const codigos = [...this.marcadas()];

    this.servicio.cambiarEstadoLote(codigos, siguiente,
      this.auth.usuario()?.agenciaId, this.observacionLote.trim() || undefined).subscribe({
      next: (r) => {
        this.procesandoLote.set(false);
        this.marcadas.set(new Set());
        this.observacionLote = '';
        if (r.actualizados > 0) {
          this.avisos.exito(`${r.actualizados} de ${r.total} encomiendas actualizadas`);
        }
        for (const f of r.fallidos) {
          this.avisos.error(`${f.codigo}: ${f.motivo}`);
        }
        this.cargarBandeja();
      },
      error: () => this.procesandoLote.set(false),
    });
  }

  abrir(codigo: string): void {
    this.codigo = codigo;
    this.cargar();
  }

  // ---------------- detalle ----------------

  cargar(): void {
    const codigo = this.codigo.trim().toUpperCase();
    if (!codigo) return;

    this.buscando.set(true);
    this.noEncontrado.set(false);
    this.envio.set(null);

    this.servicio.obtener(codigo).subscribe({
      next: (e) => { this.aplicar(e); this.buscando.set(false); },
      error: () => { this.noEncontrado.set(true); this.buscando.set(false); },
    });
  }

  cambiar(estado: EstadoEnvio): void {
    const actual = this.envio();
    if (!actual) return;

    if (estado === 'INCIDENCIA' && !this.observacion.trim()) {
      this.avisos.error('Indique el motivo de la incidencia antes de registrarla.');
      return;
    }

    this.guardando.set(true);
    const agencia = this.auth.usuario()?.agenciaId;

    this.servicio.cambiarEstado(actual.codigoRastreo, estado, agencia, this.observacion.trim() || undefined)
      .subscribe({
        next: (e) => {
          this.aplicar(e);
          this.observacion = '';
          this.guardando.set(false);
          this.avisos.exito(`Estado actualizado a ${this.etiqueta(estado)}`);
          this.cargarBandeja();
        },
        error: () => this.guardando.set(false),
      });
  }

  /** La incidencia siempre debe justificarse. */
  requiereMotivo(): boolean {
    return this.siguientes().includes('INCIDENCIA');
  }

  etiqueta(estado: EstadoEnvio): string { return ESTADOS[estado]?.etiqueta ?? estado; }

  claseBoton(estado: EstadoEnvio): string {
    if (estado === 'INCIDENCIA') return 'btn--peligro';
    if (estado === 'ENTREGADO') return 'btn--exito';
    if (estado === 'DEVUELTO') return 'btn--contorno';
    return 'btn--secundario';
  }

  private aplicar(e: Envio): void {
    this.envio.set(e);
    this.formEntrega.patchValue({ receptorNombres: e.destinatario.nombres });
    this.servicio.siguientesEstados(e.codigoRastreo)
      .subscribe({ next: (s) => this.siguientes.set(s.filter((x) => x !== 'ENTREGADO')) });
  }
}

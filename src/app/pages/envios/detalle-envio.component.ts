import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EnvioService } from '../../core/services/envio.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { ANULABLES, Envio } from '../../core/models/modelos';
import { EstadoBadgeComponent } from '../../shared/estado-badge.component';
import { LineaTiempoComponent } from '../../shared/linea-tiempo.component';

/** Ficha completa de una encomienda, con reimpresion del comprobante y anulacion. */
@Component({
  selector: 'app-detalle-envio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, EstadoBadgeComponent, LineaTiempoComponent],
  template: `
    <a class="texto-sm" routerLink="/panel/envios">← Volver al listado</a>

    @if (cargando()) {
      <div class="cargando">Cargando encomienda…</div>
    } @else {
      @if (envio(); as e) {

        <div class="fila fila--entre mt-2 mb-3">
          <div>
            <h1 class="mono">{{ e.codigoRastreo }}</h1>
            <p class="texto-sec mt-0">
              Registrada el {{ e.fechaRegistro | date: 'dd/MM/yyyy' }} a las {{ e.fechaRegistro | date: 'HH:mm' }}
            </p>
          </div>
          <div class="fila">
            <app-estado-badge [estado]="e.estadoActual" />
            <button class="btn btn--suave btn--sm" (click)="imprimir()">Reimprimir comprobante</button>
            @if (puedeReponerClave(e)) {
              <button class="btn btn--suave btn--sm" (click)="nuevaClave(e)" [disabled]="generando()">
                {{ generando() ? 'Generando…' : 'Nueva clave de seguridad' }}
              </button>
            }
            @if (puedeAnular(e)) {
              <button class="btn btn--peligro btn--sm" (click)="mostrarAnulacion.set(!mostrarAnulacion())">
                Anular
              </button>
            }
          </div>
        </div>

        @if (mostrarAnulacion()) {
          <div class="card anulacion mb-2">
            <h3>Anular esta admisión</h3>
            <p class="texto-sm texto-sec">
              La encomienda no se elimina: queda registrada como anulada y el motivo se
              guarda en su historial. Solo es posible mientras la carga no haya salido
              de la agencia de origen.
            </p>
            <div class="fila mt-2">
              <input type="text" class="motivo" [(ngModel)]="motivo"
                     placeholder="Motivo de la anulación (ej.: DNI del destinatario mal digitado)" />
              <button class="btn btn--peligro" (click)="anular()"
                      [disabled]="motivo.trim().length < 5 || anulando()">
                {{ anulando() ? 'Anulando…' : 'Confirmar anulación' }}
              </button>
              <button class="btn btn--contorno" (click)="mostrarAnulacion.set(false)">Cancelar</button>
            </div>
          </div>
        }

        <div class="rejilla rejilla--2">
          <div class="card">
            <div class="card__titulo"><h3>Remitente</h3></div>
            <div class="dato"><span>Nombres</span><span>{{ e.remitente.nombres }}</span></div>
            <div class="dato"><span>DNI</span><span class="mono">{{ e.remitente.dni }}</span></div>
            <div class="dato"><span>Teléfono</span><span class="mono">{{ e.remitente.telefono || '—' }}</span></div>
            <div class="dato"><span>Agencia de origen</span><span class="mono">{{ e.agenciaOrigenId }}</span></div>
          </div>

          <div class="card">
            <div class="card__titulo"><h3>Destinatario</h3></div>
            <div class="dato"><span>Nombres</span><span>{{ e.destinatario.nombres }}</span></div>
            <div class="dato"><span>DNI</span><span class="mono">{{ e.destinatario.dni }}</span></div>
            <div class="dato"><span>Teléfono</span><span class="mono">{{ e.destinatario.telefono || '—' }}</span></div>
            <div class="dato"><span>Agencia de destino</span><span class="mono">{{ e.agenciaDestinoId }}</span></div>
            @for (a of e.autorizados; track a.dni) {
              <div class="dato">
                <span>Autorizado a recoger</span>
                <span>{{ a.nombres }} · <span class="mono">{{ a.dni }}</span></span>
              </div>
            }
          </div>
        </div>

        @if (claveNueva(); as clave) {
          <div class="card clave-nueva mt-2">
            <div class="clave-nueva__titulo">Nueva clave de seguridad</div>
            <div class="clave-nueva__valor mono">{{ clave }}</div>
            <p class="texto-sm">
              Dictesela al cliente. La anterior dejó de servir y esta no vuelve a mostrarse.
            </p>
          </div>
        }

        @if (e.entrega; as entrega) {
          <div class="card entrega-constancia mt-2">
            <div class="card__titulo"><h3>Constancia de entrega</h3></div>
            <div class="dato"><span>Recibió</span><span>{{ entrega.receptorNombres }}</span></div>
            <div class="dato"><span>Documento</span><span class="mono">{{ entrega.receptorDni }}</span></div>
            <div class="dato">
              <span>Condición</span>
              <span>{{ entrega.relacion === 'AUTORIZADO' ? 'Persona autorizada' : 'Destinatario titular' }}</span>
            </div>
            <div class="dato">
              <span>Clave de seguridad</span>
              <span>
                @if (entrega.claveVerificada) {
                  <span class="ok">verificada</span>
                } @else {
                  <span class="atencion">no presentada</span>
                }
              </span>
            </div>
            @if (entrega.motivoSinClave) {
              <div class="dato"><span>Motivo</span><span>{{ entrega.motivoSinClave }}</span></div>
            }
            <div class="dato">
              <span>Fecha</span>
              <span>{{ entrega.fechaEntrega | date: 'dd/MM/yyyy HH:mm' }} · {{ entrega.usuario }}</span>
            </div>
          </div>
        }

        <div class="rejilla rejilla--2 mt-2">
          <div class="card">
            <div class="card__titulo"><h3>Carga</h3></div>
            <div class="dato"><span>Descripción</span><span>{{ e.carga.descripcion }}</span></div>
            <div class="dato"><span>Peso real</span><span>{{ e.carga.pesoKg }} kg</span></div>
            <div class="dato">
              <span>Dimensiones</span>
              <span>{{ e.carga.largoCm }} × {{ e.carga.anchoCm }} × {{ e.carga.altoCm }} cm</span>
            </div>
            <div class="dato"><span>Frágil</span><span>{{ e.carga.fragil ? 'Sí' : 'No' }}</span></div>
          </div>

          <div class="card">
            <div class="card__titulo"><h3>Tarifa</h3></div>
            <div class="dato">
              <span>Código de consulta</span>
              <span class="mono negrita">{{ e.codigoVerificacion || '—' }}</span>
            </div>
            <div class="dato"><span>Peso volumétrico</span><span>{{ e.tarifa.pesoVolumetrico }} kg</span></div>
            <div class="dato"><span>Peso facturable</span><span class="negrita">{{ e.tarifa.pesoFacturable }} kg</span></div>
            <div class="dato"><span>Monto base</span><span>S/ {{ e.tarifa.montoBase }}</span></div>
            <div class="dato"><span>Recargo</span><span>S/ {{ e.tarifa.recargo }}</span></div>
            <div class="dato dato--total">
              <span>Total</span>
              <span>{{ e.tarifa.total | currency: 'PEN':'S/ ':'1.2-2' }}</span>
            </div>
          </div>
        </div>

        <div class="card mt-2">
          <div class="card__titulo"><h3>Historial de seguimiento</h3></div>
          <app-linea-tiempo [eventos]="e.historial" />
        </div>

        <!-- Copia del comprobante: oculta en pantalla, visible solo al imprimir -->
        <div class="card comprobante">
          <div class="comprobante__marca">ROGGER EXPRESS</div>
          <div class="comprobante__titulo">Comprobante de admisión (copia)</div>
          <div class="comprobante__codigo mono">{{ e.codigoRastreo }}</div>
          <div class="comprobante__fila"><span>Fecha</span><span>{{ e.fechaRegistro | date: 'dd/MM/yyyy HH:mm' }}</span></div>
          <div class="comprobante__fila"><span>Remitente</span><span>{{ e.remitente.nombres }}</span></div>
          <div class="comprobante__fila"><span>Destinatario</span><span>{{ e.destinatario.nombres }}</span></div>
          <div class="comprobante__fila"><span>Contenido</span><span>{{ e.carga.descripcion }}</span></div>
          <div class="comprobante__fila"><span>Ruta</span><span>{{ e.agenciaOrigenId }} → {{ e.agenciaDestinoId }}</span></div>
          <div class="comprobante__fila"><span>Peso facturable</span><span>{{ e.tarifa.pesoFacturable }} kg</span></div>
          <div class="comprobante__total">
            <span>Total</span><strong>{{ e.tarifa.total | currency: 'PEN':'S/ ':'1.2-2' }}</strong>
          </div>
          <p class="comprobante__pie">Consulte el estado en el portal público con este código.</p>
        </div>
      }
    }
  `,
  styles: [`
    .dato {
      display: flex; justify-content: space-between; gap: 1rem;
      padding: .45rem 0; border-bottom: 1px solid var(--borde); font-size: .9rem;
    }
    .dato:last-child { border-bottom: none; }
    .dato > span:first-child { color: var(--texto-sec); }
    .dato > span:last-child { font-weight: 600; text-align: right; }
    .clave-nueva { border-left: 4px solid var(--naranja-500); text-align: center; }
    .clave-nueva__titulo {
      font-size: .72rem; text-transform: uppercase; letter-spacing: .05em;
      color: var(--texto-sec); font-weight: 700;
    }
    .clave-nueva__valor {
      font-size: 2rem; font-weight: 800; letter-spacing: .18em; color: var(--naranja-600);
      margin: .2rem 0 .3rem;
    }

    .entrega-constancia { border-left: 4px solid var(--verde-600); }
    .ok { color: var(--verde-600); font-weight: 700; }
    .atencion { color: var(--naranja-600); font-weight: 700; }

    .dato--total {
      border-top: 2px solid var(--navy-700); margin-top: .4rem; padding-top: .6rem;
      span:last-child { font-size: 1.15rem; color: var(--naranja-600); font-weight: 800; }
    }
    .anulacion { border-left: 4px solid var(--rojo-600); }
    .motivo {
      flex: 1; min-width: 220px; padding: .55rem .8rem;
      border: 1px solid var(--borde); border-radius: 8px; font: inherit; font-size: .9rem;
    }

    /* el comprobante solo existe para la impresion */
    .comprobante { display: none; }
    .comprobante__marca { font-weight: 800; letter-spacing: .08em; font-size: .8rem; }
    .comprobante__titulo { font-size: .78rem; color: var(--texto-sec); margin-bottom: .6rem; }
    .comprobante__codigo {
      font-size: 1.3rem; font-weight: 800; text-align: center;
      border: 1px dashed #999; border-radius: 8px; padding: .5rem; margin-bottom: .8rem;
    }
    .comprobante__fila {
      display: flex; justify-content: space-between; gap: 1rem; font-size: .84rem; padding: .22rem 0;
      span:first-child { color: #555; }
      span:last-child { text-align: right; font-weight: 600; }
    }
    .comprobante__total {
      display: flex; justify-content: space-between; margin-top: .6rem;
      padding-top: .6rem; border-top: 1px solid #999;
      strong { font-size: 1.15rem; }
    }
    .comprobante__pie { font-size: .76rem; color: #555; margin-top: .8rem; }

    @media print { .comprobante { display: block !important; } }
  `],
})
export class DetalleEnvioComponent implements OnInit {

  readonly codigo = input.required<string>();

  private readonly servicio = inject(EnvioService);
  private readonly avisos = inject(NotificacionService);
  private readonly auth = inject(AuthService);

  readonly envio = signal<Envio | null>(null);
  readonly cargando = signal(true);
  readonly mostrarAnulacion = signal(false);
  readonly anulando = signal(false);
  readonly generando = signal(false);
  readonly claveNueva = signal<string | null>(null);

  motivo = '';

  ngOnInit(): void { this.consultar(); }

  /**
   * La clave puede reponerse mientras la encomienda siga viva: es el caso
   * corriente del cliente que perdio su comprobante.
   */
  puedeReponerClave(e: Envio): boolean {
    return this.auth.tieneRol('OPERADOR', 'ALMACEN', 'ADMIN')
      && e.estadoActual !== 'ENTREGADO' && e.estadoActual !== 'ANULADO';
  }

  nuevaClave(e: Envio): void {
    this.generando.set(true);
    this.servicio.regenerarClave(e.codigoRastreo).subscribe({
      next: (r) => {
        this.generando.set(false);
        this.claveNueva.set(r.claveRecojo);
        this.avisos.exito('Se generó una clave nueva. La anterior dejó de ser válida.');
      },
      error: () => this.generando.set(false),
    });
  }

  /** Solo ventanilla y administracion pueden anular, y solo antes del despacho. */
  puedeAnular(e: Envio): boolean {
    return this.auth.tieneRol('OPERADOR', 'ADMIN') && ANULABLES.includes(e.estadoActual);
  }

  anular(): void {
    const actual = this.envio();
    if (!actual || this.motivo.trim().length < 5) return;

    this.anulando.set(true);
    this.servicio.anular(actual.codigoRastreo, this.motivo.trim()).subscribe({
      next: (e) => {
        this.envio.set(e);
        this.anulando.set(false);
        this.mostrarAnulacion.set(false);
        this.motivo = '';
        this.avisos.exito('La encomienda quedó anulada y el motivo se registró en su historial');
      },
      error: () => this.anulando.set(false),
    });
  }

  imprimir(): void {
    document.body.classList.add('imprimiendo-comprobante');
    window.print();
    document.body.classList.remove('imprimiendo-comprobante');
  }

  private consultar(): void {
    this.cargando.set(true);
    this.servicio.obtener(this.codigo()).subscribe({
      next: (e) => { this.envio.set(e); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }
}

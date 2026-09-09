import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CatalogoService } from '../../core/services/catalogo.service';
import { EnvioService } from '../../core/services/envio.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { Agencia, Comprobante, Tarifa } from '../../core/models/modelos';

/** Admision de encomiendas en ventanilla: cotizacion y registro. */
@Component({
  selector: 'app-ventanilla',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <h1>Ventanilla — admisión de encomienda</h1>
    <p class="texto-sec mt-0 mb-3">
      Registre al remitente, al destinatario y la carga. El sistema calcula la tarifa
      y genera el código de rastreo.
    </p>

    <div class="disposicion">

      <form [formGroup]="formulario" (ngSubmit)="registrar()" class="columna">

        <div class="card">
          <div class="card__titulo"><h3>1. Remitente</h3></div>
          <div class="rejilla rejilla--3" formGroupName="remitente">
            <div class="campo">
              <label>DNI</label>
              <input type="text" formControlName="dni" maxlength="8" placeholder="45871236" />
              @if (error('remitente.dni')) { <span class="campo__error">DNI de 8 dígitos</span> }
            </div>
            <div class="campo">
              <label>Nombres y apellidos</label>
              <input type="text" formControlName="nombres" placeholder="Jorge Ramos Peña" />
              @if (error('remitente.nombres')) { <span class="campo__error">Obligatorio</span> }
            </div>
            <div class="campo">
              <label>Teléfono</label>
              <input type="text" formControlName="telefono" maxlength="9" placeholder="987654321" />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__titulo"><h3>2. Destinatario</h3></div>
          <div class="rejilla rejilla--3" formGroupName="destinatario">
            <div class="campo">
              <label>DNI</label>
              <input type="text" formControlName="dni" maxlength="8" placeholder="70125489" />
              @if (error('destinatario.dni')) { <span class="campo__error">DNI de 8 dígitos</span> }
            </div>
            <div class="campo">
              <label>Nombres y apellidos</label>
              <input type="text" formControlName="nombres" placeholder="Luisa Quispe Mena" />
              @if (error('destinatario.nombres')) { <span class="campo__error">Obligatorio</span> }
            </div>
            <div class="campo">
              <label>Teléfono <span class="obligatorio">*</span></label>
              <input type="text" formControlName="telefono" maxlength="9" placeholder="964112233" />
              @if (error('destinatario.telefono')) {
                <span class="campo__error">Teléfono de 9 dígitos: es el número al que se avisará la llegada</span>
              } @else {
                <span class="campo__ayuda">A este número se avisará cuando la encomienda llegue</span>
              }
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__titulo"><h3>3. Recojo</h3></div>

          <div class="campo mb-2">
            <label>Clave de seguridad</label>
            <input type="text" formControlName="claveRecojo" maxlength="8" inputmode="numeric"
                   placeholder="Se genera sola si la deja en blanco" class="clave" />
            @if (error('claveRecojo')) {
              <span class="campo__error">Entre 4 y 8 dígitos</span>
            } @else {
              <span class="campo__ayuda">
                Se pedirá al momento del recojo, junto con el DNI. Si el cliente no dicta una,
                el sistema la genera y aparece en el comprobante.
              </span>
            }
          </div>

          <div formGroupName="autorizado">
            <div class="texto-xs texto-sec mb-1">
              PERSONA AUTORIZADA A RECOGER (opcional)
            </div>
            <div class="rejilla rejilla--3">
              <div class="campo">
                <label>DNI</label>
                <input type="text" formControlName="dni" maxlength="8" placeholder="44556677" />
                @if (error('autorizado.dni')) { <span class="campo__error">DNI de 8 dígitos</span> }
              </div>
              <div class="campo">
                <label>Nombres y apellidos</label>
                <input type="text" formControlName="nombres" placeholder="Marco Quispe" />
                @if (error('autorizado.nombres')) { <span class="campo__error">Indique el nombre</span> }
              </div>
              <div class="campo">
                <label>Teléfono</label>
                <input type="text" formControlName="telefono" maxlength="9" placeholder="955000111" />
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__titulo"><h3>4. Carga</h3></div>
          <div formGroupName="carga">
            <div class="campo mb-2">
              <label>Descripción del contenido</label>
              <input type="text" formControlName="descripcion" placeholder="Caja de repuestos" />
              @if (error('carga.descripcion')) { <span class="campo__error">Obligatorio</span> }
            </div>

            <div class="rejilla rejilla--4">
              <div class="campo">
                <label>Peso (kg)</label>
                <input type="number" step="0.1" min="0.1" formControlName="pesoKg" (input)="limpiarTarifa()" />
              </div>
              <div class="campo">
                <label>Largo (cm)</label>
                <input type="number" min="1" formControlName="largoCm" (input)="limpiarTarifa()" />
              </div>
              <div class="campo">
                <label>Ancho (cm)</label>
                <input type="number" min="1" formControlName="anchoCm" (input)="limpiarTarifa()" />
              </div>
              <div class="campo">
                <label>Alto (cm)</label>
                <input type="number" min="1" formControlName="altoCm" (input)="limpiarTarifa()" />
              </div>
            </div>

            <div class="campo campo--check mt-2">
              <input type="checkbox" id="fragil" formControlName="fragil" (change)="limpiarTarifa()" />
              <label for="fragil">Carga frágil (aplica recargo)</label>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__titulo"><h3>5. Ruta</h3></div>
          <div class="rejilla rejilla--2">
            <div class="campo">
              <label>Agencia de origen</label>
              <select formControlName="agenciaOrigenId" (change)="limpiarTarifa()">
                <option value="">Seleccione…</option>
                @for (a of agencias(); track a.codigo) {
                  <option [value]="a.codigo">{{ a.nombre }}</option>
                }
              </select>
            </div>
            <div class="campo">
              <label>Agencia de destino</label>
              <select formControlName="agenciaDestinoId" (change)="limpiarTarifa()">
                <option value="">Seleccione…</option>
                @for (a of agencias(); track a.codigo) {
                  <option [value]="a.codigo">{{ a.nombre }}</option>
                }
              </select>
            </div>
          </div>
          @if (mismaAgencia()) {
            <div class="aviso-inline mt-2">El origen y el destino no pueden ser la misma agencia.</div>
          }
        </div>
      </form>

      <aside class="columna columna--lateral">

        <div class="card resumen">
          <div class="card__titulo"><h3>Cotización</h3></div>

          @if (tarifa(); as t) {
            <div class="linea-precio">
              <span>Peso real</span><span>{{ pesoReal() }} kg</span>
            </div>
            <div class="linea-precio">
              <span>Peso volumétrico</span><span>{{ t.pesoVolumetrico }} kg</span>
            </div>
            <div class="linea-precio linea-precio--destacada">
              <span>Peso facturable</span><span>{{ t.pesoFacturable }} kg</span>
            </div>
            <div class="linea-precio"><span>Monto base</span><span>S/ {{ t.montoBase }}</span></div>
            @if (t.recargo > 0) {
              <div class="linea-precio"><span>Recargo por frágil</span><span>S/ {{ t.recargo }}</span></div>
            }
            <div class="total">
              <span>Total a cobrar</span>
              <strong>{{ t.total | currency: 'PEN':'S/ ':'1.2-2' }}</strong>
            </div>
          } @else {
            <p class="texto-sec texto-sm">
              Complete el peso, las dimensiones y la ruta, y pulse <strong>Cotizar</strong>
              para conocer el importe antes de registrar.
            </p>
          }

          <button type="button" class="btn btn--secundario btn--bloque mt-2"
                  (click)="cotizar()" [disabled]="!puedeCotizar() || cotizando()">
            {{ cotizando() ? 'Calculando…' : 'Cotizar' }}
          </button>

          @if (comprobante()) {
            <div class="registrada mt-2">
              ✓ Esta encomienda ya fue registrada. Pulse <strong>Nueva encomienda</strong>
              para atender al siguiente cliente.
            </div>
          } @else {
            <button type="button" class="btn btn--primario btn--bloque mt-1"
                    (click)="registrar()" [disabled]="formulario.invalid || mismaAgencia() || guardando()">
              {{ guardando() ? 'Registrando…' : 'Registrar encomienda' }}
            </button>
          }
        </div>

        @if (comprobante(); as c) {
          <div class="card comprobante">
            <div class="comprobante__marca">ROGGER EXPRESS</div>
            <div class="comprobante__titulo">Comprobante de admisión</div>
            <div class="comprobante__codigo mono">{{ c.envio.codigoRastreo }}</div>

            <div class="claves">
              <div class="clave-caja">
                <div class="clave-caja__rotulo">Código de consulta</div>
                <div class="clave-caja__valor">{{ c.codigoVerificacion }}</div>
              </div>
              <div class="clave-caja clave-caja--seguridad">
                <div class="clave-caja__rotulo">Clave de seguridad</div>
                <div class="clave-caja__valor">{{ c.claveRecojo }}</div>
              </div>
            </div>
            <p class="claves__nota">
              El código de consulta sirve para rastrear la encomienda; la clave de seguridad
              se pedirá al recogerla. <strong>La clave no vuelve a mostrarse.</strong>
            </p>

            <div class="comprobante__fila"><span>Remitente</span><span>{{ c.envio.remitente.nombres }}</span></div>
            <div class="comprobante__fila"><span>Destinatario</span><span>{{ c.envio.destinatario.nombres }}</span></div>
            @if (c.envio.autorizados?.length) {
              <div class="comprobante__fila">
                <span>Autorizado</span><span>{{ c.envio.autorizados![0].nombres }}</span>
              </div>
            }
            <div class="comprobante__fila"><span>Contenido</span><span>{{ c.envio.carga.descripcion }}</span></div>
            <div class="comprobante__fila"><span>Ruta</span><span>{{ c.envio.agenciaOrigenId }} → {{ c.envio.agenciaDestinoId }}</span></div>
            <div class="comprobante__fila"><span>Peso facturable</span><span>{{ c.envio.tarifa.pesoFacturable }} kg</span></div>
            <div class="comprobante__total">
              <span>Total</span><strong>{{ c.envio.tarifa.total | currency: 'PEN':'S/ ':'1.2-2' }}</strong>
            </div>

            <p class="comprobante__pie">
              Consulte el estado en el portal público con el número y el código de consulta.
            </p>

            <div class="fila mt-2">
              <button class="btn btn--suave btn--sm" (click)="imprimir()">Imprimir</button>
              <a class="btn btn--suave btn--sm" [routerLink]="['/panel/envios', c.envio.codigoRastreo]">Ver detalle</a>
              <button class="btn btn--contorno btn--sm" (click)="nuevo()">Nueva encomienda</button>
            </div>
          </div>
        }
      </aside>
    </div>
  `,
  styles: [`
    .clave { font-family: 'Consolas', monospace; letter-spacing: .1em; max-width: 220px; }

    .claves { display: flex; gap: .6rem; margin: .9rem 0 .4rem; }
    .clave-caja {
      flex: 1; border: 1px dashed var(--navy-600); border-radius: 10px;
      padding: .5rem .4rem; text-align: center; background: var(--navy-50);
    }
    .clave-caja--seguridad { border-color: var(--naranja-500); background: var(--naranja-100); }
    .clave-caja__rotulo {
      font-size: .62rem; text-transform: uppercase; letter-spacing: .05em;
      color: var(--texto-sec); font-weight: 700;
    }
    .clave-caja__valor {
      font-family: 'Consolas', monospace; font-size: 1.3rem; font-weight: 800;
      letter-spacing: .12em; color: var(--navy-700);
    }
    .clave-caja--seguridad .clave-caja__valor { color: var(--naranja-600); }
    .claves__nota { font-size: .72rem; color: var(--texto-sec); line-height: 1.45; margin: 0 0 .6rem; }

    .disposicion { display: grid; grid-template-columns: 1fr 340px; gap: 1.2rem; align-items: start; }
    .columna { display: flex; flex-direction: column; gap: 1.2rem; }
    .columna--lateral { position: sticky; top: 5rem; }

    .aviso-inline {
      background: var(--rojo-100); color: var(--rojo-600);
      padding: .5rem .75rem; border-radius: 8px; font-size: .85rem;
    }

    .linea-precio {
      display: flex; justify-content: space-between; padding: .35rem 0;
      font-size: .9rem; border-bottom: 1px dashed var(--borde);
    }
    .linea-precio--destacada { font-weight: 700; color: var(--navy-700); }
    .total {
      display: flex; justify-content: space-between; align-items: baseline;
      margin-top: .9rem; padding-top: .9rem; border-top: 2px solid var(--navy-700);
    }
    .total strong { font-size: 1.5rem; color: var(--naranja-600); }

    .registrada {
      background: var(--verde-100); color: var(--verde-600);
      border-radius: 8px; padding: .6rem .8rem; font-size: .84rem;
    }
    .comprobante { border-top: 4px solid var(--naranja-500); }
    .comprobante__marca { font-weight: 800; letter-spacing: .08em; font-size: .8rem; color: var(--navy-700); }
    .comprobante__titulo { font-size: .78rem; color: var(--texto-sec); margin-bottom: .6rem; }
    .comprobante__codigo {
      font-size: 1.3rem; font-weight: 800; text-align: center;
      background: var(--navy-50); border-radius: 8px; padding: .5rem; margin-bottom: .8rem;
    }
    .comprobante__fila {
      display: flex; justify-content: space-between; gap: 1rem;
      font-size: .84rem; padding: .25rem 0;
      span:first-child { color: var(--texto-sec); }
      span:last-child { text-align: right; font-weight: 600; }
    }
    .comprobante__total {
      display: flex; justify-content: space-between; margin-top: .6rem;
      padding-top: .6rem; border-top: 1px solid var(--borde);
      strong { color: var(--naranja-600); font-size: 1.15rem; }
    }
    .comprobante__pie { font-size: .76rem; color: var(--texto-sec); margin-top: .8rem; }

    @media (max-width: 1100px) {
      .disposicion { grid-template-columns: 1fr; }
      .columna--lateral { position: static; }
    }
    @media print {
      .card:not(.comprobante), form, .btn { display: none !important; }
    }
  `],
})
export class VentanillaComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly servicio = inject(EnvioService);
  private readonly catalogo = inject(CatalogoService);
  private readonly avisos = inject(NotificacionService);

  readonly agencias = signal<Agencia[]>([]);
  readonly tarifa = signal<Tarifa | null>(null);
  readonly comprobante = signal<Comprobante | null>(null);
  readonly cotizando = signal(false);
  readonly guardando = signal(false);

  readonly formulario = this.fb.nonNullable.group({
    remitente: this.fb.nonNullable.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      nombres: ['', Validators.required],
      telefono: ['', Validators.pattern(/^\d{9}$/)],
    }),
    destinatario: this.fb.nonNullable.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      nombres: ['', Validators.required],
      // Obligatorio: sin este numero el sistema no puede avisar la llegada y la
      // encomienda se quedaria en el almacen sin que el cliente lo sepa.
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    }),
    carga: this.fb.nonNullable.group({
      descripcion: ['', Validators.required],
      pesoKg: [1, [Validators.required, Validators.min(0.1)]],
      largoCm: [30, [Validators.required, Validators.min(1)]],
      anchoCm: [20, [Validators.required, Validators.min(1)]],
      altoCm: [15, [Validators.required, Validators.min(1)]],
      fragil: [false],
    }),
    // Si se deja en blanco, el sistema genera la clave y la muestra en el comprobante.
    claveRecojo: ['', Validators.pattern(/^$|^\d{4,8}$/)],
    // Persona adicional que puede recoger. Los dos campos van juntos: o se
    // llenan ambos o ninguno.
    autorizado: this.fb.nonNullable.group({
      dni: ['', Validators.pattern(/^$|^\d{8}$/)],
      nombres: [''],
      telefono: ['', Validators.pattern(/^$|^\d{9}$/)],
    }),
    agenciaOrigenId: ['', Validators.required],
    agenciaDestinoId: ['', Validators.required],
  });

  readonly pesoReal = computed(() => this.formulario.getRawValue().carga.pesoKg);

  ngOnInit(): void {
    this.catalogo.agencias().subscribe({ next: (a) => this.agencias.set(a) });
  }

  error(ruta: string): boolean {
    const control = this.formulario.get(ruta);
    return !!control && control.invalid && control.touched;
  }

  mismaAgencia(): boolean {
    const v = this.formulario.getRawValue();
    return !!v.agenciaOrigenId && v.agenciaOrigenId === v.agenciaDestinoId;
  }

  puedeCotizar(): boolean {
    const carga = this.formulario.get('carga');
    return !!carga && carga.valid && !this.mismaAgencia();
  }

  limpiarTarifa(): void { this.tarifa.set(null); }

  private ruta(): string {
    const v = this.formulario.getRawValue();
    const origen = this.agencias().find((a) => a.codigo === v.agenciaOrigenId);
    const destino = this.agencias().find((a) => a.codigo === v.agenciaDestinoId);
    return origen && destino ? `${origen.ciudad}-${destino.ciudad}` : 'Lima-Huancayo';
  }

  cotizar(): void {
    this.cotizando.set(true);
    this.servicio.cotizar(this.formulario.getRawValue().carga, this.ruta()).subscribe({
      next: (t) => { this.tarifa.set(t); this.cotizando.set(false); },
      error: () => this.cotizando.set(false),
    });
  }

  registrar(): void {
    if (this.formulario.invalid || this.mismaAgencia()) {
      this.formulario.markAllAsTouched();
      return;
    }

    const v = this.formulario.getRawValue();

    // La persona autorizada viaja como una lista: el back-end admite hasta dos.
    const autorizados = v.autorizado.dni && v.autorizado.nombres ? [v.autorizado] : [];

    this.guardando.set(true);
    this.servicio.registrar({
      remitente: v.remitente,
      destinatario: v.destinatario,
      autorizados,
      carga: v.carga,
      claveRecojo: v.claveRecojo,
      agenciaOrigenId: v.agenciaOrigenId,
      agenciaDestinoId: v.agenciaDestinoId,
    }).subscribe({
      next: (comprobante) => {
        this.guardando.set(false);
        this.comprobante.set(comprobante);
        this.tarifa.set(comprobante.envio.tarifa);
        this.avisos.exito(`Encomienda registrada: ${comprobante.envio.codigoRastreo}`);
      },
      error: () => this.guardando.set(false),
    });
  }

  nuevo(): void {
    this.formulario.reset({
      carga: { pesoKg: 1, largoCm: 30, anchoCm: 20, altoCm: 15, fragil: false, descripcion: '' },
    });
    this.tarifa.set(null);
    this.comprobante.set(null);
  }

  imprimir(): void {
    // La clase permite que la hoja de estilos global deje solo el comprobante
    // en la impresion (el menú y la cabecera viven en otro componente).
    document.body.classList.add('imprimiendo-comprobante');
    window.print();
    document.body.classList.remove('imprimiendo-comprobante');
  }
}

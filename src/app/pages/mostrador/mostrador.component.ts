import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EnvioService } from '../../core/services/envio.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { AuthService } from '../../core/services/auth.service';
import { Envio } from '../../core/models/modelos';

/**
 * Mostrador de recojo.
 *
 * Reproduce el orden real de la agencia: el cliente llega y presenta su DNI —no
 * un código—, el sistema muestra lo que puede retirar, se le pide la clave de
 * seguridad y recién entonces la encomienda queda entregada.
 */
@Component({
  selector: 'app-mostrador',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="fila fila--entre mb-2">
      <div>
        <h1>Mostrador de recojo</h1>
        <p class="texto-sec mt-0">
          Pida el DNI del cliente y búsquelo aquí. Verá todo lo que puede retirar en
          <span class="mono">{{ auth.agencia() }}</span>.
        </p>
      </div>
    </div>

    <div class="card">
      <form class="busqueda" (ngSubmit)="buscar()">
        <div class="campo">
          <label>DNI de quien recoge <span class="obligatorio">*</span></label>
          <input type="text" name="dni" [(ngModel)]="dni" maxlength="8" inputmode="numeric"
                 placeholder="70125489" autocomplete="off" class="dni" />
          <span class="campo__ayuda">Puede ser el destinatario o una persona autorizada</span>
        </div>
        <button class="btn btn--primario" type="submit" [disabled]="buscando()">
          {{ buscando() ? 'Buscando…' : 'Buscar encomiendas' }}
        </button>
      </form>
    </div>

    @if (buscado() && lista().length === 0) {
      <div class="card vacio">
        <div class="vacio__titulo">No hay nada pendiente para ese documento</div>
        <p class="texto-sec">
          Puede que la encomienda todavía no haya llegado, que ya se haya entregado o que
          corresponda a otra agencia. Consulte el módulo
          <a routerLink="/panel/envios">Encomiendas</a> para revisar su estado.
        </p>
      </div>
    }

    @if (lista().length > 0) {
      <div class="card">
        <div class="card__titulo">
          <h3>{{ lista().length }} encomienda(s) para este documento</h3>
        </div>

        @for (e of lista(); track e.codigoRastreo) {
          <div class="item" [class.item--activa]="elegida()?.codigoRastreo === e.codigoRastreo">
            <div class="item__datos">
              <div class="mono negrita">{{ e.codigoRastreo }}</div>
              <div>{{ e.carga.descripcion }}</div>
              <div class="texto-xs texto-sec">
                Para {{ e.destinatario.nombres }} ·
                {{ esTitular(e) ? 'titular' : 'persona autorizada' }} ·
                {{ e.carga.pesoKg }} kg
              </div>
            </div>
            <button class="btn btn--suave btn--sm" (click)="elegir(e)">
              {{ elegida()?.codigoRastreo === e.codigoRastreo ? 'Seleccionada' : 'Entregar esta' }}
            </button>
          </div>
        }
      </div>
    }

    @if (elegida(); as e) {
      <div class="card entrega">
        <div class="card__titulo"><h3>Entregar {{ e.codigoRastreo }}</h3></div>

        <div class="rejilla rejilla--2">
          <div class="campo">
            <label>Nombre de quien recoge <span class="obligatorio">*</span></label>
            <input type="text" [(ngModel)]="receptorNombres" name="receptorNombres" />
          </div>
          <div class="campo">
            <label>DNI presentado</label>
            <input type="text" [ngModel]="dni" name="dniMostrado" disabled class="dni" />
          </div>
        </div>

        @if (!sinClave()) {
          <div class="campo mt-1">
            <label>Clave de seguridad <span class="obligatorio">*</span></label>
            <input type="text" [(ngModel)]="clave" name="clave" maxlength="8" inputmode="numeric"
                   placeholder="6 dígitos" class="clave" autocomplete="off" />
            <span class="campo__ayuda">La que le entregó quien hizo el envío</span>
          </div>
          <button class="enlace" type="button" (click)="sinClave.set(true)">
            El cliente no tiene la clave
          </button>
        } @else {
          <div class="alerta mt-1">
            <strong>Entrega sin clave de seguridad.</strong>
            Verifique el DNI físico contra los datos del sistema. El motivo queda registrado
            en el historial de la encomienda.
          </div>
          <div class="campo">
            <label>Motivo <span class="obligatorio">*</span></label>
            <input type="text" [(ngModel)]="motivo" name="motivo"
                   placeholder="Ej.: el cliente no recuerda la clave, se verificó su DNI físico" />
          </div>
          <button class="enlace" type="button" (click)="sinClave.set(false)">
            Volver a pedir la clave
          </button>
        }

        <div class="fila mt-2">
          <button class="btn btn--primario" (click)="confirmar()" [disabled]="!puedeEntregar() || guardando()">
            {{ guardando() ? 'Registrando…' : 'Confirmar entrega' }}
          </button>
          <button class="btn btn--contorno" (click)="elegida.set(null)">Cancelar</button>
        </div>
      </div>
    }

    @if (entregada(); as e) {
      <div class="card exito">
        <div class="exito__titulo">✓ Entrega registrada</div>
        <p>
          <span class="mono negrita">{{ e.codigoRastreo }}</span> quedó como entregada a
          <strong>{{ e.entrega?.receptorNombres }}</strong>
          @if (e.entrega?.claveVerificada) {
            con su clave de seguridad verificada.
          } @else {
            solo con verificación de identidad; el motivo quedó en el historial.
          }
        </p>
        <a class="btn btn--suave btn--sm" [routerLink]="['/panel/envios', e.codigoRastreo]">
          Ver la ficha
        </a>
      </div>
    }
  `,
  styles: [`
    .busqueda { display: flex; gap: 1rem; align-items: flex-start; }
    .busqueda .campo { flex: 0 0 280px; }
    .busqueda .btn { margin-top: 1.35rem; }
    .dni, .clave { font-family: 'Consolas', monospace; letter-spacing: .08em; }
    .clave { font-size: 1.1rem; max-width: 200px; }

    .item {
      display: flex; align-items: center; justify-content: space-between; gap: 1rem;
      padding: .8rem .2rem; border-bottom: 1px solid var(--borde);
    }
    .item:last-child { border-bottom: none; }
    .item--activa { background: var(--navy-50); border-radius: 8px; padding-left: .7rem; padding-right: .7rem; }
    .item__datos > div { line-height: 1.35; }

    .entrega { border-left: 4px solid var(--navy-600); }
    .exito { border-left: 4px solid var(--verde-600); }
    .exito__titulo { color: var(--verde-600); font-weight: 700; margin-bottom: .3rem; }

    .alerta {
      background: var(--naranja-100); border: 1px solid #f0d3bb; color: #7a4a1d;
      border-radius: var(--radio); padding: .75rem 1rem; font-size: .88rem;
      line-height: 1.5; margin-bottom: .8rem;
    }
    .enlace { background: none; border: none; color: var(--navy-600); cursor: pointer;
              font: inherit; font-size: .85rem; padding: .4rem 0; text-decoration: underline; }

    .vacio { text-align: center; padding: 2rem 1rem; }
    .vacio__titulo { font-weight: 600; margin-bottom: .3rem; }
  `],
})
export class MostradorComponent implements OnInit {

  private readonly servicio = inject(EnvioService);
  private readonly ruta = inject(ActivatedRoute);
  private readonly avisos = inject(NotificacionService);
  readonly auth = inject(AuthService);

  dni = '';
  receptorNombres = '';
  clave = '';
  motivo = '';

  readonly lista = signal<Envio[]>([]);
  readonly elegida = signal<Envio | null>(null);
  readonly entregada = signal<Envio | null>(null);
  readonly buscando = signal(false);
  readonly buscado = signal(false);
  readonly guardando = signal(false);
  readonly sinClave = signal(false);

  /**
   * Permite llegar con el documento ya puesto en la direccion
   * (?dni=44556677): util para enlazar un caso concreto o mostrarlo.
   */
  ngOnInit(): void {
    const dni = this.ruta.snapshot.queryParamMap.get('dni');
    if (dni) {
      this.dni = dni;
      this.buscar();
    }
  }

  buscar(): void {
    const dni = this.dni.trim();
    if (!/^\d{8}$/.test(dni)) {
      this.avisos.error('Ingrese un DNI de 8 dígitos.');
      return;
    }

    this.buscando.set(true);
    this.elegida.set(null);
    this.entregada.set(null);

    this.servicio.paraEntrega(dni).subscribe({
      next: (envios) => {
        this.lista.set(envios);
        this.buscado.set(true);
        this.buscando.set(false);
        if (envios.length === 1) {
          this.elegir(envios[0]);
        }
      },
      error: () => { this.buscando.set(false); this.buscado.set(true); this.lista.set([]); },
    });
  }

  elegir(envio: Envio): void {
    this.elegida.set(envio);
    this.entregada.set(null);
    this.sinClave.set(false);
    this.clave = '';
    this.motivo = '';
    this.receptorNombres = this.nombreDe(envio);
  }

  esTitular(envio: Envio): boolean {
    return envio.destinatario.dni === this.dni.trim();
  }

  /** Nombre de quien recoge según el documento presentado. */
  private nombreDe(envio: Envio): string {
    if (this.esTitular(envio)) {
      return envio.destinatario.nombres;
    }
    const autorizado = (envio.autorizados ?? []).find((a) => a.dni === this.dni.trim());
    return autorizado?.nombres ?? '';
  }

  puedeEntregar(): boolean {
    if (!this.receptorNombres.trim()) return false;
    return this.sinClave()
      ? this.motivo.trim().length >= 5
      : this.clave.trim().length >= 4;
  }

  confirmar(): void {
    const envio = this.elegida();
    if (!envio || !this.puedeEntregar()) return;

    this.guardando.set(true);

    this.servicio.registrarEntrega(envio.codigoRastreo, {
      receptorNombres: this.receptorNombres.trim(),
      receptorDni: this.dni.trim(),
      parentesco: this.esTitular(envio) ? 'Titular' : 'Autorizado',
      claveRecojo: this.sinClave() ? undefined : this.clave.trim(),
      omitirClave: this.sinClave(),
      motivoSinClave: this.sinClave() ? this.motivo.trim() : undefined,
    }).subscribe({
      next: (actualizado) => {
        this.guardando.set(false);
        this.entregada.set(actualizado);
        this.elegida.set(null);
        this.lista.update((l) => l.filter((e) => e.codigoRastreo !== actualizado.codigoRastreo));
        this.avisos.exito(`Entrega registrada: ${actualizado.codigoRastreo}`);
      },
      error: () => this.guardando.set(false),
    });
  }
}

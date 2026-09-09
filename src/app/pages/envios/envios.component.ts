import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CatalogoService } from '../../core/services/catalogo.service';
import { EnvioService } from '../../core/services/envio.service';
import { Agencia, Envio, EstadoEnvio, FiltroEnvios, ORDEN_ESTADOS, ESTADOS } from '../../core/models/modelos';
import { EstadoBadgeComponent } from '../../shared/estado-badge.component';

/** Listado de encomiendas con filtros combinables y paginacion. */
@Component({
  selector: 'app-envios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, EstadoBadgeComponent],
  template: `
    <h1>Encomiendas</h1>
    <p class="texto-sec mt-0 mb-3">Busque por código, documento del cliente, estado, agencia o fecha.</p>

    <div class="card mb-2">
      <div class="filtros">
        <div class="campo">
          <label>Búsqueda</label>
          <input type="text" [(ngModel)]="filtro.texto" placeholder="Código o DNI"
                 (keyup.enter)="aplicar()" />
        </div>
        <div class="campo">
          <label>Estado</label>
          <select [(ngModel)]="filtro.estado">
            <option value="">Todos</option>
            @for (e of estados; track e) { <option [value]="e">{{ etiqueta(e) }}</option> }
          </select>
        </div>
        <div class="campo">
          <label>Agencia destino</label>
          <select [(ngModel)]="filtro.agenciaDestinoId">
            <option value="">Todas</option>
            @for (a of agencias(); track a.codigo) { <option [value]="a.codigo">{{ a.nombre }}</option> }
          </select>
        </div>
        <div class="campo">
          <label>Desde</label>
          <input type="date" [(ngModel)]="filtro.desde" />
        </div>
        <div class="campo">
          <label>Hasta</label>
          <input type="date" [(ngModel)]="filtro.hasta" />
        </div>
        <div class="acciones">
          <button class="btn btn--secundario" (click)="aplicar()">Buscar</button>
          <button class="btn btn--contorno" (click)="limpiar()">Limpiar</button>
        </div>
      </div>
    </div>

    <div class="tabla-contenedor">
      <table class="tabla">
        <thead>
          <tr>
            <th>Código</th><th>Remitente</th><th>Destinatario</th>
            <th>Ruta</th><th>Estado</th><th>Fecha</th><th class="centrado">Total</th>
          </tr>
        </thead>
        <tbody>
          @if (cargando()) {
            <tr><td colspan="7" class="tabla__vacia">Cargando…</td></tr>
          } @else {
            @for (e of envios(); track e.codigoRastreo) {
              <tr>
                <td><a class="mono negrita" [routerLink]="['/panel/envios', e.codigoRastreo]">{{ e.codigoRastreo }}</a></td>
                <td>
                  <div>{{ e.remitente.nombres }}</div>
                  <div class="texto-xs texto-sec mono">{{ e.remitente.dni }}</div>
                </td>
                <td>
                  <div>{{ e.destinatario.nombres }}</div>
                  <div class="texto-xs texto-sec mono">{{ e.destinatario.dni }}</div>
                </td>
                <td class="texto-sm mono">{{ e.agenciaOrigenId }} → {{ e.agenciaDestinoId }}</td>
                <td><app-estado-badge [estado]="e.estadoActual" /></td>
                <td class="texto-sm">{{ e.fechaRegistro | date: 'dd/MM/yy HH:mm' }}</td>
                <td class="centrado negrita">{{ e.tarifa.total | currency: 'PEN':'S/ ':'1.2-2' }}</td>
              </tr>
            } @empty {
              <tr><td colspan="7" class="tabla__vacia">No se encontraron encomiendas con esos filtros.</td></tr>
            }
          }
        </tbody>
      </table>
    </div>

    @if (totalPaginas() > 1) {
      <div class="paginacion">
        <button class="btn btn--contorno btn--sm" (click)="irA(pagina() - 1)" [disabled]="pagina() === 0">
          ← Anterior
        </button>
        <span class="texto-sm">
          Página {{ pagina() + 1 }} de {{ totalPaginas() }} · {{ total() }} encomiendas
        </span>
        <button class="btn btn--contorno btn--sm" (click)="irA(pagina() + 1)"
                [disabled]="pagina() + 1 >= totalPaginas()">
          Siguiente →
        </button>
      </div>
    }
  `,
  styles: [`
    .filtros { display: grid; grid-template-columns: 1.4fr 1fr 1.2fr .9fr .9fr auto; gap: .8rem; align-items: end; }
    .acciones { display: flex; gap: .5rem; }
    .paginacion { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1rem; }
    @media (max-width: 1100px) { .filtros { grid-template-columns: 1fr 1fr; } }
  `],
})
export class EnviosComponent implements OnInit {

  private readonly servicio = inject(EnvioService);
  private readonly catalogo = inject(CatalogoService);

  readonly envios = signal<Envio[]>([]);
  readonly agencias = signal<Agencia[]>([]);
  readonly cargando = signal(true);
  readonly pagina = signal(0);
  readonly totalPaginas = signal(0);
  readonly total = signal(0);

  readonly estados = ORDEN_ESTADOS.concat(['INCIDENCIA', 'DEVUELTO'] as EstadoEnvio[]);

  filtro: FiltroEnvios = { texto: '', estado: '', agenciaDestinoId: '', desde: '', hasta: '' };

  ngOnInit(): void {
    this.catalogo.agencias().subscribe({ next: (a) => this.agencias.set(a) });
    this.consultar();
  }

  etiqueta(estado: EstadoEnvio): string { return ESTADOS[estado]?.etiqueta ?? estado; }

  aplicar(): void { this.pagina.set(0); this.consultar(); }

  limpiar(): void {
    this.filtro = { texto: '', estado: '', agenciaDestinoId: '', desde: '', hasta: '' };
    this.aplicar();
  }

  irA(pagina: number): void { this.pagina.set(pagina); this.consultar(); }

  private consultar(): void {
    this.cargando.set(true);
    this.servicio.buscar({ ...this.filtro, pagina: this.pagina(), tamanio: 10 }).subscribe({
      next: (p) => {
        this.envios.set(p.contenido);
        this.totalPaginas.set(p.totalPaginas);
        this.total.set(p.totalElementos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }
}

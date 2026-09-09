import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ESTADOS, EventoSeguimiento } from '../core/models/modelos';

/** Historial de estados de una encomienda en formato de linea de tiempo. */
@Component({
  selector: 'app-linea-tiempo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ol class="linea">
      @for (evento of eventos; track $index; let ultimo = $last) {
        <li class="linea__item" [class.linea__item--ultimo]="ultimo">
          <span class="linea__punto" [class]="'linea__punto--' + color(evento)"></span>
          <div>
            <div class="linea__titulo">{{ etiqueta(evento) }}</div>
            <div class="linea__meta">
              {{ evento.fecha | date: 'dd/MM/yyyy HH:mm' }}
              @if (evento.agenciaId) { · {{ evento.agenciaId }} }
              @if (evento.usuario) { · {{ evento.usuario }} }
            </div>
            @if (evento.observacion) {
              <div class="linea__obs">{{ evento.observacion }}</div>
            }
          </div>
        </li>
      }
    </ol>
  `,
  styles: [`
    .linea { list-style: none; margin: 0; padding: 0; }
    .linea__item { position: relative; display: flex; gap: .9rem; padding: 0 0 1.15rem 0; }
    .linea__item::before {
      content: ''; position: absolute; left: 6px; top: 18px; bottom: 0;
      width: 2px; background: var(--borde);
    }
    .linea__item--ultimo::before { display: none; }
    .linea__punto {
      flex: 0 0 14px; height: 14px; margin-top: 3px; border-radius: 50%;
      background: var(--navy-600); box-shadow: 0 0 0 3px #fff;
      position: relative; z-index: 1;
    }
    .linea__punto--verde   { background: var(--verde-600); }
    .linea__punto--naranja { background: var(--naranja-500); }
    .linea__punto--rojo    { background: var(--rojo-600); }
    .linea__punto--morado  { background: var(--morado-600); }
    .linea__punto--gris    { background: var(--gris-600); }
    .linea__titulo { font-weight: 700; font-size: .92rem; }
    .linea__meta   { font-size: .8rem; color: var(--texto-sec); }
    .linea__obs    { font-size: .84rem; margin-top: .15rem; }
  `],
})
export class LineaTiempoComponent {
  @Input({ required: true }) eventos: EventoSeguimiento[] = [];

  etiqueta(e: EventoSeguimiento): string { return ESTADOS[e.estado]?.etiqueta ?? e.estado; }
  color(e: EventoSeguimiento): string { return ESTADOS[e.estado]?.color ?? 'gris'; }
}

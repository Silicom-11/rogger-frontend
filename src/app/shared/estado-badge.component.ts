import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ESTADOS, EstadoEnvio } from '../core/models/modelos';

/** Insignia de color con la etiqueta legible del estado de una encomienda. */
@Component({
  selector: 'app-estado-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="badge" [class]="'badge--' + color">{{ etiqueta }}</span>`,
})
export class EstadoBadgeComponent {
  @Input({ required: true }) estado!: EstadoEnvio;

  get etiqueta(): string { return ESTADOS[this.estado]?.etiqueta ?? this.estado; }
  get color(): string { return ESTADOS[this.estado]?.color ?? 'gris'; }
}

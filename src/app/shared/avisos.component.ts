import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificacionService } from '../core/services/notificacion.service';

/** Avisos emergentes en la esquina inferior derecha. */
@Component({
  selector: 'app-avisos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="avisos">
      @for (aviso of servicio.avisos(); track aviso.id) {
        <div class="aviso" [class]="'aviso--' + aviso.tipo" (click)="servicio.cerrar(aviso.id)">
          <span class="aviso__icono">
            {{ aviso.tipo === 'exito' ? '✓' : aviso.tipo === 'error' ? '!' : 'i' }}
          </span>
          <span>{{ aviso.mensaje }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .avisos {
      position: fixed; right: 1.2rem; bottom: 1.2rem; z-index: 1000;
      display: flex; flex-direction: column; gap: .6rem; max-width: 380px;
    }
    .aviso {
      display: flex; align-items: flex-start; gap: .6rem;
      padding: .8rem 1rem; border-radius: 10px; cursor: pointer;
      background: #fff; border: 1px solid var(--borde);
      box-shadow: 0 8px 28px rgba(15,34,68,.16);
      font-size: .9rem; animation: entra .18s ease-out;
    }
    .aviso__icono {
      display: grid; place-items: center; flex: 0 0 22px; height: 22px;
      border-radius: 50%; font-weight: 700; font-size: .8rem; color: #fff;
    }
    .aviso--exito { border-left: 4px solid var(--verde-600); }
    .aviso--exito .aviso__icono { background: var(--verde-600); }
    .aviso--error { border-left: 4px solid var(--rojo-600); }
    .aviso--error .aviso__icono { background: var(--rojo-600); }
    .aviso--info  { border-left: 4px solid var(--navy-600); }
    .aviso--info  .aviso__icono { background: var(--navy-600); }
    @keyframes entra { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  `],
})
export class AvisosComponent {
  readonly servicio = inject(NotificacionService);
}

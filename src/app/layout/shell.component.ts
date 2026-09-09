import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

interface ItemMenu {
  ruta: string;
  etiqueta: string;
  icono: string;
  roles?: string[];
}

interface GrupoMenu {
  titulo: string;
  items: ItemMenu[];
}

/**
 * Marco de la aplicacion: barra lateral, cabecera y area de contenido.
 *
 * El menu se agrupa por el momento del trabajo —admision, entrega,
 * administracion— en lugar de listar modulos sueltos: asi el trabajador
 * encuentra lo que busca por lo que esta haciendo, no por como se llama la
 * pantalla.
 */
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="marco" [class.marco--compacto]="compacto()">

      <aside class="lateral">
        <div class="marca">
          <div class="marca__logo">RE</div>
          @if (!compacto()) {
            <div>
              <div class="marca__nombre">Rogger Express</div>
              <div class="marca__sub">Gestión de encomiendas</div>
            </div>
          }
        </div>

        <nav class="menu">
          @for (grupo of gruposVisibles(); track grupo.titulo) {
            @if (!compacto()) {
              <div class="menu__grupo">{{ grupo.titulo }}</div>
            }
            @for (item of grupo.items; track item.ruta) {
              <a class="menu__item" [routerLink]="item.ruta" routerLinkActive="menu__item--activo"
                 [title]="item.etiqueta">
                <span class="menu__icono">{{ item.icono }}</span>
                @if (!compacto()) { <span>{{ item.etiqueta }}</span> }
              </a>
            }
          }
        </nav>

        <a class="menu__item menu__item--externo" routerLink="/rastrear" target="_blank"
           title="Abrir el portal que ve el cliente">
          <span class="menu__icono">◎</span>
          @if (!compacto()) { <span>Ver como cliente</span> }
        </a>
      </aside>

      <div class="principal">
        <header class="cabecera">
          <button class="icono-btn" (click)="compacto.set(!compacto())" title="Contraer menú">☰</button>

          <div class="cabecera__espacio"></div>

          <div class="usuario">
            <div class="usuario__datos">
              <div class="usuario__nombre">{{ auth.usuario()?.nombreCompleto }}</div>
              <div class="usuario__rol">{{ descripcionRol() }} · {{ auth.usuario()?.agenciaId }}</div>
            </div>
            <div class="usuario__avatar">{{ iniciales() }}</div>
            <a class="btn btn--contorno btn--sm" routerLink="/panel/cambiar-clave"
               title="Cambiar mi contraseña">Contraseña</a>
            <button class="btn btn--contorno btn--sm" (click)="auth.logout()">Salir</button>
          </div>
        </header>

        @if (auth.debeCambiarClave()) {
          <div class="banda-clave">
            Por seguridad debe definir una contraseña propia antes de usar el sistema.
            <a routerLink="/panel/cambiar-clave">Cambiarla ahora →</a>
          </div>
        }

        <main class="contenido">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .marco { display: grid; grid-template-columns: 250px 1fr; min-height: 100vh; }
    .marco--compacto { grid-template-columns: 74px 1fr; }

    .lateral {
      background: var(--navy-900); color: #fff;
      display: flex; flex-direction: column; padding: 1rem .7rem;
      position: sticky; top: 0; height: 100vh;
    }
    .marca { display: flex; align-items: center; gap: .7rem; padding: .4rem .5rem 1.2rem; }
    .marca__logo {
      flex: 0 0 40px; height: 40px; border-radius: 10px;
      background: var(--naranja-500); color: #fff;
      display: grid; place-items: center; font-weight: 800; letter-spacing: .04em;
    }
    .marca__nombre { font-weight: 700; font-size: .98rem; }
    .marca__sub { font-size: .72rem; color: #9db0cd; }

    .menu { display: flex; flex-direction: column; gap: .15rem; flex: 1; }
    .menu__grupo {
      font-size: .68rem; text-transform: uppercase; letter-spacing: .08em;
      color: #7d90ac; font-weight: 700; padding: .9rem .8rem .35rem;
    }
    .menu__item {
      display: flex; align-items: center; gap: .75rem;
      padding: .58rem .75rem; border-radius: 9px;
      color: #c9d6ea; font-size: .92rem; font-weight: 500; text-decoration: none;
      transition: background .15s ease, color .15s ease;
    }
    .menu__item:hover { background: rgba(255,255,255,.07); color: #fff; text-decoration: none; }
    .menu__item--activo { background: var(--navy-600); color: #fff; font-weight: 600; }
    .menu__icono { width: 20px; text-align: center; font-size: 1rem; }
    .menu__item--externo { margin-top: auto; border-top: 1px solid rgba(255,255,255,.1);
                           border-radius: 0; padding-top: .9rem; }

    .principal { display: flex; flex-direction: column; min-width: 0; }
    .cabecera {
      display: flex; align-items: center; gap: 1rem;
      background: #fff; border-bottom: 1px solid var(--borde);
      padding: .7rem 1.5rem; position: sticky; top: 0; z-index: 20;
    }
    .cabecera__espacio { flex: 1; }
    .icono-btn {
      background: transparent; border: 1px solid var(--borde); border-radius: 8px;
      width: 34px; height: 34px; cursor: pointer; font-size: 1rem; color: var(--texto-sec);
    }
    .icono-btn:hover { background: var(--navy-50); }

    .usuario { display: flex; align-items: center; gap: .6rem; }
    .usuario__datos { text-align: right; line-height: 1.2; }
    .usuario__nombre { font-weight: 600; font-size: .9rem; }
    .usuario__rol { font-size: .74rem; color: var(--texto-sec); }
    .usuario__avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--navy-700); color: #fff;
      display: grid; place-items: center; font-weight: 700; font-size: .82rem;
    }

    .banda-clave {
      background: var(--naranja-100); color: var(--naranja-600);
      padding: .6rem 1.5rem; font-size: .88rem; font-weight: 600;
      border-bottom: 1px solid #f0d3bb;
      a { color: var(--naranja-600); text-decoration: underline; margin-left: .4rem; }
    }

    .contenido { padding: 1.5rem; max-width: 1400px; width: 100%; }

    @media (max-width: 860px) {
      .marco, .marco--compacto { grid-template-columns: 64px 1fr; }
      .marca__nombre, .marca__sub, .menu__grupo,
      .menu__item span:not(.menu__icono) { display: none; }
      .usuario__datos { display: none; }
      .contenido { padding: 1rem; }
    }
  `],
})
export class ShellComponent {

  readonly auth = inject(AuthService);
  readonly compacto = signal(false);

  private readonly grupos: GrupoMenu[] = [
    {
      titulo: 'Resumen',
      items: [{ ruta: '/panel/inicio', etiqueta: 'Tablero', icono: '▤' }],
    },
    {
      titulo: 'Atención al cliente',
      items: [
        { ruta: '/panel/ventanilla', etiqueta: 'Admitir encomienda', icono: '✎', roles: ['OPERADOR', 'ADMIN'] },
        { ruta: '/panel/mostrador', etiqueta: 'Entregar encomienda', icono: '✋', roles: ['ALMACEN', 'ADMIN'] },
        { ruta: '/panel/envios', etiqueta: 'Buscar encomiendas', icono: '▦' },
      ],
    },
    {
      titulo: 'Operación',
      items: [
        { ruta: '/panel/almacen', etiqueta: 'Almacén', icono: '⬓', roles: ['ALMACEN', 'ADMIN'] },
        { ruta: '/panel/avisos', etiqueta: 'Avisos al cliente', icono: '✉' },
      ],
    },
    {
      titulo: 'Administración',
      items: [
        { ruta: '/panel/administracion', etiqueta: 'Agencias y personal', icono: '⚙', roles: ['ADMIN'] },
      ],
    },
  ];

  /** Solo se muestran los grupos que tienen al menos un modulo para este rol. */
  gruposVisibles(): GrupoMenu[] {
    const rol = this.auth.rol();
    return this.grupos
      .map((g) => ({
        titulo: g.titulo,
        items: g.items.filter((i) => !i.roles || (rol !== null && i.roles.includes(rol))),
      }))
      .filter((g) => g.items.length > 0);
  }

  descripcionRol(): string {
    switch (this.auth.rol()) {
      case 'OPERADOR': return 'Ventanilla';
      case 'ALMACEN':  return 'Almacén';
      case 'ADMIN':    return 'Administración';
      default:         return '';
    }
  }

  iniciales(): string {
    const nombre = this.auth.usuario()?.nombreCompleto ?? '';
    return nombre.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  }
}

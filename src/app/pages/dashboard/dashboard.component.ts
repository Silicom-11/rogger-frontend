import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogoService } from '../../core/services/catalogo.service';
import { EnvioService } from '../../core/services/envio.service';
import { AuthService } from '../../core/services/auth.service';
import { ESTADOS, Envio, EstadoEnvio, Resumen } from '../../core/models/modelos';
import { EstadoBadgeComponent } from '../../shared/estado-badge.component';

/** Tablero de control con los indicadores de la operacion. */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, EstadoBadgeComponent],
  template: `
    <div class="fila fila--entre mb-3">
      <div>
        <h1>Tablero de control</h1>
        <p class="texto-sec mt-0">
          Hola, {{ auth.usuario()?.nombreCompleto }}.
          @if (auth.veTodaLaRed()) {
            Este es el estado de toda la red.
          } @else {
            Este es el estado de su agencia <span class="mono">{{ auth.agencia() }}</span>.
          }
        </p>
      </div>
      @if (auth.tieneRol('OPERADOR', 'ADMIN')) {
        <a class="btn btn--primario" routerLink="/panel/ventanilla">+ Nueva encomienda</a>
      }
    </div>

    @if (cargando()) {
      <div class="cargando">Cargando indicadores…</div>
    } @else {
      @if (resumen(); as r) {

      <!-- Lo primero que ve cada quien es lo que le toca resolver hoy: el
           operador su turno, el almacén lo que se le acumula, la
           administración el volumen de la red. -->
      <div class="rejilla rejilla--4">

        @if (auth.tieneRol('OPERADOR', 'ADMIN') && r.misAdmisionesHoy != null) {
          <div class="kpi kpi--naranja">
            <div class="kpi__etiqueta">Admití hoy</div>
            <div class="kpi__valor">{{ r.misAdmisionesHoy }}</div>
            <div class="kpi__pie">
              {{ r.miCajaHoy | currency: 'PEN':'S/ ':'1.2-2' }} cobrados en mi turno
            </div>
          </div>
        } @else {
          <div class="kpi">
            <div class="kpi__etiqueta">Encomiendas registradas</div>
            <div class="kpi__valor">{{ r.totalEnvios }}</div>
            <div class="kpi__pie">histórico total</div>
          </div>
        }

        <div class="kpi kpi--naranja">
          <div class="kpi__etiqueta">En tránsito</div>
          <div class="kpi__valor">{{ r.enTransito }}</div>
          <div class="kpi__pie">en la ruta ahora</div>
        </div>

        <div class="kpi kpi--morado">
          <div class="kpi__etiqueta">Listas para recojo</div>
          <div class="kpi__valor">{{ r.listosParaRecojo }}</div>
          <div class="kpi__pie">esperando al destinatario</div>
        </div>

        @if (r.porRecogerHace3Dias > 0) {
          <div class="kpi kpi--rojo">
            <div class="kpi__etiqueta">Sin recoger +3 días</div>
            <div class="kpi__valor">{{ r.porRecogerHace3Dias }}</div>
            <div class="kpi__pie">ocupan el almacén</div>
          </div>
        } @else {
          <div class="kpi kpi--verde">
            <div class="kpi__etiqueta">Entregadas hoy</div>
            <div class="kpi__valor">{{ r.entregadosHoy }}</div>
            <div class="kpi__pie">cerradas en el día</div>
          </div>
        }
      </div>

      <!-- Acceso directo a lo que cada rol hace todo el día. -->
      <div class="atajos mt-2">
        @if (auth.tieneRol('OPERADOR', 'ADMIN')) {
          <a class="atajo" routerLink="/panel/ventanilla">
            <span class="atajo__icono">✎</span>
            <span>
              <strong>Admitir una encomienda</strong>
              <em>Cotiza, registra y entrega el comprobante</em>
            </span>
          </a>
        }
        @if (auth.tieneRol('ALMACEN', 'ADMIN')) {
          <a class="atajo" routerLink="/panel/mostrador">
            <span class="atajo__icono">✋</span>
            <span>
              <strong>Entregar una encomienda</strong>
              <em>Busca por DNI y verifica la clave de seguridad</em>
            </span>
          </a>
          <a class="atajo" routerLink="/panel/almacen">
            <span class="atajo__icono">⬓</span>
            <span>
              <strong>Mover carga en el almacén</strong>
              <em>Registra llegadas y marca listas para recojo</em>
            </span>
          </a>
        }
      </div>

      <!-- Los importes acumulados solo llegan desde la API cuando quien
           consulta es la administracion; para los demas roles el dato ni
           siquiera sale del servidor. -->
      @if (r.ingresosHoy != null) {
        <div class="rejilla rejilla--3 mt-2">
          <div class="card">
            <div class="texto-xs texto-sec">INGRESOS DE HOY</div>
            <div class="monto">{{ r.ingresosHoy | currency: 'PEN':'S/ ':'1.2-2' }}</div>
          </div>
          <div class="card">
            <div class="texto-xs texto-sec">INGRESOS DEL MES</div>
            <div class="monto">{{ r.ingresosMes | currency: 'PEN':'S/ ':'1.2-2' }}</div>
          </div>
          <div class="card">
            <div class="texto-xs texto-sec">TICKET PROMEDIO</div>
            <div class="monto">{{ r.ticketPromedio | currency: 'PEN':'S/ ':'1.2-2' }}</div>
          </div>
        </div>
      }

      <div class="rejilla rejilla--2 mt-2">

        <div class="card">
          <div class="card__titulo"><h3>Encomiendas por estado</h3></div>
          @for (fila of barras(r); track fila.estado) {
            <div class="barra">
              <div class="barra__cabecera">
                <span>{{ etiqueta(fila.estado) }}</span>
                <span class="negrita">{{ fila.cantidad }}</span>
              </div>
              <div class="barra__pista">
                <div class="barra__valor" [class]="'barra__valor--' + color(fila.estado)"
                     [style.width.%]="fila.porcentaje"></div>
              </div>
            </div>
          } @empty {
            <p class="texto-sec">Aún no hay encomiendas registradas.</p>
          }
        </div>

        <div class="card">
          <div class="card__titulo"><h3>Carga por agencia de destino</h3></div>
          @for (a of r.porAgenciaDestino; track a.agenciaId) {
            <div class="fila fila--entre agencia">
              <div>
                <div class="negrita">{{ a.nombre }}</div>
                <div class="texto-xs texto-sec mono">{{ a.agenciaId }}</div>
              </div>
              <div class="agencia__cantidad">{{ a.cantidad }}</div>
            </div>
          } @empty {
            <p class="texto-sec">Sin movimientos registrados.</p>
          }
        </div>
      </div>

      <div class="card mt-2">
        <div class="card__titulo">
          <h3>Últimas encomiendas</h3>
          <a class="btn btn--suave btn--sm" routerLink="/panel/envios">Ver todas</a>
        </div>

        <div class="tabla-contenedor">
          <table class="tabla">
            <thead>
              <tr>
                <th>Código</th><th>Destinatario</th><th>Ruta</th>
                <th>Estado</th><th>Registrado</th><th class="centrado">Total</th>
              </tr>
            </thead>
            <tbody>
              @for (e of ultimos(); track e.codigoRastreo) {
                <tr>
                  <td><a class="mono" [routerLink]="['/panel/envios', e.codigoRastreo]">{{ e.codigoRastreo }}</a></td>
                  <td>{{ e.destinatario.nombres }}</td>
                  <td class="texto-sm">{{ e.agenciaOrigenId }} → {{ e.agenciaDestinoId }}</td>
                  <td><app-estado-badge [estado]="e.estadoActual" /></td>
                  <td class="texto-sm">{{ e.fechaRegistro | date: 'dd/MM/yy HH:mm' }}</td>
                  <td class="centrado negrita">{{ e.tarifa.total | currency: 'PEN':'S/ ':'1.2-2' }}</td>
                </tr>
              } @empty {
                <tr><td colspan="6" class="tabla__vacia">Aún no se registran encomiendas.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
      }
    }
  `,
  styles: [`
    .kpi {
      background: #fff; border: 1px solid var(--borde); border-radius: var(--radio);
      padding: 1.1rem 1.25rem; box-shadow: var(--sombra); border-left: 4px solid var(--navy-600);
    }
    .kpi--naranja { border-left-color: var(--naranja-500); }
    .kpi--verde   { border-left-color: var(--verde-600); }
    .kpi--morado  { border-left-color: var(--morado-600); }
    .kpi--rojo    { border-left-color: var(--rojo-600); }

    .atajos { display: flex; gap: .8rem; flex-wrap: wrap; }
    .atajo {
      display: flex; align-items: center; gap: .8rem; flex: 1 1 260px;
      background: #fff; border: 1px solid var(--borde); border-radius: var(--radio);
      padding: .85rem 1rem; text-decoration: none; color: var(--texto);
      box-shadow: var(--sombra); transition: border-color .15s ease, transform .15s ease;
    }
    .atajo:hover { border-color: var(--navy-600); text-decoration: none; transform: translateY(-1px); }
    .atajo__icono {
      width: 38px; height: 38px; flex: 0 0 38px; border-radius: 10px;
      background: var(--navy-50); color: var(--navy-700);
      display: grid; place-items: center; font-size: 1.1rem;
    }
    .atajo strong { display: block; font-size: .92rem; }
    .atajo em { display: block; font-style: normal; font-size: .78rem; color: var(--texto-sec); }
    .kpi__etiqueta { font-size: .74rem; text-transform: uppercase; letter-spacing: .04em; color: var(--texto-sec); font-weight: 700; }
    .kpi__valor { font-size: 2rem; font-weight: 800; line-height: 1.15; margin-top: .2rem; }
    .kpi__pie { font-size: .78rem; color: var(--texto-sec); }

    .monto { font-size: 1.55rem; font-weight: 800; margin-top: .2rem; }

    .barra { margin-bottom: .8rem; }
    .barra__cabecera { display: flex; justify-content: space-between; font-size: .85rem; margin-bottom: .25rem; }
    .barra__pista { height: 8px; background: var(--gris-100); border-radius: 999px; overflow: hidden; }
    .barra__valor { height: 100%; border-radius: 999px; background: var(--navy-600); transition: width .3s ease; }
    .barra__valor--verde { background: var(--verde-600); }
    .barra__valor--naranja { background: var(--naranja-500); }
    .barra__valor--morado { background: var(--morado-600); }
    .barra__valor--rojo { background: var(--rojo-600); }
    .barra__valor--gris { background: var(--gris-600); }

    .agencia { padding: .55rem 0; border-bottom: 1px solid var(--borde); }
    .agencia:last-child { border-bottom: none; }
    .agencia__cantidad {
      background: var(--navy-50); color: var(--navy-700); font-weight: 700;
      border-radius: 8px; padding: .25rem .7rem;
    }
  `],
})
export class DashboardComponent implements OnInit {

  private readonly catalogo = inject(CatalogoService);
  private readonly envios = inject(EnvioService);
  readonly auth = inject(AuthService);

  readonly resumen = signal<Resumen | null>(null);
  readonly ultimos = signal<Envio[]>([]);
  readonly cargando = signal(true);

  ngOnInit(): void {
    this.catalogo.resumen().subscribe({
      next: (r) => { this.resumen.set(r); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });

    this.envios.buscar({ pagina: 0, tamanio: 6 })
      .subscribe({ next: (p) => this.ultimos.set(p.contenido) });
  }

  barras(r: Resumen): { estado: EstadoEnvio; cantidad: number; porcentaje: number }[] {
    const total = Math.max(1, r.totalEnvios);
    return Object.entries(r.porEstado)
      .filter(([, cantidad]) => cantidad > 0)
      .map(([estado, cantidad]) => ({
        estado: estado as EstadoEnvio,
        cantidad,
        porcentaje: Math.round((cantidad / total) * 100),
      }));
  }

  etiqueta(estado: EstadoEnvio): string { return ESTADOS[estado]?.etiqueta ?? estado; }
  color(estado: EstadoEnvio): string { return ESTADOS[estado]?.color ?? 'gris'; }
}

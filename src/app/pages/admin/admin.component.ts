import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogoService } from '../../core/services/catalogo.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { Agencia, ClaveTemporal, Tarifario, Usuario } from '../../core/models/modelos';

type Pestania = 'agencias' | 'usuarios' | 'tarifario';

/** Modulo de administracion: agencias, personal y tarifario. */
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1>Administración</h1>
    <p class="texto-sec mt-0 mb-3">Configuración de la red de agencias, del personal y del tarifario.</p>

    <div class="pestanias">
      @for (p of pestanias; track p.clave) {
        <button class="pestania" [class.pestania--activa]="activa() === p.clave"
                (click)="activa.set(p.clave)">{{ p.etiqueta }}</button>
      }
    </div>

    <!-- ============ AGENCIAS ============ -->
    @if (activa() === 'agencias') {
      <div class="rejilla rejilla--2">
        <div class="card">
          <div class="card__titulo"><h3>Agencias registradas</h3></div>
          <div class="tabla-contenedor">
            <table class="tabla">
              <thead><tr><th>Código</th><th>Nombre</th><th>Ciudad</th><th>Teléfono</th></tr></thead>
              <tbody>
                @for (a of agencias(); track a.codigo) {
                  <tr>
                    <td class="mono negrita">{{ a.codigo }}</td>
                    <td>{{ a.nombre }}</td>
                    <td>{{ a.ciudad }}</td>
                    <td class="mono texto-sm">{{ a.telefono || '—' }}</td>
                  </tr>
                } @empty {
                  <tr><td colspan="4" class="tabla__vacia">Sin agencias registradas.</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card__titulo"><h3>Nueva agencia</h3></div>
          <form [formGroup]="formAgencia" (ngSubmit)="crearAgencia()" class="rejilla">
            <div class="campo">
              <label>Código</label>
              <input type="text" formControlName="codigo" placeholder="AG-HYO-SUR" class="mono" />
            </div>
            <div class="campo">
              <label>Nombre</label>
              <input type="text" formControlName="nombre" placeholder="Huancayo - Sur" />
            </div>
            <div class="campo">
              <label>Ciudad</label>
              <input type="text" formControlName="ciudad" placeholder="Huancayo" />
            </div>
            <div class="campo">
              <label>Dirección</label>
              <input type="text" formControlName="direccion" placeholder="Av. Huancavelica 123" />
            </div>
            <div class="campo">
              <label>Teléfono</label>
              <input type="text" formControlName="telefono" placeholder="064123456" class="mono" />
            </div>
            <button class="btn btn--primario" type="submit" [disabled]="formAgencia.invalid">
              Registrar agencia
            </button>
          </form>
        </div>
      </div>
    }

    <!-- ============ USUARIOS ============ -->
    @if (activa() === 'usuarios') {
      <div class="rejilla rejilla--2">
        <div class="card">
          <div class="card__titulo"><h3>Personal del sistema</h3></div>
          <div class="tabla-contenedor">
            <table class="tabla">
              <thead><tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Agencia</th><th>Estado</th></tr></thead>
              <tbody>
                @for (u of usuarios(); track u.username) {
                  <tr>
                    <td class="mono">{{ u.username }}</td>
                    <td>{{ u.nombreCompleto }}</td>
                    <td><span class="badge" [class]="'badge--' + colorRol(u.rol)">{{ u.rol }}</span></td>
                    <td class="mono texto-sm">{{ u.agenciaId }}</td>
                    <td>
                      <div class="fila">
                        <button class="btn btn--sm" [class]="u.activo ? 'btn--suave' : 'btn--contorno'"
                                (click)="alternar(u)">
                          {{ u.activo ? 'Activo' : 'Inactivo' }}
                        </button>
                        <button class="btn btn--sm btn--contorno" (click)="restablecer(u)"
                                title="Genera una clave temporal para este usuario">
                          Restablecer clave
                        </button>
                      </div>
                      @if (u.debeCambiarClave) {
                        <div class="texto-xs texto-sec mt-1">debe cambiar su clave al ingresar</div>
                      }
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="5" class="tabla__vacia">Sin usuarios registrados.</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          @if (claveTemporal(); as ct) {
            <div class="clave-temporal mb-2">
              <div class="negrita">Clave temporal de {{ ct.username }}</div>
              <div class="clave-temporal__valor mono">{{ ct.claveTemporal }}</div>
              <p class="texto-xs mt-1">{{ ct.mensaje }}</p>
              <button class="btn btn--sm btn--contorno" (click)="claveTemporal.set(null)">Ocultar</button>
            </div>
          }

          <div class="card__titulo"><h3>Nuevo usuario</h3></div>
          <p class="texto-xs texto-sec mt-0">
            El usuario deberá definir su propia contraseña la primera vez que ingrese.
          </p>
          <form [formGroup]="formUsuario" (ngSubmit)="crearUsuario()" class="rejilla">
            <div class="campo">
              <label>Usuario</label>
              <input type="text" formControlName="username" placeholder="operador.huancayo" class="mono" />
            </div>
            <div class="campo">
              <label>Contraseña</label>
              <input type="password" formControlName="password" placeholder="mínimo 8 caracteres" />
              @if (formUsuario.get('password')?.touched && formUsuario.get('password')?.invalid) {
                <span class="campo__error">Mínimo 8 caracteres</span>
              }
            </div>
            <div class="campo">
              <label>Nombre completo</label>
              <input type="text" formControlName="nombreCompleto" placeholder="Ruth Palomino" />
            </div>
            <div class="campo">
              <label>Rol</label>
              <select formControlName="rol">
                <option value="OPERADOR">Operador de ventanilla</option>
                <option value="ALMACEN">Personal de almacén</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
            <div class="campo">
              <label>Agencia</label>
              <select formControlName="agenciaId">
                <option value="">Seleccione…</option>
                @for (a of agencias(); track a.codigo) {
                  <option [value]="a.codigo">{{ a.nombre }}</option>
                }
              </select>
            </div>
            <button class="btn btn--primario" type="submit" [disabled]="formUsuario.invalid">
              Registrar usuario
            </button>
          </form>
        </div>
      </div>
    }

    <!-- ============ TARIFARIO ============ -->
    @if (activa() === 'tarifario') {
      <div class="rejilla rejilla--2">
        <div class="card">
          <div class="card__titulo"><h3>Tarifario por ruta</h3></div>
          <div class="tabla-contenedor">
            <table class="tabla">
              <thead>
                <tr><th>Ruta</th><th>Base</th><th>Por kg</th><th>Factor vol.</th><th>Frágil</th><th>Vigente</th></tr>
              </thead>
              <tbody>
                @for (t of tarifario(); track t.id) {
                  <tr [class.inactivo]="!t.activo">
                    <td class="negrita">{{ t.ruta }}</td>
                    <td>S/ {{ t.montoBase }}</td>
                    <td>S/ {{ t.precioPorKg }}</td>
                    <td class="mono">{{ t.factorVolumetrico }}</td>
                    <td>S/ {{ t.recargoFragil }}</td>
                    <td>
                      <span class="badge" [class]="t.activo ? 'badge--verde' : 'badge--gris'">
                        {{ t.activo ? 'Vigente' : 'Histórico' }}
                      </span>
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="6" class="tabla__vacia">Sin tarifario configurado.</td></tr>
                }
              </tbody>
            </table>
          </div>
          <p class="texto-xs texto-sec mt-2">
            Al registrar una tarifa nueva para una ruta, la anterior queda como histórica.
          </p>
        </div>

        <div class="card">
          <div class="card__titulo"><h3>Nueva tarifa</h3></div>
          <form [formGroup]="formTarifa" (ngSubmit)="crearTarifa()" class="rejilla">
            <div class="campo">
              <label>Ruta</label>
              <input type="text" formControlName="ruta" placeholder="Lima-Huancayo" />
              <span class="texto-xs texto-sec">Formato: CiudadOrigen-CiudadDestino</span>
            </div>
            <div class="rejilla rejilla--2">
              <div class="campo">
                <label>Monto base (S/)</label>
                <input type="number" step="0.5" formControlName="montoBase" />
              </div>
              <div class="campo">
                <label>Precio por kg (S/)</label>
                <input type="number" step="0.5" formControlName="precioPorKg" />
              </div>
              <div class="campo">
                <label>Factor volumétrico</label>
                <input type="number" formControlName="factorVolumetrico" />
              </div>
              <div class="campo">
                <label>Recargo frágil (S/)</label>
                <input type="number" step="0.5" formControlName="recargoFragil" />
              </div>
            </div>
            <button class="btn btn--primario" type="submit" [disabled]="formTarifa.invalid">
              Registrar tarifa
            </button>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    .pestanias { display: flex; gap: .3rem; margin-bottom: 1.2rem; border-bottom: 2px solid var(--borde); }
    .pestania {
      background: transparent; border: none; cursor: pointer;
      padding: .65rem 1.1rem; font: inherit; font-weight: 600; font-size: .92rem;
      color: var(--texto-sec); border-bottom: 3px solid transparent; margin-bottom: -2px;
    }
    .pestania:hover { color: var(--navy-700); }
    .pestania--activa { color: var(--navy-700); border-bottom-color: var(--naranja-500); }
    tr.inactivo { opacity: .55; }
    .clave-temporal {
      background: var(--naranja-100); border-left: 4px solid var(--naranja-500);
      border-radius: 8px; padding: .8rem 1rem;
    }
    .clave-temporal__valor {
      font-size: 1.3rem; font-weight: 800; letter-spacing: .06em;
      color: var(--naranja-600); margin-top: .2rem;
    }
  `],
})
export class AdminComponent implements OnInit {

  private readonly catalogo = inject(CatalogoService);
  private readonly avisos = inject(NotificacionService);
  private readonly fb = inject(FormBuilder);

  readonly activa = signal<Pestania>('agencias');
  readonly pestanias: { clave: Pestania; etiqueta: string }[] = [
    { clave: 'agencias', etiqueta: 'Agencias' },
    { clave: 'usuarios', etiqueta: 'Personal' },
    { clave: 'tarifario', etiqueta: 'Tarifario' },
  ];

  readonly agencias = signal<Agencia[]>([]);
  readonly usuarios = signal<Usuario[]>([]);
  readonly tarifario = signal<Tarifario[]>([]);
  readonly claveTemporal = signal<ClaveTemporal | null>(null);

  readonly formAgencia = this.fb.nonNullable.group({
    codigo: ['', Validators.required],
    nombre: ['', Validators.required],
    ciudad: ['', Validators.required],
    direccion: [''],
    telefono: [''],
  });

  readonly formUsuario = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    nombreCompleto: ['', Validators.required],
    rol: ['OPERADOR', Validators.required],
    agenciaId: ['', Validators.required],
  });

  readonly formTarifa = this.fb.nonNullable.group({
    ruta: ['', Validators.required],
    montoBase: [8, [Validators.required, Validators.min(0)]],
    precioPorKg: [3, [Validators.required, Validators.min(0.1)]],
    factorVolumetrico: [6000, [Validators.required, Validators.min(1)]],
    recargoFragil: [5, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void { this.recargar(); }

  private recargar(): void {
    this.catalogo.agencias().subscribe({ next: (a) => this.agencias.set(a) });
    this.catalogo.usuarios().subscribe({ next: (u) => this.usuarios.set(u) });
    this.catalogo.tarifario().subscribe({ next: (t) => this.tarifario.set(t) });
  }

  crearAgencia(): void {
    if (this.formAgencia.invalid) return;
    this.catalogo.crearAgencia(this.formAgencia.getRawValue()).subscribe({
      next: () => {
        this.avisos.exito('Agencia registrada');
        this.formAgencia.reset();
        this.recargar();
      },
    });
  }

  crearUsuario(): void {
    if (this.formUsuario.invalid) return;
    this.catalogo.crearUsuario(this.formUsuario.getRawValue()).subscribe({
      next: () => {
        this.avisos.exito('Usuario registrado');
        this.formUsuario.reset({ rol: 'OPERADOR', agenciaId: '' });
        this.recargar();
      },
    });
  }

  crearTarifa(): void {
    if (this.formTarifa.invalid) return;
    this.catalogo.crearTarifario(this.formTarifa.getRawValue()).subscribe({
      next: () => {
        this.avisos.exito('Tarifa registrada y aplicada a la ruta');
        this.recargar();
      },
    });
  }

  /** Genera una clave temporal y la muestra una sola vez al administrador. */
  restablecer(usuario: Usuario): void {
    if (!usuario.id) return;
    this.catalogo.restablecerClave(usuario.id).subscribe({
      next: (ct) => {
        this.claveTemporal.set(ct);
        this.avisos.exito(`Contraseña de ${ct.username} restablecida`);
        this.recargar();
      },
    });
  }

  alternar(usuario: Usuario): void {
    if (!usuario.id) return;
    this.catalogo.cambiarEstadoUsuario(usuario.id, !usuario.activo).subscribe({
      next: () => { this.avisos.exito('Estado del usuario actualizado'); this.recargar(); },
    });
  }

  colorRol(rol: string): string {
    return rol === 'ADMIN' ? 'morado' : rol === 'ALMACEN' ? 'naranja' : 'azul';
  }
}

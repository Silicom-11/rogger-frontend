import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificacionService } from '../../core/services/notificacion.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="acceso">

      <section class="acceso__marca">
        <div class="marca">
          <div class="marca__logo">RE</div>
          <div>
            <div class="marca__nombre">Rogger Express</div>
            <div class="marca__sub">Sistema de gestión de encomiendas</div>
          </div>
        </div>

        <h1 class="titulo">Todo el movimiento de tus encomiendas, en un solo lugar.</h1>
        <p class="descripcion">
          Admisión en ventanilla con tarifa automática, control de almacén,
          seguimiento en tiempo real y entrega verificada. Ruta Lima – Huancayo.
        </p>

        <ul class="ventajas">
          <li><span>✓</span> Tarifa calculada por peso facturable, sin criterios distintos por turno</li>
          <li><span>✓</span> Código de rastreo único y trazabilidad completa de cada evento</li>
          <li><span>✓</span> Entrega validada contra el documento del destinatario</li>
        </ul>
      </section>

      <section class="acceso__panel">
        <div class="tarjeta">
          <h2>Iniciar sesión</h2>
          <p class="texto-sec texto-sm">Ingrese con las credenciales asignadas por su agencia.</p>

          <form [formGroup]="formulario" (ngSubmit)="ingresar()" class="formulario">

            <div class="campo">
              <label for="username">Usuario</label>
              <input id="username" type="text" formControlName="username"
                     placeholder="operador.lima" autocomplete="username" />
              @if (invalido('username')) {
                <span class="campo__error">Ingrese su usuario</span>
              }
            </div>

            <div class="campo">
              <label for="password">Contraseña</label>
              <input id="password" type="password" formControlName="password"
                     placeholder="••••••••" autocomplete="current-password" />
              @if (invalido('password')) {
                <span class="campo__error">Ingrese su contraseña</span>
              }
            </div>

            @if (error()) { <div class="alerta">{{ error() }}</div> }

            <button class="btn btn--primario btn--bloque" type="submit" [disabled]="cargando()">
              {{ cargando() ? 'Verificando…' : 'Ingresar' }}
            </button>
          </form>

          <a class="enlace-publico" routerLink="/rastrear">¿Eres cliente? Rastrea tu encomienda aquí →</a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .acceso { display: grid; grid-template-columns: 1.1fr .9fr; min-height: 100vh; }

    .acceso__marca {
      background: linear-gradient(150deg, var(--navy-900) 0%, var(--navy-700) 70%, #2a4a80 100%);
      color: #fff; padding: 3rem 3.4rem; display: flex; flex-direction: column; justify-content: center;
    }
    .marca { display: flex; align-items: center; gap: .8rem; margin-bottom: 3rem; }
    .marca__logo {
      width: 46px; height: 46px; border-radius: 12px; background: var(--naranja-500);
      display: grid; place-items: center; font-weight: 800; letter-spacing: .04em;
    }
    .marca__nombre { font-weight: 700; font-size: 1.05rem; }
    .marca__sub { font-size: .78rem; color: #9db0cd; }
    .titulo { color: #fff; font-size: 2rem; max-width: 15ch; line-height: 1.2; }
    .descripcion { margin-top: 1rem; color: #c3d1e6; max-width: 46ch; }
    .ventajas { list-style: none; padding: 0; margin: 2rem 0 0; display: grid; gap: .7rem; }
    .ventajas li { display: flex; gap: .6rem; font-size: .92rem; color: #dbe5f5; }
    .ventajas span {
      flex: 0 0 20px; height: 20px; border-radius: 50%; background: rgba(255,255,255,.14);
      display: grid; place-items: center; font-size: .72rem;
    }

    .acceso__panel { display: grid; place-items: center; padding: 2rem; }
    .tarjeta {
      width: 100%; max-width: 380px; background: #fff;
      border: 1px solid var(--borde); border-radius: 16px;
      box-shadow: var(--sombra); padding: 2rem;
    }
    .formulario { display: grid; gap: 1rem; margin-top: 1.4rem; }
    .alerta {
      background: var(--rojo-100); color: var(--rojo-600);
      border-radius: 8px; padding: .6rem .8rem; font-size: .86rem;
    }
    .enlace-publico { display: block; margin-top: 1.4rem; text-align: center; font-size: .86rem; }

    @media (max-width: 900px) {
      .acceso { grid-template-columns: 1fr; }
      .acceso__marca { display: none; }
    }
  `],
})
export class LoginComponent {

  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly avisos = inject(NotificacionService);

  readonly cargando = signal(false);
  readonly error = signal('');

  readonly formulario = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  invalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.invalid && control.touched;
  }

  ingresar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    const { username, password } = this.formulario.getRawValue();

    this.auth.login(username, password).subscribe({
      next: (respuesta) => {
        this.cargando.set(false);
        this.avisos.exito(`Bienvenido, ${respuesta.usuario.nombreCompleto}`);
        this.router.navigate(['/panel/inicio']);
      },
      error: (e) => {
        this.cargando.set(false);
        this.error.set(e.status === 401 || e.status === 403
          ? 'Usuario o contraseña incorrectos.'
          : 'No se pudo conectar con el servidor. Verifique que la API esté en ejecución.');
      },
    });
  }
}

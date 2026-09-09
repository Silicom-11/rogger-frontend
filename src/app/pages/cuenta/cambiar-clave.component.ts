import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificacionService } from '../../core/services/notificacion.service';

/** Cambio de contrasena del usuario autenticado. */
@Component({
  selector: 'app-cambiar-clave',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="contenedor">

      @if (auth.debeCambiarClave()) {
        <div class="obligatorio">
          <strong>Debe definir una contraseña propia</strong>
          <p class="mt-0 texto-sm">
            Su cuenta fue creada por un administrador o su clave fue restablecida.
            Para continuar usando el sistema, elija una contraseña que solo usted conozca.
          </p>
        </div>
      }

      <div class="card">
        <div class="card__titulo"><h2>Cambiar contraseña</h2></div>

        <form [formGroup]="formulario" (ngSubmit)="guardar()" class="rejilla">

          <div class="campo">
            <label>Contraseña actual</label>
            <input type="password" formControlName="claveActual" autocomplete="current-password" />
            @if (invalido('claveActual')) { <span class="campo__error">Ingrese su contraseña actual</span> }
          </div>

          <div class="campo">
            <label>Nueva contraseña</label>
            <input type="password" formControlName="claveNueva" autocomplete="new-password" />
            @if (invalido('claveNueva')) {
              <span class="campo__error">Debe tener al menos 8 caracteres</span>
            }
          </div>

          <div class="campo">
            <label>Repita la nueva contraseña</label>
            <input type="password" formControlName="confirmacion" autocomplete="new-password" />
            @if (formulario.errors?.['noCoincide'] && formulario.get('confirmacion')?.touched) {
              <span class="campo__error">Las contraseñas no coinciden</span>
            }
          </div>

          <button class="btn btn--primario" type="submit" [disabled]="formulario.invalid || guardando()">
            {{ guardando() ? 'Guardando…' : 'Cambiar contraseña' }}
          </button>
        </form>

        <p class="texto-xs texto-sec mt-2">
          Recomendación: use al menos 8 caracteres combinando letras y números,
          y no reutilice la contraseña de otros sistemas.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .contenedor { max-width: 520px; }
    .obligatorio {
      background: var(--naranja-100); border-left: 4px solid var(--naranja-500);
      border-radius: 8px; padding: .9rem 1.1rem; margin-bottom: 1.2rem;
      strong { color: var(--naranja-600); }
    }
  `],
})
export class CambiarClaveComponent {

  private readonly fb = inject(FormBuilder);
  private readonly avisos = inject(NotificacionService);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);

  readonly guardando = signal(false);

  readonly formulario = this.fb.nonNullable.group({
    claveActual: ['', Validators.required],
    claveNueva: ['', [Validators.required, Validators.minLength(8)]],
    confirmacion: ['', Validators.required],
  }, { validators: coincidencia });

  invalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.invalid && control.touched;
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const { claveActual, claveNueva } = this.formulario.getRawValue();
    this.guardando.set(true);

    this.auth.cambiarClave(claveActual, claveNueva).subscribe({
      next: () => {
        this.guardando.set(false);
        this.avisos.exito('Contraseña actualizada correctamente');
        this.router.navigate(['/panel/inicio']);
      },
      error: () => this.guardando.set(false),
    });
  }
}

/** Valida que la nueva contrasena y su confirmacion coincidan. */
function coincidencia(grupo: AbstractControl): ValidationErrors | null {
  const nueva = grupo.get('claveNueva')?.value;
  const confirmacion = grupo.get('confirmacion')?.value;
  return nueva && confirmacion && nueva !== confirmacion ? { noCoincide: true } : null;
}

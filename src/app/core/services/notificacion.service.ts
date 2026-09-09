import { Injectable, signal } from '@angular/core';

export interface Aviso {
  id: number;
  tipo: 'exito' | 'error' | 'info';
  mensaje: string;
}

/** Avisos emergentes de la aplicacion. */
@Injectable({ providedIn: 'root' })
export class NotificacionService {

  private contador = 0;
  readonly avisos = signal<Aviso[]>([]);

  exito(mensaje: string): void {
    this.mostrar('exito', mensaje);
  }

  error(mensaje: string): void {
    this.mostrar('error', mensaje);
  }

  info(mensaje: string): void {
    this.mostrar('info', mensaje);
  }

  cerrar(id: number): void {
    this.avisos.update((lista) => lista.filter((a) => a.id !== id));
  }

  private mostrar(tipo: Aviso['tipo'], mensaje: string): void {
    const id = ++this.contador;
    this.avisos.update((lista) => [...lista, { id, tipo, mensaje }]);
    setTimeout(() => this.cerrar(id), 5000);
  }
}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AvisosComponent } from './shared/avisos.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AvisosComponent],
  template: `
    <router-outlet />
    <app-avisos />
  `,
})
export class AppComponent {}

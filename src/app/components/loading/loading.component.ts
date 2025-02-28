import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="cargando" class="flex justify-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"
      ></div>
    </div>
  `,
})
export class LoadingComponent {
  @Input() cargando: boolean = false;
}

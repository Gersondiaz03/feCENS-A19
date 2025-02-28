import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-column-selector',
  imports: [CommonModule],
  templateUrl: './column-selector.component.html',
  styleUrl: './column-selector.component.css',
})
export class ColumnSelectorComponent {
  @Input() columnasDisponibles: string[] = [];
  @Input() columnasSeleccionadas: string[] = [];
  @Output() columnaMovida = new EventEmitter<{
    columna: string;
    desde: string;
    hacia: string;
  }>();

  moverColumna(columna: string, desde: string, hacia: string) {
    this.columnaMovida.emit({ columna, desde, hacia });
  }
}

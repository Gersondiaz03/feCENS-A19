import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
  @Output() archivoSeleccionado = new EventEmitter<File>();
  nombreArchivo: string = '';

  onArchivoSubido(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.nombreArchivo = file.name;
      this.archivoSeleccionado.emit(file);
    }
  }
}

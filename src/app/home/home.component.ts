import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ColumnSelectorComponent } from '../components/column-selector/column-selector.component';
import { FilterConfigComponent } from '../components/filter-config/filter-config.component';
import { LoadingComponent } from '../components/loading/loading.component';
import { ExcelService, FiltroGuardado } from '../services/excel.service';
import { UploadComponent } from '../components/upload/upload.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    UploadComponent,
    ColumnSelectorComponent,
    FilterConfigComponent,
    LoadingComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  archivoExcel: File | null = null;

  constructor(public excelService: ExcelService) {}

  onArchivoSeleccionado(archivo: File) {
    if (!archivo) {
      console.error('No se seleccionó ningún archivo.');
      return;
    }

    this.archivoExcel = archivo;
    this.excelService.cargarArchivo(this.archivoExcel).subscribe({
      next: () => {
        console.log('Archivo cargado exitosamente:', archivo.name);
      },
      error: (err) => {
        console.error('Error al cargar el archivo:', err);
      },
    });
  }

  moverColumna(event: { columna: string; desde: string; hacia: string }) {
    const { columna, desde, hacia } = event;

    if (hacia === 'seleccionadas') {
      const currentSelection = [...this.excelService.seleccionadas()];
      if (!currentSelection.includes(columna)) {
        currentSelection.push(columna);
        this.excelService.seleccionarColumnas(currentSelection).subscribe({
          next: () => {
            console.log('Columna agregada a seleccionadas:', columna);
          },
          error: (err) => {
            console.error('Error al agregar columna:', err);
          },
        });
      }
    } else if (desde === 'seleccionadas') {
      const currentSelection = this.excelService
        .seleccionadas()
        .filter((col) => col !== columna);
      this.excelService.seleccionarColumnas(currentSelection).subscribe({
        next: () => {
          console.log('Columna eliminada de seleccionadas:', columna);
        },
        error: (err) => {
          console.error('Error al eliminar columna:', err);
        },
      });
    }
  }

  ejecutarFiltros() {
    const filtrosGuardados = this.excelService.filtros();
    if (filtrosGuardados.length === 0) {
      console.error('No hay filtros configurados.');
      return;
    }

    this.excelService.ejecutarFiltros().subscribe({
      next: (response) => {
        console.log('Filtros ejecutados exitosamente:', response);
      },
      error: (err) => {
        console.error('Error al ejecutar filtros:', err);
      },
    });
  }
}

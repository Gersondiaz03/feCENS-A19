import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ExcelService, FiltroGuardado } from '../../services/excel.service';

@Component({
  selector: 'app-filter-config',
  standalone: true, // Use standalone components for Angular 14+
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-config.component.html',
  styleUrls: ['./filter-config.component.css'],
})
export class FilterConfigComponent {
  @Input() columnasSeleccionadas: string[] = [];
  @Input() filtrosGuardados: FiltroGuardado[] = [];

  // Valores para los filtros avanzados
  valorConformidad: { [columna: string]: any } = {};
  valoresPermitidos: { [columna: string]: string } = {};
  rangoMin: { [columna: string]: number } = {};
  rangoMax: { [columna: string]: number } = {};

  constructor(private excelService: ExcelService) {}

  // Obtener el estado actual de un filtro
  tieneFiltroDeTipo(columna: string, tipoFiltro: string): boolean {
    const filtroColumna = this.obtenerFiltroColumna(columna);
    return filtroColumna ? !!filtroColumna[tipoFiltro] : false;
  }

  // Obtener el objeto de filtro para una columna
  obtenerFiltroColumna(columna: string): any {
    for (const filtro of this.filtrosGuardados) {
      if (filtro[columna]) {
        return filtro[columna];
      }
    }
    return null;
  }

  // Agregar/quitar filtro de completitud
  toggleFiltroCompletitud(columna: string): void {
    this.excelService.agregarFiltroCompletitud(columna).subscribe();
  }

  // Agregar/quitar filtro de validez
  toggleFiltroValidez(columna: string): void {
    console.log('Columna seleccionada:', columna); // Agrega esta línea
    this.excelService.agregarFiltroValidez(columna).subscribe();
  }

  // Agregar/quitar filtro de duplicidad
  toggleFiltroDuplicidad(columna: string): void {
    console.log('Columna seleccionada:', columna); // Agrega esta línea
    this.excelService.agregarFiltroDuplicidad(columna).subscribe();
  }

  // Agregar filtro de conformidad
  agregarFiltroConformidad(columna: string): void {
    if (!this.valorConformidad[columna]) {
      console.error(
        `Valor de conformidad no especificado para la columna: ${columna}`
      );
      return;
    }

    this.excelService
      .agregarFiltroConformidad(columna, this.valorConformidad[columna])
      .subscribe({
        next: () => {
          console.log('Filtro de conformidad agregado exitosamente:', columna);
        },
        error: (err) => {
          console.error('Error al agregar filtro de conformidad:', err);
        },
      });
  }

  // Agregar filtro de lista
  agregarFiltroLista(columna: string): void {
    if (!this.valoresPermitidos[columna]) {
      console.error(
        `Valores permitidos no especificados para la columna: ${columna}`
      );
      return;
    }

    const valores = this.valoresPermitidos[columna]
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v !== '');

    if (valores.length === 0) {
      console.error(
        `No se encontraron valores válidos para la columna: ${columna}`
      );
      return;
    }

    this.excelService.agregarFiltroLista(columna, valores).subscribe({
      next: () => {
        console.log('Filtro de lista agregado exitosamente:', columna);
      },
      error: (err) => {
        console.error('Error al agregar filtro de lista:', err);
      },
    });
  }

  agregarFiltroRango(columna: string): void {
    if (
      this.rangoMin[columna] === undefined ||
      this.rangoMax[columna] === undefined ||
      isNaN(this.rangoMin[columna]) ||
      isNaN(this.rangoMax[columna]) ||
      this.rangoMin[columna] > this.rangoMax[columna]
    ) {
      console.error(`Rango inválido para la columna: ${columna}`);
      return;
    }

    this.excelService
      .agregarFiltroRango(
        columna,
        this.rangoMin[columna],
        this.rangoMax[columna]
      )
      .subscribe({
        next: () => {
          console.log('Filtro de rango agregado exitosamente:', columna);
        },
        error: (err) => {
          console.error('Error al agregar filtro de rango:', err);
        },
      });
  }

  // Eliminar un filtro
  eliminarFiltro(columna: string, tipoFiltro: string): void {
    this.excelService.eliminarFiltro(columna, tipoFiltro).subscribe();
  }

  // Limpiar todos los filtros
  limpiarFiltros(): void {
    this.excelService.limpiarFiltros().subscribe({
      next: () => {
        console.log('Todos los filtros han sido limpiados exitosamente');
      },
      error: (err) => {
        console.error('Error al limpiar filtros:', err);
      },
    });
  }
}

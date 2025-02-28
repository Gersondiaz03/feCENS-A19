import { signal, computed, effect } from '@angular/core';
import { tap, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Interfaces para tipar adecuadamente
export interface ColumnasResponse {
  columnas_disponibles: string[];
}

export interface ColumnaSeleccionadaResponse {
  columnas_seleccionadas: string[];
}

export interface FiltroResponse {
  mensaje: string;
  filtros_guardados: FiltroGuardado[];
}

export interface FiltroGuardado {
  [columna: string]: {
    completitud: boolean | any;
    validez: boolean | any;
    duplicidad: boolean | any;
    conformidad: boolean | { valorEsperado: any } | false;
    lista: boolean | { valoresPermitidos: any[] } | false;
    rango: boolean | { min: number; max: number } | false;
  };
}

export interface ErrorResponse {
  error: string;
}

export interface EjecucionResponse {
  mensaje: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  private backendUrl = 'http://localhost:3000';

  // Definición de signals
  private _dataframeColumnas = signal<string[]>([]);
  private _columnaSeleccionadas = signal<string[]>([]);
  private _filtrosGuardados = signal<FiltroGuardado[]>([]);
  private _error = signal<string | null>(null);
  private _mensajeExito = signal<string | null>(null);
  private _cargando = signal<boolean>(false);

  // Getters públicos de los signals
  readonly columnas = computed(() => this._dataframeColumnas());
  readonly seleccionadas = computed(() => this._columnaSeleccionadas());
  readonly filtros = computed(() => this._filtrosGuardados());
  readonly error = computed(() => this._error());
  readonly mensajeExito = computed(() => this._mensajeExito());
  readonly cargando = computed(() => this._cargando());

  constructor(private http: HttpClient) {}

  // Reset de mensajes de estado
  private resetMessages(): void {
    this._error.set(null);
    this._mensajeExito.set(null);
  }

  // Métodos para interactuar con la API

  // Endpoint: /home (POST) - Cargar archivo Excel
  cargarArchivo(archivo: File) {
    this.resetMessages();
    this._cargando.set(true);

    const formData = new FormData();
    formData.append('file', archivo);

    return this.http
      .post<ColumnasResponse>(`${this.backendUrl}/home`, formData)
      .pipe(
        tap((response) => {
          this._dataframeColumnas.set(response.columnas_disponibles);
          this._mensajeExito.set('Archivo cargado correctamente');
          this._cargando.set(false);
        }),
        catchError((err) => {
          this._error.set(err.error?.error || 'Error al cargar el archivo');
          this._cargando.set(false);
          return throwError(() => err);
        })
      );
  }

  seleccionarColumnas(columnas: string[]) {
    this.resetMessages();
    this._cargando.set(true);

    return this.http
      .post<ColumnaSeleccionadaResponse>(`${this.backendUrl}/dataframe`, {
        columnas,
      })
      .pipe(
        tap((response) => {
          this._columnaSeleccionadas.set(response.columnas_seleccionadas);
          this._mensajeExito.set('Columnas seleccionadas correctamente');
          this._cargando.set(false);
        }),
        catchError((err) => {
          this._error.set(err.error?.error || 'Error al seleccionar columnas');
          this._cargando.set(false);
          return throwError(() => err);
        })
      );
  }

  // Endpoint: /filtro/completitud (POST)
  agregarFiltroCompletitud(columna: string) {
    this.resetMessages();
    this._cargando.set(true);

    return this.http
      .post<FiltroResponse>(`${this.backendUrl}/filtro/completitud`, {
        columna,
      })
      .pipe(
        tap((response) => {
          this._filtrosGuardados.set(response.filtros_guardados);
          this._mensajeExito.set(response.mensaje);
          this._cargando.set(false);
        }),
        catchError((err) => {
          this._error.set(
            err.error?.error || 'Error al agregar filtro de completitud'
          );
          this._cargando.set(false);
          return throwError(() => err);
        })
      );
  }

  // Endpoint: /filtro/validez (POST)
  agregarFiltroValidez(columna: string) {
    this.resetMessages();
    this._cargando.set(true);

    return this.http
      .post<FiltroResponse>(`${this.backendUrl}/filtro/validez`, { columna })
      .pipe(
        tap((response) => {
          this._filtrosGuardados.set(response.filtros_guardados);
          this._mensajeExito.set(response.mensaje);
          this._cargando.set(false);
        }),
        catchError((err) => {
          this._error.set(
            err.error?.error || 'Error al agregar filtro de validez'
          );
          this._cargando.set(false);
          return throwError(() => err);
        })
      );
  }

  // Endpoint: /filtro/duplicidad (POST)
  agregarFiltroDuplicidad(columna: string) {
    this.resetMessages();
    this._cargando.set(true);

    return this.http
      .post<FiltroResponse>(`${this.backendUrl}/filtro/duplicidad`, { columna })
      .pipe(
        tap((response) => {
          this._filtrosGuardados.set(response.filtros_guardados);
          this._mensajeExito.set(response.mensaje);
          this._cargando.set(false);
        }),
        catchError((err) => {
          this._error.set(
            err.error?.error || 'Error al agregar filtro de duplicidad'
          );
          this._cargando.set(false);
          return throwError(() => err);
        })
      );
  }

  // Endpoint: /filtro/conformidad (POST)
  agregarFiltroConformidad(columna: string, valorEsperado: any) {
    console.log('Columna seleccionada:', columna); // Agrega esta línea
    this.resetMessages();
    this._cargando.set(true);

    return this.http
      .post<FiltroResponse>(`${this.backendUrl}/filtro/conformidad`, {
        columna,
        valorEsperado,
      })
      .pipe(
        tap((response) => {
          this._filtrosGuardados.set(response.filtros_guardados);
          this._mensajeExito.set(response.mensaje);
          this._cargando.set(false);
        }),
        catchError((err) => {
          this._error.set(
            err.error?.error || 'Error al agregar filtro de conformidad'
          );
          this._cargando.set(false);
          return throwError(() => err);
        })
      );
  }

  // Endpoint: /filtro/lista (POST)
  agregarFiltroLista(columna: string, valoresPermitidos: any[]) {
    this.resetMessages();
    this._cargando.set(true);

    return this.http
      .post<FiltroResponse>(`${this.backendUrl}/filtro/lista`, {
        columna,
        valoresPermitidos,
      })
      .pipe(
        tap((response) => {
          this._filtrosGuardados.set(response.filtros_guardados);
          this._mensajeExito.set(response.mensaje);
          this._cargando.set(false);
        }),
        catchError((err) => {
          this._error.set(
            err.error?.error || 'Error al agregar filtro de lista'
          );
          this._cargando.set(false);
          return throwError(() => err);
        })
      );
  }

  // Endpoint: /filtro/rango (POST)
  agregarFiltroRango(columna: string, min: number, max: number) {
    this.resetMessages();
    this._cargando.set(true);

    return this.http
      .post<FiltroResponse>(`${this.backendUrl}/filtro/rango`, {
        columna,
        min,
        max,
      })
      .pipe(
        tap((response) => {
          this._filtrosGuardados.set(response.filtros_guardados);
          this._mensajeExito.set(response.mensaje);
          this._cargando.set(false);
        }),
        catchError((err) => {
          this._error.set(
            err.error?.error || 'Error al agregar filtro de rango'
          );
          this._cargando.set(false);
          return throwError(() => err);
        })
      );
  }

  // Endpoint: /filtro (DELETE) - Eliminar filtro específico
  eliminarFiltro(columna: string, tipoFiltro: string) {
    this.resetMessages();
    this._cargando.set(true);

    return this.http
      .delete<FiltroResponse>(`${this.backendUrl}/filtro`, {
        body: { columna, tipoFiltro },
      })
      .pipe(
        tap((response) => {
          this._filtrosGuardados.set(response.filtros_guardados);
          this._mensajeExito.set(response.mensaje);
          this._cargando.set(false);
        }),
        catchError((err) => {
          this._error.set(err.error?.error || 'Error al eliminar filtro');
          this._cargando.set(false);
          return throwError(() => err);
        })
      );
  }

  // Endpoint: /filtros (DELETE) - Limpiar todos los filtros
  limpiarFiltros() {
    this.resetMessages();
    this._cargando.set(true);

    return this.http
      .delete<EjecucionResponse>(`${this.backendUrl}/filtros`)
      .pipe(
        tap((response) => {
          this._filtrosGuardados.set([]);
          this._mensajeExito.set(response.mensaje);
          this._cargando.set(false);
        }),
        catchError((err) => {
          this._error.set(err.error?.error || 'Error al limpiar filtros');
          this._cargando.set(false);
          return throwError(() => err);
        })
      );
  }

  // Endpoint: /ejecutar-filtros (POST)
  ejecutarFiltros() {
    this.resetMessages();
    this._cargando.set(true);

    return this.http
      .post<EjecucionResponse>(`${this.backendUrl}/ejecutar-filtros`, {})
      .pipe(
        tap((response) => {
          this._mensajeExito.set(response.mensaje);
          this._cargando.set(false);
        }),
        catchError((err) => {
          // Extract the specific error message if available
          const errorMsg = err.error?.error || 'Error al ejecutar filtros';
          this._error.set(errorMsg);
          this._cargando.set(false);
          console.error('Error al ejecutar filtros:', err);
          return throwError(() => err);
        })
      );
  }

  // Método para actualizar un filtro manualmente (útil para componentes reactivos)
  actualizarFiltros(filtros: FiltroGuardado[]) {
    this._filtrosGuardados.set(filtros);
  }
}

import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.routes').then((m) => m.default),
  },
  {
    path: 'upload',
    loadChildren: () =>
      import('./components/upload/upload.routes').then((m) => m.default),
  },
  {
    path: 'column-selector',
    loadChildren: () =>
      import('./components/column-selector/column-selector.routes').then(
        (m) => m.default
      ),
  },
  {
    path: 'filter-config',
    loadChildren: () =>
      import('./components/filter-config/filter-config.routes').then(
        (m) => m.default
      ),
  },
  {
    path: 'loading',
    loadChildren: () =>
      import('./components/loading/loading.routes').then((m) => m.default),
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];

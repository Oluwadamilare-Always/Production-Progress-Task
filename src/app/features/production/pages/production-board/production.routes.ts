import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'production',
    pathMatch: 'full',
  },
  {
    path: 'production',
    loadChildren: () =>
      import(
        './features/production/pages/production-board/production.routes'
      ).then((m) => m.productionRoutes),
  },
];

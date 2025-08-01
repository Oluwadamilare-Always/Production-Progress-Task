import { Routes } from '@angular/router';

export const productionRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./production-board.component').then(
        (m) => m.ProductionBoardComponent,
      ),
  },
];

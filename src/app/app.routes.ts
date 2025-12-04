// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  // načítaj všetky tabs-routy (ako v učiteľových projektoch)
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.routes').then((m) => m.routes),
  },
  // detail karty
  {
    path: 'card/:id',
    loadComponent: () =>
      import('./card-detail/card-detail.page').then((m) => m.CardDetailPage),
  },
];
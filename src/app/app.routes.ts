import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/collection/collection.component').then((m) => m.CollectionComponent),
  },
  {
    path: 'our-story',
    loadComponent: () => import('./features/our-story/our-story').then((m) => m.OurStory),
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

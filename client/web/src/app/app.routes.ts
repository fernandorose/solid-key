import { Routes } from '@angular/router';
import { AuthComponent } from './solidkey/pages/auth/auth.component';
import { HomeComponent } from './solidkey/pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    title: 'solidkey',
    component: HomeComponent,
  },
  {
    path: 'auth',
    title: 'Auth',
    component: AuthComponent,
  },
];

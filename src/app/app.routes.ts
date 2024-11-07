import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'usuarios',
    loadComponent: () =>
      import('./components/usuarios/usuarios/usuarios.component').then(
        (m) => m.UsuariosComponent
      ),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/usuarios/form-admin/form-admin.component').then(
        (m) => m.FormAdminComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/bienvenida/bienvenida.component').then(
        (m) => m.BienvenidaComponent
      ),
  },
];

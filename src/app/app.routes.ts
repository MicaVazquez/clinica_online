import { Routes } from '@angular/router';
import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { animation } from '@angular/animations';
export const routes: Routes = [
  {
    path: 'paciente/mis-turnos',
    loadComponent: () =>
      import('./components/pacientes/mis-turnos/mis-turnos.component').then(
        (m) => m.MisTurnosComponent
      ),
  },
  {
    path: 'paciente/solicitar-turno',
    loadComponent: () =>
      import('./components/solicitar-turno/solicitar-turno.component').then(
        (m) => m.SolicitarTurnoComponent
      ),
  },
  {
    path: 'paciente/perfil-pac',
    loadComponent: () =>
      import('./components/pacientes/perfil-pac/perfil-pac.component').then(
        (m) => m.PerfilPacComponent
      ),
  },
  {
    path: 'paciente',
    loadComponent: () =>
      import(
        './components/pacientes/menu-paciente/menu-paciente.component'
      ).then((m) => m.MenuPacienteComponent),
  },
  {
    path: 'especialista',
    loadComponent: () =>
      import('./components/especialista/menu-esp/menu-esp.component').then(
        (m) => m.MenuEspComponent
      ),
  },
  {
    path: 'especialista/mis-pacientes',
    loadComponent: () =>
      import(
        './components/especialista/mis-pacientes/mis-pacientes.component'
      ).then((m) => m.MisPacientesComponent),
  },
  {
    path: 'especialista/mis-horarios',
    loadComponent: () =>
      import(
        './components/especialista/mis-horarios/mis-horarios.component'
      ).then((m) => m.MisHorariosComponent),
  },
  {
    path: 'especialista/mi-perfil',
    loadComponent: () =>
      import('./components/especialista/miperfil/miperfil.component').then(
        (m) => m.MiperfilComponent
      ),
  },
  {
    path: 'especialista/mis-turnos-esp',
    loadComponent: () =>
      import('./components/especialista/esp-turnos/esp-turnos.component').then(
        (m) => m.EspTurnosComponent
      ),
  },
  {
    path: 'usuarios/estadisticas',
    loadComponent: () =>
      import('./components/usuarios/estadisticas/estadisticas.component').then(
        (m) => m.EstadisticasComponent
      ),
  },
  {
    path: 'usuarios/turnos',
    loadComponent: () =>
      import('./components/usuarios/turnos/turnos.component').then(
        (m) => m.TurnosComponent
      ),
  },
  {
    path: 'usuarios/solicitar-turno-admin',
    loadComponent: () =>
      import(
        './components/usuarios/solicitar-turno-admin/solicitar-turno-admin.component'
      ).then((m) => m.SolicitarTurnoAdminComponent),
  },
  {
    path: 'usuarios/especialistas',
    loadComponent: () =>
      import(
        './components/usuarios/especialistas/especialistas.component'
      ).then((m) => m.EspecialistasComponent),
  },
  {
    path: 'usuarios/pacientes',
    loadComponent: () =>
      import('./components/usuarios/pacientes/pacientes.component').then(
        (m) => m.PacientesComponent
      ),
  },
  {
    path: 'usuarios/solicitar-turno',
    loadComponent: () =>
      import('./components/solicitar-turno/solicitar-turno.component').then(
        (m) => m.SolicitarTurnoComponent
      ),
  },
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
    data: { animation: 'login' },
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    data: { animation: 'register' },
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

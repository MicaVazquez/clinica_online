import { Component } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { Admin } from '../../../interfaces/admin';
import { AuthService } from '../../../services/auth.service';
import { NgIf } from '@angular/common';
import { FormAdminComponent } from '../../../pages/usuarios/form-admin/form-admin.component';
import { FormEspecialistaComponent } from '../../forms/form-especialista/form-especialista.component';
import { EspecialistasComponent } from '../especialistas/especialistas.component';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    NgIf,
    SidebarComponent,
    FormAdminComponent,
    FormEspecialistaComponent,
    EspecialistasComponent,
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent {
  public select: string = 'usuarios';
  public admin!: Admin;
  showFormAdmin: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}

  /**
   * En el OnInit cargo
   * los datos del administrador.
   */
  ngOnInit(): void {
    console.log('En el onInit');

    this.auth.getUserLogged().subscribe((usuario) => {
      console.log('Usuario: ', usuario);
      this.auth.esAdmin(usuario?.email!).subscribe((admin) => {
        if (admin) this.admin = admin as Admin;
        console.log('Admin: ', admin);
      });
    });
  }
  handleSalida(selector: string) {
    console.log('Selector recibido del hijo:', selector);
    // Aquí puedes ejecutar lógica adicional o navegación según el valor recibido
  }
  /**
   * Para navegar por
   * las rutas dependiendo
   * de la opcion que selecione
   * en el navbar.
   * @param $event
   */
  getSelect($event: string) {
    this.select = $event;
    console.log(this.select);
  }

  goTo(rute: string) {
    this.router.navigateByUrl('usuarios/' + rute);
  }

  onAddAdmin() {
    this.showFormAdmin = !this.showFormAdmin;
  }
}

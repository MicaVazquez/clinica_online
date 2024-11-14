import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  @Input() public rol: string = ''; //-->Para pasarle el rol,
  public activeRol!: string;
  constructor(private router: Router, private authSrv: AuthService) {}

  email!: any;
  redirigir(path: string) {
    this.router.navigateByUrl(path);
  }
  logout() {
    this.authSrv.logout();
    this.router.navigateByUrl('');
    this.email = '';
  }

  ngOnInit() {
    this.authSrv.getUserLogged().subscribe((user) => {
      if (user) {
        console.log('Usuario autenticado:', user);
        this.email = user.email;
        console.log(this.email);
        // Aquí puedes guardar la información del usuario o realizar acciones con ella
      } else {
        console.log('No hay usuario autenticado');
      }
    });
  }
  getRol(rol: string) {
    this.activeRol = rol;
  }
}

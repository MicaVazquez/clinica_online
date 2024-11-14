import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Especialista } from '../../../interfaces/especialista';
import { Router } from '@angular/router';
import { EspecialistaService } from '../../../services/especialista.service';
import { CurrentUserService } from '../../../services/current-user.service';
import { NgFor, NgIf } from '@angular/common';
import { DoctorPipe } from '../../../pipes/doctor.pipe';
import { FormatoDniPipe } from '../../../pipes/formato-dni.pipe';
import { Jornada } from '../../../interfaces/jornada';
import { JornadaComponent } from '../../jornada/jornada.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-miperfil',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DoctorPipe,
    FormatoDniPipe,
    JornadaComponent,
    MatButton,
    MatIcon,
  ],
  templateUrl: './miperfil.component.html',
  styleUrl: './miperfil.component.css',
})
export class MiperfilComponent {
  public especialista!: Especialista;

  constructor(
    private authService: AuthService,
    private router: Router,
    private especialistaService: EspecialistaService,
    private cUserService: CurrentUserService
  ) {}

  /**
   * En el OnInit
   * traigo al especialista para
   * luego mostrar su informacion.
   */
  ngOnInit(): void {
    this.authService.getUserLogged().subscribe((user) => {
      this.authService.esEspecialista(user?.email!).subscribe((esp) => {
        if (esp) this.especialista = esp as Especialista;

        console.log('Especialista ingresado: ', this.especialista);
      });
    });
  }
  goTo(url: string, accion: string): void {
    this.cUserService.accionHorarios = accion;
    this.router.navigateByUrl(url);
  }

  goBack(rute: string) {
    this.router.navigateByUrl('especialista' + rute);
  }
}

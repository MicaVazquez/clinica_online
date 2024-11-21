import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Paciente, PacienteService } from '../../../services/paciente.service';
import { NgIf } from '@angular/common';
import { FormatoDniPipe } from '../../../pipes/formato-dni.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Route, Router } from '@angular/router';
import { MiHistorialClinicoComponent } from '../mi-historial-clinico/mi-historial-clinico.component';

@Component({
  selector: 'app-perfil-pac',
  standalone: true,
  imports: [NgIf, MatButtonModule, MatIcon, MiHistorialClinicoComponent],
  templateUrl: './perfil-pac.component.html',
  styleUrl: './perfil-pac.component.css',
})
export class PerfilPacComponent {
  public paciente!: Paciente;

  constructor(
    private auth: AuthService,
    private pacienteService: PacienteService,
    private router: Router
  ) {}

  /**
   * Corroboro el usuario
   * logueado efectivamente
   * sea un paciente.
   */
  ngOnInit(): void {
    this.auth.getUserLogged().subscribe((user) => {
      this.auth.esPaciente(user?.email!).subscribe((pac) => {
        if (pac) {
          this.paciente = pac as Paciente; //-->Paso al paciente.
        }
      });
    });
  }

  goBack() {
    this.router.navigateByUrl('paciente');
  }
}

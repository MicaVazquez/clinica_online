import { Component } from '@angular/core';
import { PacienteService } from '../../../services/paciente.service';
import { NgFor, NgIf } from '@angular/common';
import { FormPacienteComponent } from '../../forms/form-paciente/form-paciente.component';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [NgIf, NgFor, FormPacienteComponent, MatButtonModule, MatIconModule],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css',
})
export class PacientesComponent {
  pacientes: any[] = []; // Array de pacientes
  pacienteSelect: any = null; // Paciente seleccionado
  public showFormComponent = false;
  isRegistrationSuccessful = false;
  showPacientes = true;
  constructor(public pacienteSrv: PacienteService, private router: Router) {}
  ngOnInit() {
    this.pacienteSrv
      .traer()
      .subscribe((pacientes) => (this.pacientes = pacientes));
  }
  onAddPacienteAdmin() {
    this.showFormComponent = !this.showFormComponent;
  }

  onRegistrationSuccess(success: boolean) {
    if (success) {
      this.isRegistrationSuccessful = true;
      this.pacienteSrv
        .traer()
        .subscribe((pacientes) => (this.pacientes = pacientes));
    }
  }
  goTo() {
    this.router.navigateByUrl('usuarios');
  }
}

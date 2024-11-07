import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { Router } from '@angular/router';
import { FormEspecialistaComponent } from '../forms/form-especialista/form-especialista.component';
import { FormPacienteComponent } from '../forms/form-paciente/form-paciente.component';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatCard, NgIf, FormPacienteComponent, FormEspecialistaComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  tipo_usuario: string = '';
  constructor(private router: Router) {}
  SeleccionarTipo(tipo_usuario: string) {
    this.tipo_usuario = tipo_usuario;
  }
  redirigir(path: string) {
    this.router.navigateByUrl(path);
    this.tipo_usuario = '';
  }
  mostrarComponente() {}
}

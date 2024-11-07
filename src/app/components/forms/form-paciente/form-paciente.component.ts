import { Component } from '@angular/core';
import Swal from 'sweetalert2';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';
import { PacienteService } from '../../../services/paciente.service';
import { NgIf } from '@angular/common';
import { TablaObraSocialComponent } from '../../tables/tabla-obra-social/tabla-obra-social.component';

export interface Usuario {
  email: string;
  clave: string;
}
export interface Paciente {
  nombre: string;
  apellido: string;
  edad: number;
  dni: number;
  obraSocial: string;
  email: string;
  img1: string;
  img2: string;
  idDoc: string;
}
@Component({
  selector: 'app-form-paciente',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, TablaObraSocialComponent],
  templateUrl: './form-paciente.component.html',
  styleUrl: './form-paciente.component.css',
})
export class FormPacienteComponent {
  private paciente: Paciente | undefined;
  private usuario!: Usuario;
  private archivo1: any;
  private archivo2: any;
  public isLoading: boolean = false;
  public form!: FormGroup;
  public siteKey: string = '6LcNGQIqAAAAAMPgoAeH7PKi6PLnAkWegpmhAcKq';
  public captcha: string = ''; //-->Para el captcha de google

  constructor(
    private fb: FormBuilder,
    private storageSrv: StorageService,
    private router: Router,
    private pacienteService: PacienteService,
    private authService: AuthService // private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(65)]],
      dni: [
        '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(8)],
      ],
      obra: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      imagen1: ['', [Validators.required]],
      imagen2: ['', [Validators.required]],
      // recaptcha: ['', Validators.required],
    });

    this.form.reset();
  }

  isValidField(field: string): boolean | null {
    return (
      this.form.controls[field].errors && this.form.controls[field].touched
    );
  }

  getFieldError(field: string): string | null {
    const control = this.form.controls[field];
    if (!control || !control.errors) {
      return null;
    }

    const errors = control.errors;
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres.`;
        case 'maxlength':
          return `Máximo ${errors['maxlength'].requiredLength} caracteres.`;
        case 'min':
          return `Como mínimo debe ser ${errors['min'].min}.`;
        case 'max':
          return `Como máximo debe ser ${errors['max'].max}.`;
      }
    }
    return null;
  }

  getObra(obra: string) {
    this.form.controls['obra'].setValue(obra);
  }

  uploadImageUno(foto: any) {
    this.archivo1 = foto.target.files[0];
  }

  uploadImageDos(foto: any) {
    this.archivo2 = foto.target.files[0];
  }
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log('invalid form');
      this.captcha = '';

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, complete todos los campos',
        confirmButtonText: 'Ok',
        confirmButtonColor: 'darkslategray', //-->Color del boton de confirmar
        background: 'antiquewhite', //-->Color de fondo
      });
      return;
    }

    const {
      nombre,
      apellido,
      edad,
      dni,
      obra,
      email,
      password,
      imagen1,
      imagen2,
    } = this.form.value;

    this.paciente = {
      nombre: nombre,
      apellido: apellido,
      edad: edad,
      dni: dni,
      obraSocial: obra,
      email: email,
      img1: imagen1,
      img2: imagen2,
      idDoc: '',
    } as Paciente;

    this.usuario = {
      email: email,
      clave: password,
    } as Usuario;

    //-->Mostrar el spinner
    this.isLoading = true;

    this.authService.register(this.usuario).then((res) => {
      if (res == null) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al crear cuenta',
          footer: 'El email ya fue registrado',
          background: 'antiquewhite', //-->Color de fondo
        });
      } else this.registerPaciente();
    });
  }

  async registerPaciente() {
    // this.spinner.show();

    try {
      const pathFile1 = await this.storageSrv.subirImg(this.archivo1);
      this.paciente!.img1 = pathFile1;
      const pathFile2 = await this.storageSrv.subirImg(this.archivo2);
      this.paciente!.img2 = pathFile2;

      await this.pacienteService.addPaciente(this.paciente!);
      this.form.reset();

      //-->Ocultar el spinner
      this.isLoading = false;

      Swal.fire({
        icon: 'success',
        title: 'Usuario registrado',
        text: 'Revise la casilla de mail para confirmar el registro!',
        showConfirmButton: false,
        background: 'antiquewhite', //-->Color de fondo
        timer: 1000,
      }).then(() => {
        // this.authService.logOut();
        // this.registrationSuccess.emit(true);
      });
    } catch (error) {
      console.error('Error during patient registration:', error);
    } finally {
      //-->Ocultar el spinner en caso de error
      this.isLoading = false;
    }
  }
}

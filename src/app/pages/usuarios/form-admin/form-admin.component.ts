import { Component } from '@angular/core';
import { Usuario } from '../../../interfaces/usuario';
import { Admin } from '../../../interfaces/admin';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';
import { AdminService } from '../../../services/admin.service';
import { CurrentUserService } from '../../../services/current-user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { trigger } from '@angular/animations';

@Component({
  selector: 'app-form-admin',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './form-admin.component.html',
  styleUrl: './form-admin.component.css',
})
export class FormAdminComponent {
  private file: any;
  private user!: Usuario;
  private admin!: Admin;
  public isLoading: boolean = false; //-->Para mostrar el spinner
  public form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private imagenService: StorageService,
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(65)]],
      dni: [
        '',
        [Validators.required, Validators.minLength(7), Validators.maxLength(8)],
      ],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      imagen1: ['', [Validators.required]],
    });
  }

  uploadImage(file: any) {
    this.file = file.target.files[0];
  }

  /**
   Me permitira reiniciar 
   el formulario de registro.
  */
  ngOnInit(): void {
    this.form.reset();
  }

  //-->Para validar el ingreso de datos

  /**
   * Para corroborar si el ingreso
   * del input es correcto.
   * @param field
   * @returns
   */
  isValidField(field: string): boolean | null {
    return (
      this.form.controls[field].errors && this.form.controls[field].touched
    );
  }

  /**
   * Si el ingreso es erroneo,
   * lanzo un msj.
   * @param field
   * @returns
   */

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
          return `Minimo ${errors!['minlength'].requiredLength} caracteres.`;
        case 'maxlength':
          return `Maximo ${errors!['maxlength'].requiredLength} caracteres.`;
        case 'min':
          return `Como minimo debe ser ${errors!['min'].min}.`;
        case 'max':
          return `Como maximo debe ser ${errors!['max'].max}.`;
      }
    }
    return null;
  }
  /**
   * Me permitira guardar un
   * nuevo administrador si
   * funciona.
   * @returns
   */
  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log('invalid form');
      return;
    }

    this.admin = this.form.value;
    const { nombre, apellido, edad, dni, email, password, img1 } =
      this.form.value;

    //-->Creo al Admin
    this.admin = {
      nombre: nombre,
      apellido: apellido,
      edad: edad,
      dni: dni,
      email: email,
      img: img1,
      idDoc: '',
    } as Admin;

    //--> Creo su Usuario
    this.user = {
      email: email,
      clave: password,
    } as Usuario;

    //-->Mostrar el spinner
    this.isLoading = true;

    //--> Voy a registrarlo:
    this.authService.registerAdmin(this.user).then(async (res) => {
      if (!res) {
        //-->Ocultar el spinner
        this.isLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al crear cuenta',
        });

        this.form.reset();
      } else {
        await this.authService.loginWithAuth(this.user.email, this.user.clave); //-->Lo loggueo

        this.imagenService.subirImg(this.file).then((path) => {
          this.admin!.img = path;
          this.adminService.addAdmin(this.admin!).then(() => {
            this.form.reset(); //-->Reseteo el formulario.

            //-->Ocultar el spinner
            this.isLoading = false;

            Swal.fire({
              icon: 'success',
              title: 'Admin registrado',
            });
          });
        });
      }
    });
  }
}

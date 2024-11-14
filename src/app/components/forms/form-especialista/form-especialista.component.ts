import { Component } from '@angular/core';
import { Especialista } from '../../../interfaces/especialista';
import { Usuario } from '../form-paciente/form-paciente.component';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { FormArray } from '@angular/forms';
import { EspecialistaService } from '../../../services/especialista.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgIf } from '@angular/common';
import { TablaEspecialidadComponent } from '../../tables/tabla-especialidad/tabla-especialidad.component';
import { RecaptchaModule, RecaptchaV3Module } from 'ng-recaptcha-2';
import { CaptchaPropioComponent } from '../../captcha-propio/captcha-propio.component';
import { Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-form-especialista',
  standalone: true,
  imports: [
    TablaEspecialidadComponent,
    ReactiveFormsModule,
    NgIf,
    RecaptchaModule,
    RecaptchaV3Module,
    CaptchaPropioComponent,
  ],
  templateUrl: './form-especialista.component.html',
  styleUrl: './form-especialista.component.css',
})
export class FormEspecialistaComponent {
  private especialista: Especialista | undefined;
  public siteKey: string = '6LcNGQIqAAAAAMPgoAeH7PKi6PLnAkWegpmhAcKq';
  public captcha: string = '';
  private user!: Usuario;
  private file: any;
  public form: FormGroup;
  @Output() registrationSuccess = new EventEmitter<boolean>();
  @Input() isAdmin: boolean = false;
  @ViewChild('captcha') captchaComponent!: CaptchaPropioComponent;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private imagenService: StorageService,
    private especilistaSrv: EspecialistaService,
    private spinner: NgxSpinnerService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(65)]],
      dni: [
        '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(8)],
      ],
      especialidad: this.fb.array([], [Validators.required]),
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      img: ['', [Validators.required]],
      // recaptcha: ['', Validators.required],
    });
  }
  get especialidad() {
    return this.form.get('especialidad') as FormArray;
  }

  ngOnInit(): void {
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
        case 'requiredTrue':
          return 'Debe aceptar los terminos y condiciones';
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
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log('invalid form');
      this.captcha = '';
      return;
    }

    console.log(this.form.value);
    this.especialista = this.form.value;
    const { nombre, apellido, edad, dni, especialidad, email, password, img } =
      this.form.value;
    this.especialista = {
      nombre: nombre,
      apellido: apellido,
      edad: edad,
      dni: dni,
      especialidad: especialidad,
      email: email,
      img: img,
      active: false,
      idDoc: '',
    } as Especialista;

    this.user = {
      email: email,
      clave: password,
    } as Usuario;

    this.auth.register(this.user).then((res) => {
      if (res == null) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al crear cuenta',
          footer: 'El email ya fue registrado',
        });
      } else {
        this.imagenService.subirImg(this.file).then((path) => {
          this.especialista!.img = path;
          this.especilistaSrv
            .agregarEspecialista(this.especialista!)
            .then(() => {
              this.form.reset();
              this.auth.logout();
              this.spinner.show();

              setTimeout(() => {
                /** spinner ends after 5 seconds */
                this.spinner.hide();
                Swal.fire({
                  position: 'bottom-end',
                  icon: 'success',
                  title: 'Usuario registrado',
                  footer: 'Recuerde verificar su email',
                  showConfirmButton: false,
                  timer: 1500,
                }).then(() => this.router.navigate(['/login']));
              }, 1000);
            });
        });
      }
    });
  }

  getEspecialidad(especialidad: string) {
    const existe = this.elementoExisteEnFormArray(especialidad);
    if (existe === false) {
      this.especialidad.push(
        this.fb.control(especialidad, [Validators.required])
      );
    } else {
      this.especialidad.removeAt(existe);
    }
  }

  elementoExisteEnFormArray(valor: string) {
    const formArray = this.form.get('especialidad') as FormArray;

    for (let i = 0; i < formArray.length; i++) {
      if (formArray.at(i).value === valor) {
        return i;
      }
    }
    return false;
  }

  uploadImage(foto: any) {
    this.file = foto.target.files[0];
  }
}

import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Paciente, PacienteService } from '../../services/paciente.service';
import { AuthService } from '../../services/auth.service';
import { CurrentUserService } from '../../services/current-user.service';
import { TurnoService } from '../../services/turno.service';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import {
  DatoDinamico,
  HistoriaClinica,
} from '../../interfaces/historia-clinica';
import Swal from 'sweetalert2';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-cargar-historial',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule, NgFor],
  templateUrl: './cargar-historial.component.html',
  styleUrl: './cargar-historial.component.css',
})
export class CargarHistorialComponent {
  @Output() public turnoHistorial = new EventEmitter<boolean>();
  public form!: FormGroup;

  public idPaciente!: string;
  public paciente!: Paciente;
  public emailEspecialista!: string;
  public historial!: HistoriaClinica;
  public datoDinamico!: DatoDinamico;
  public clave: FormControl = new FormControl('', [Validators.required]);
  public valor: FormControl = new FormControl('', [Validators.required]);
  public claves: string[] = [];

  //////////////////////////////////////// CTOR & ONINIT ////////////////////////////////////////
  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private authService: AuthService,
    private cUserService: CurrentUserService,
    private turnoService: TurnoService,
    private historiaClinicaService: HistoriaClinicaService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      altura: [
        '',
        [Validators.required, Validators.min(1), Validators.max(300)],
      ],
      peso: ['', [Validators.required, Validators.min(1), Validators.max(270)]],
      temperatura: [
        '',
        [Validators.required, Validators.min(30), Validators.max(50)],
      ],
      presion: [
        '',
        [Validators.required, Validators.min(80), Validators.max(130)],
      ],
      datos: this.fb.array([], [Validators.maxLength(3)]),
    });
    this.authService
      .getUserLogged()
      .subscribe((user) => (this.emailEspecialista = user?.email!));
    this.idPaciente = this.cUserService.idPacienteHistorial;
    this.pacienteService
      .traerPacientePorId(this.idPaciente)
      .subscribe((pac) => (this.paciente = pac));
  }
  //////////////////////////////////////// METODOS ////////////////////////////////////////
  /**
   * Para obtener los
   * datos dinamicos.
   */
  get datos() {
    return this.form.get('datos') as FormArray;
  }

  onDeleteDatos(i: number): void {
    this.datos.removeAt(i);
    this.claves.slice(i, 1);
  }

  /**
   * Para el uso de datos
   * dinamicos.
   * @returns
   */
  onAddDatos(): void {
    if (this.clave.invalid) return;
    if (this.valor.invalid) return;

    this.datoDinamico = {
      [this.clave.value]: this.valor.value,
    };

    this.claves.push(this.clave.value);
    this.datos.push(this.fb.control(this.datoDinamico, [Validators.required]));

    //-->REseteo
    this.clave.reset();
    this.valor.reset();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    //-->Cargo el historial:
    this.historial = {
      altura: this.form.value['altura'],
      peso: this.form.value['peso'],
      temperatura: this.form.value['temperatura'],
      presion: this.form.value['presion'],
      datos: this.form.value['datos'],
      emailEspecialista: this.emailEspecialista,
      emailPaciente: this.paciente.email,
      especialidad: this.cUserService.turno.especialidad,
    };

    //-->Agrego el historial:
    this.historiaClinicaService.addHistorialClinicoPorID(
      this.historial,
      this.idPaciente
    );
    (this.form.controls['datos'] as FormArray) = this.fb.array([]);
    this.form.reset();

    Swal.fire({
      icon: 'success',
      title: 'Historia Clinica Generada!',
      confirmButtonText: 'Ok',
      confirmButtonColor: 'darkslategray', //-->Color del boton de confirmar
      background: 'antiquewhite', //-->Color de fondo
    }).then(() => {
      //-->Actualizo los turnos con su historial:
      this.cUserService.turno.historialClinico = true;
      const turno = this.cUserService.turno;
      turno.historialClinico = true;

      this.turnoService.updateTurno(turno);
      this.turnoHistorial.emit(false);
    });
  }

  /**
   * Para cancelar la historia
   * clinica.
   */
  onCancel(): void {
    this.turnoHistorial.emit(false);
  }
  //////////////////////////////////////// VALIDACION DE FORMULARIOS ////////////////////////////////////////
  isValidField(field: string): boolean | null {
    return (
      this.form.controls[field].errors && this.form.controls[field].touched
    );
  }

  isValidFieldInArray(array: FormArray, i: number): boolean | null {
    return array.controls[i].errors && array.controls[i].touched;
  }

  getFieldError(field: string): string | null {
    if (!this.form.controls[field] && !this.form.controls[field]) return null;

    const errors = this.form.controls[field].errors;
    for (const key of Object.keys(errors!)) {
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
}

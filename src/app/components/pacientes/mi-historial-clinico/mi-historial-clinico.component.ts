import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Paciente, PacienteService } from '../../../services/paciente.service';
import {
  DatoDinamico,
  HistoriaClinica,
} from '../../../interfaces/historia-clinica';
import { Especialista } from '../../../interfaces/especialista';
import { HistoriaClinicaService } from '../../../services/historia-clinica.service';
import { AuthService } from '../../../services/auth.service';
import { EspecialistaService } from '../../../services/especialista.service';
import Swal from 'sweetalert2';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgFor, NgIf } from '@angular/common';
import { DoctorPipe } from '../../../pipes/doctor.pipe';
import { jsPDF } from 'jspdf';
import { FormsModule } from '@angular/forms';

interface Dato {
  [key: string]: any; // Esto permite cualquier clave, pero puedes especificar tipos más estrictos si conoces la estructura
}
@Component({
  selector: 'app-mi-historial-clinico',
  standalone: true,
  imports: [MatProgressSpinnerModule, NgIf, NgFor, DoctorPipe, FormsModule],
  templateUrl: './mi-historial-clinico.component.html',
  styleUrl: './mi-historial-clinico.component.css',
})
export class MiHistorialClinicoComponent {
  ////////////////////////////////////////////// ATRIBUTOS //////////////////////////////////////////////
  @Input() paciente!: Paciente; //-->El paciente.
  public historialClinico: HistoriaClinica[] = [];
  public especialistas: Especialista[] = [];
  public isLoading: boolean = false;
  public especialista!: Especialista;

  public especialistasFiltrados: Especialista[] = [];
  public especialistaSeleccionado: string = 'todos';

  public historialMostrar: HistoriaClinica[] = [];
  ////////////////////////////////////////////// CTOR & ONINIT //////////////////////////////////////////////
  constructor(
    private historiaClinicaService: HistoriaClinicaService,
    private authService: AuthService,
    private pacienteService: PacienteService,
    private especialistaService: EspecialistaService,
    private cdRef: ChangeDetectorRef
  ) {}

  /**
   * En el Oninit verifico
   * que el usuario recibido sea
   * un paciente loggueado y me
   * traigo su historial clinico
   * por ID. Ademas traigo a los especialistas.
   */
  ngOnInit(): void {
    this.authService.getUserLogged().subscribe((usuario) => {
      this.isLoading = true;
      this.authService.esPaciente(usuario?.email!).subscribe((paciente) => {
        if (paciente) {
          this.paciente = paciente as Paciente;
          console.log('Paciente encontrado: ', this.paciente); // Log para verificar el paciente
          this.historiaClinicaService
            .traerHistorialClinicoPorID(this.paciente.idDoc)
            .subscribe(
              (historiales) => {
                this.historialClinico = historiales;
                console.log('Historial: ', historiales); // Log para verificar los historiales
                if (this.historialClinico.length > 0) {
                  //-->para cargar el select
                  this.onFiltrarEspecialistasHistoriaClinica();
                  this.historialMostrar = [...this.historialClinico]; // Hacer una copia para evitar mutaciones inesperadas

                  console.log('Historial clínico cargado.');
                } else {
                  console.log('No hay historiales clínicos.');
                }
                this.isLoading = false; //--> Asegúrate de que se actualiza aquí
                this.cdRef.detectChanges(); //-->Fuerza la detección de cambios
              },
              (error) => {
                console.error('Error al traer historiales: ', error); // Log para errores
                this.isLoading = false; //--> Asegúrate de que se actualiza aquí también
              }
            );
        }
      });
    });
    this.especialistaService
      .traer()
      .subscribe((data) => (this.especialistas = data));
  }

  ////////////////////////////////////////////// METODOS //////////////////////////////////////////////
  getEspecialista(email: string): { nombre: string; apellido: string } | null {
    for (const esp of this.especialistas) {
      if (esp.email === email) {
        this.especialista = esp;
        return { nombre: esp.nombre, apellido: esp.apellido };
      }
    }
    return null;
  }

  onFiltrarEspecialistasHistoriaClinica() {
    const emailsEspecialistas = this.historialClinico.map(
      (historia) => historia.emailEspecialista
    );
    this.especialistasFiltrados = this.especialistas.filter((esp) =>
      emailsEspecialistas.includes(esp.email)
    );
  }

  /**
   * Me permitira obtener la key
   * del dato dinamico.
   * @param dato el dato dinamico
   * @returns retorna la key del dato
   */
  sacarKey(dato: DatoDinamico) {
    return Object.keys(dato)[0];
  }
  ////////////////////////////////////////////// GENERAR PDF //////////////////////////////////////////////
  onGenerarPdfHistorial() {
    if (this.historialClinico.length > 0) {
      let date = new Date(Date.now());
      const margins = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      };

      const doc = new jsPDF();
      const imgWidth = 30;
      const imgHeight = 30;
      const textX = margins.left + imgWidth + 10;

      doc.addImage(
        '/logo-clinica.png',
        'PNG',
        margins.left,
        margins.top,
        imgWidth,
        imgHeight
      );
      doc.setFontSize(22);
      doc.setFont('Times');
      doc.text('Clinica Online', textX, margins.top + imgHeight / 2 + 6);

      const newSubtitulo = margins.top + imgHeight + 20;
      doc.setFontSize(18);
      doc.text(
        `Informe del Paciente ${this.paciente.nombre} ${this.paciente.apellido}
      \n Fecha: ${date.toLocaleDateString()}`,
        margins.left,
        newSubtitulo
      );

      const historiales = this.formatearHistoriales();
      let y = newSubtitulo + 30;

      for (const h of historiales) {
        y = this.addHistorialToPDF(
          doc,
          h,
          margins.left,
          y,
          doc.internal.pageSize.height - margins.bottom
        );
      }

      doc.save(
        `historia-clinica-${this.paciente.nombre}-${this.paciente.apellido}.pdf`
      );
    } else {
      Swal.fire({
        title: 'No es posible descargar.',
        text: 'Aún no tiene un historial clinico generado.',
        icon: 'error',
        background: 'antiquewhite',
      });
    }
  }

  getEspecialistaNombre(email: string): string {
    const esp = this.especialistas.find((e) => e.email === email);
    return esp ? `${esp.nombre} ${esp.apellido}` : '';
  }

  private formatearHistoriales() {
    const historialesFomateados = [];
    for (const his of this.historialClinico) {
      if (
        this.especialistaSeleccionado === 'todos' ||
        his.emailEspecialista === this.especialistaSeleccionado
      ) {
        historialesFomateados.push(this.historiaToPDF(his));
      }
    }
    return historialesFomateados;
  }

  private historiaToPDF(historial: HistoriaClinica): string[] {
    const esp = this.getEspecialista(historial.emailEspecialista);
    const pdf = [
      `Especialista: ${'Dr. ' + esp?.nombre + ' ' + esp?.apellido}`,
      `Especialidad: ${historial.especialidad}`,
      `Altura: ${historial.altura}`,
      `Peso: ${historial.peso}`,
      `Temperatura: ${historial.temperatura}`,
      `Presion: ${historial.presion}`,
    ];

    for (const dato of historial.datos) {
      const key = this.sacarKey(dato);
      pdf.push(`${key}: ${dato[key]}`);
    }

    return pdf;
  }

  private addHistorialToPDF(
    doc: jsPDF,
    historial: string[],
    x: number,
    y: number,
    pageHeight: number
  ): number {
    const lineHeight = 10;

    historial.forEach((line, index) => {
      if (y + lineHeight > pageHeight) {
        doc.addPage();
        y = 10;
      }

      if (index === 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
      }
      doc.text(line, x, y);
      y += lineHeight;
    });

    return y;
  }

  //////////////////////////////////////////// FILTRADO ////////////////////////////////////////////

  contieneSubcadenaIgnoreCase(
    cadenaPrincipal: any,
    subcadena: string
  ): boolean {
    if (typeof cadenaPrincipal !== 'string') {
      cadenaPrincipal = String(cadenaPrincipal);
    }
    return cadenaPrincipal.toLowerCase().includes(subcadena.toLowerCase());
  }

  contieneSubcadenaIgnoreCaseDatos(
    datos: DatoDinamico[],
    subcadena: string
  ): boolean {
    return datos.some((dato) =>
      Object.keys(dato).some(
        (key) =>
          this.contieneSubcadenaIgnoreCase(key, subcadena) ||
          this.contieneSubcadenaIgnoreCase(dato[key], subcadena)
      )
    );
  }

  onFiltrarHistorial(event: any): void {
    const valor = event.target.value;

    if (valor === '') {
      this.historialMostrar = [...this.historialClinico];
    } else {
      this.historialMostrar = this.historialClinico.filter(
        (hist) =>
          this.contieneSubcadenaIgnoreCase(hist.altura, valor) ||
          this.contieneSubcadenaIgnoreCase(hist.emailEspecialista, valor) ||
          this.contieneSubcadenaIgnoreCase(hist.peso, valor) ||
          this.contieneSubcadenaIgnoreCase(hist.especialidad, valor) ||
          this.contieneSubcadenaIgnoreCase(hist.presion, valor) ||
          this.contieneSubcadenaIgnoreCase(hist.temperatura, valor) ||
          this.contieneSubcadenaIgnoreCaseDatos(hist.datos, valor)
      );
      console.log(valor);
    }
    this.cdRef.detectChanges();
  }

  // En el componente TypeScript
  getObservaciones(historiaClinica: any) {
    return historiaClinica?.datos
      .map(
        (dato: Dato) => `${this.sacarKey(dato)}: ${dato[this.sacarKey(dato)]}`
      )
      .join(', ');
  }
}

import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { registerables } from 'chart.js/auto';
import { AuthService } from '../../../services/auth.service';
import 'chartjs-adapter-date-fns';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { TurnoService } from '../../../services/turno.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { GraficoPorDiasComponent } from '../../graficos/grafico-por-dias/grafico-por-dias.component';
@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    GraficoPorDiasComponent,
  ],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css',
})
export class EstadisticasComponent {
  logs: any[] = [];
  turnos: any[] = [];

  @ViewChild('chart') chart!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private turnosSrv: TurnoService
  ) {
    Chart.register(...registerables);
  }

  renderChart(): void {
    const especialidades = this.turnos
      .map((turno) => turno.especialidad)
      .flat();
    const counts: { [key: string]: number } = {};

    especialidades.forEach((especialidad) => {
      counts[especialidad] = (counts[especialidad] || 0) + 1;
    });

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    const ctx = this.chart.nativeElement.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Cantidad de Turnos por Especialidad',
              data: data,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }
  ngOnInit(): void {
    this.turnosSrv.traerTurnos().subscribe((turnos: any[]) => {
      this.turnos = turnos;
      this.renderChart();
    });
  }

  goTo() {
    this.router.navigateByUrl('usuarios');
  }
  private getColorBasedOnTime(): string {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor.padStart(6, '0')}`;
  }
  downloadAsPDF(): void {
    const chartElement = this.chart.nativeElement;

    // Obtener imagen base64 del gráfico
    html2canvas(chartElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // Crear documento PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Agregar imagen del logo
      const logoImg = new Image();
      logoImg.src = '/logo-clinica.png'; // Ruta a la imagen del logo
      pdf.addImage(logoImg, 'PNG', 15, 15, 30, 30); // Agregar logo al PDF

      // Agregar título de Clinitech
      pdf.setFontSize(18);
      pdf.text('Clinitech', 50, 30); // Posición del texto del título

      // Agregar título del informe
      pdf.setFontSize(16);
      pdf.text('Informe de Cantidad de Turnos por Especialidad', 15, 60); // Posición del texto del título del informe

      // Agregar imagen base64 del gráfico
      pdf.addImage(imgData, 'PNG', 15, 70, pdfWidth - 30, pdfHeight);

      // Guardar PDF
      pdf.save('grafico.pdf');
    });
  }
}

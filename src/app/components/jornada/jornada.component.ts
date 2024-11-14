import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { JornadaService } from '../../services/jornada.service';
import { Jornada } from '../../interfaces/jornada';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-jornada',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgFor,
    MatProgressSpinner,
    CommonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './jornada.component.html',
  styleUrl: './jornada.component.css',
})
export class JornadaComponent {
  public email!: string;
  public jornada!: Jornada;
  public selected: string = 'lunes';
  public isLoading: boolean = false; //-->Para mostrar el spinner

  constructor(
    private authService: AuthService,
    private jornadaService: JornadaService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.getUserLogged().subscribe((res) => {
      if (res) {
        this.email = res!.email as string;
        this.jornadaService.traerJornada(this.email).subscribe((jornada) => {
          this.jornada = jornada;
        });
      }
      this.isLoading = false;
    });
  }

  changeSelect(sel: string) {
    this.selected = sel;
  }
}

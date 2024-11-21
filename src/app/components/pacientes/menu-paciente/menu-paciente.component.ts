import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TraceCursorDirective } from '../../../directivas/trace-cursor.directive';

@Component({
  selector: 'app-menu-paciente',
  standalone: true,
  imports: [TraceCursorDirective],
  templateUrl: './menu-paciente.component.html',
  styleUrl: './menu-paciente.component.css',
})
export class MenuPacienteComponent {
  constructor(private router: Router) {}

  goTo(rute: string) {
    this.router.navigateByUrl('paciente/' + rute);
  }
}

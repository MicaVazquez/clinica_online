import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { TraceCursorDirective } from '../../../directivas/trace-cursor.directive';
@Component({
  selector: 'app-menu-esp',
  standalone: true,
  imports: [MatTabsModule, TraceCursorDirective],
  templateUrl: './menu-esp.component.html',
  styleUrl: './menu-esp.component.css',
})
export class MenuEspComponent {
  constructor(private router: Router) {}

  goTo(rute: string) {
    this.router.navigateByUrl('especialista/' + rute);
  }
}

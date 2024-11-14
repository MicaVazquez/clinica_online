import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-menu-esp',
  standalone: true,
  imports: [MatTabsModule],
  templateUrl: './menu-esp.component.html',
  styleUrl: './menu-esp.component.css',
})
export class MenuEspComponent {
  constructor(private router: Router) {}

  goTo(rute: string) {
    this.router.navigateByUrl('especialista/' + rute);
  }
}

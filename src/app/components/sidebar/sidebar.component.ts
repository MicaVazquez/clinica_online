import { Component } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatTabsModule } from '@angular/material/tabs';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatTabsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Output() salida = new EventEmitter<string>();

  constructor(private router: Router, private auth: AuthService) {}

  /**
   *
   * @param selector A donde quiera
   * ir.
   */
  opcion(selector: string) {
    this.salida.emit(selector);
  }

  logOut(): void {
    this.auth.logout();
    this.router.navigate(['']);
  }
}

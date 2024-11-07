import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [NgFor],
  templateUrl: './bienvenida.component.html',
  styleUrl: './bienvenida.component.css',
})
export class BienvenidaComponent {
  imagenesCentro = [
    { url: 'imagen1.jpg' },
    { url: 'imagen2.jpg' },
    { url: 'imagen3.jpg' },
    { url: 'imagen4.jpg' },
    { url: '/imagen5.jpg' },
    { url: '/imagen6.jpg' },
  ];
  constructor(private router: Router) {}
  redirigir(path: string) {
    this.router.navigateByUrl(path);
  }
}

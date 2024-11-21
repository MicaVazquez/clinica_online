import { Directive } from '@angular/core';
import { ElementRef, Input, Renderer2 } from '@angular/core';
@Directive({
  selector: '[appCambiarColorCard]',
  standalone: true,
})
export class CambiarColorCardDirective {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    const randomColor = this.getRandomColor();
    this.el.nativeElement.style.backgroundColor = randomColor;
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

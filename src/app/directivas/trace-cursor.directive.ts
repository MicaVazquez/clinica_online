import { Directive, HostListener, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[appTraceCursor]',
  standalone: true,
})
export class TraceCursorDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const span = this.renderer.createElement('span');
    this.renderer.setStyle(span, 'position', 'fixed');
    this.renderer.setStyle(span, 'top', `${event.clientY}px`);
    this.renderer.setStyle(span, 'left', `${event.clientX}px`);
    this.renderer.setStyle(span, 'width', '5px');
    this.renderer.setStyle(span, 'height', '5px');
    this.renderer.setStyle(span, 'background', 'blue');
    this.renderer.setStyle(span, 'pointer-events', 'none');
    this.renderer.setStyle(span, 'border-radius', '50%');
    this.renderer.setStyle(span, 'transition', 'transform 0.2s, opacity 0.2s');
    this.renderer.setStyle(span, 'z-index', '10000');
    this.renderer.appendChild(document.body, span);

    setTimeout(() => {
      this.renderer.setStyle(span, 'transform', 'scale(2)');
      this.renderer.setStyle(span, 'opacity', '0');
    }, 100);

    setTimeout(() => {
      this.renderer.removeChild(document.body, span);
    }, 200);
  }
}

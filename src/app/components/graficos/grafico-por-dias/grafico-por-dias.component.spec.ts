import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoPorDiasComponent } from './grafico-por-dias.component';

describe('GraficoPorDiasComponent', () => {
  let component: GraficoPorDiasComponent;
  let fixture: ComponentFixture<GraficoPorDiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoPorDiasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoPorDiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

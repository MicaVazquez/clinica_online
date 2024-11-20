import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarHistorialComponent } from './cargar-historial.component';

describe('CargarHistorialComponent', () => {
  let component: CargarHistorialComponent;
  let fixture: ComponentFixture<CargarHistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargarHistorialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargarHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

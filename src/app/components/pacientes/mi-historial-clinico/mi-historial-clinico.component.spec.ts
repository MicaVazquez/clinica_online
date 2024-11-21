import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiHistorialClinicoComponent } from './mi-historial-clinico.component';

describe('MiHistorialClinicoComponent', () => {
  let component: MiHistorialClinicoComponent;
  let fixture: ComponentFixture<MiHistorialClinicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiHistorialClinicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiHistorialClinicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspTurnosComponent } from './esp-turnos.component';

describe('EspTurnosComponent', () => {
  let component: EspTurnosComponent;
  let fixture: ComponentFixture<EspTurnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspTurnosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarTurnoAdminComponent } from './solicitar-turno-admin.component';

describe('SolicitarTurnoAdminComponent', () => {
  let component: SolicitarTurnoAdminComponent;
  let fixture: ComponentFixture<SolicitarTurnoAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitarTurnoAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitarTurnoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

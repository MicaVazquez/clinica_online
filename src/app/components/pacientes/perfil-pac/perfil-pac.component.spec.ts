import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilPacComponent } from './perfil-pac.component';

describe('PerfilPacComponent', () => {
  let component: PerfilPacComponent;
  let fixture: ComponentFixture<PerfilPacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilPacComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilPacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

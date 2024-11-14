import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuEspComponent } from './menu-esp.component';

describe('MenuEspComponent', () => {
  let component: MenuEspComponent;
  let fixture: ComponentFixture<MenuEspComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuEspComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuEspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

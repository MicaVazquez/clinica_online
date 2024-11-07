import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaObraSocialComponent } from './tabla-obra-social.component';

describe('TablaObraSocialComponent', () => {
  let component: TablaObraSocialComponent;
  let fixture: ComponentFixture<TablaObraSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaObraSocialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablaObraSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

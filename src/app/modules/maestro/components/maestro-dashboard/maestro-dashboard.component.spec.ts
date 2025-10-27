import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestroDashboardComponent } from './maestro-dashboard.component';

describe('MaestroDashboardComponent', () => {
  let component: MaestroDashboardComponent;
  let fixture: ComponentFixture<MaestroDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaestroDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaestroDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

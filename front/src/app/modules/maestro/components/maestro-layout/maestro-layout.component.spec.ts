import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestroLayoutComponent } from './maestro-layout.component';

describe('MaestroLayoutComponent', () => {
  let component: MaestroLayoutComponent;
  let fixture: ComponentFixture<MaestroLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaestroLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaestroLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictEnvComponent } from './predict-env.component';

describe('PredictComponent', () => {
  let component: PredictEnvComponent;
  let fixture: ComponentFixture<PredictEnvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictEnvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictEnvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

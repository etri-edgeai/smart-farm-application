import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictPestComponent } from './predict-pest.component';

describe('PredictPestComponent', () => {
  let component: PredictPestComponent;
  let fixture: ComponentFixture<PredictPestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PredictPestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PredictPestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

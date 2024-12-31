import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculadoraKcalPage } from './calculadora-kcal.page';

describe('CalculadoraKcalPage', () => {
  let component: CalculadoraKcalPage;
  let fixture: ComponentFixture<CalculadoraKcalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculadoraKcalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

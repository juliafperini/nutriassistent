import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MinhaEvolucaoPage } from './minha-evolucao.page';

describe('MinhaEvolucaoPage', () => {
  let component: MinhaEvolucaoPage;
  let fixture: ComponentFixture<MinhaEvolucaoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MinhaEvolucaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashUsuarioPage } from './dash-usuario.page';

describe('DashUsuarioPage', () => {
  let component: DashUsuarioPage;
  let fixture: ComponentFixture<DashUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

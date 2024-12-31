import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashAdmPage } from './dash-adm.page';

describe('DashAdmPage', () => {
  let component: DashAdmPage;
  let fixture: ComponentFixture<DashAdmPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashAdmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioProfesoresPage } from './inicio-profesores.page';

describe('InicioProfesoresPage', () => {
  let component: InicioProfesoresPage;
  let fixture: ComponentFixture<InicioProfesoresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioProfesoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

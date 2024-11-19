import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule
import { InicioAlumnosPage } from './inicio-alumnos.page';

describe('InicioAlumnosPage', () => {
  let component: InicioAlumnosPage;
  let fixture: ComponentFixture<InicioAlumnosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],  // Add HttpClientModule here
      declarations: [InicioAlumnosPage]
    }).compileComponents();

    fixture = TestBed.createComponent(InicioAlumnosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

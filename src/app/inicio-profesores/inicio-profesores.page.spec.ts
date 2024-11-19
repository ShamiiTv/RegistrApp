import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule if needed
import { InicioProfesoresPage } from './inicio-profesores.page';

describe('InicioProfesoresPage', () => {
  let component: InicioProfesoresPage;
  let fixture: ComponentFixture<InicioProfesoresPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],  // Add HttpClientModule here
      declarations: [InicioProfesoresPage]
    }).compileComponents();

    fixture = TestBed.createComponent(InicioProfesoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

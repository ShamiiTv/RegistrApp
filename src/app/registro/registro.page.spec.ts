import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { RegistroPage } from './registro.page';
import { AuthService } from '../auth.service'; // Adjust the import as needed


describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({   

      imports: [FormsModule, HttpClientModule], // Add FormsModule here
      providers: [AuthService] // Provide AuthService if needed
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();   

  });

  it('should create', () => {
    expect(component).toBeTruthy();   

  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms'; // Import FormsModule
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { LoginPage } from './login.page';
import { AuthService } from '../auth.service'; // Adjust the import as needed

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule], // Add HttpClientModule here
      providers: [AuthService] // Provide AuthService if needed
    });
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

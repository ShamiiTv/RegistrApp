import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../auth.service'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService
  ) {}

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async login() {
    if (!this.email || !this.password) {
      await this.presentAlert('Error', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }
  
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();
  
    try {
      const response = await this.authService.login(this.email, this.password).toPromise();
      console.log('Respuesta del servidor:', response); // Añade este registro para depuración
      await loading.dismiss();
      if (response.success) {
        this.router.navigate(['/home']);
      } else {
        await this.presentAlert('Error', 'Correo o contraseña incorrectos.');
      }
    } catch (error) {
      await loading.dismiss();
      await this.presentAlert('Error', 'Hubo un problema al iniciar sesión.');
      console.error('Error al iniciar sesión:', error);
    }
  }
}

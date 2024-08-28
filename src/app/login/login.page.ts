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
  
    // Mostrar un indicador de carga
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();
  
    try {
      const response = await this.authService.login(this.email, this.password).toPromise();
      await loading.dismiss();
  
      if (response.success) {
        // Guardar el tipo de usuario en el almacenamiento local
        localStorage.setItem('tipoUsuario', response.tipoUsuario);
  
        // Redirigir según el tipo de usuario
        if (response.tipoUsuario === 'profesor') {
          this.router.navigate(['/inicio-profesores']);  // Asegúrate de que el nombre coincida
        } else {
          this.router.navigate(['/inicio-alumnos']);  // Asegúrate de que el nombre coincida
        }
        
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

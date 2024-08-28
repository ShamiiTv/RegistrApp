import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  constructor(private router: Router,
              private alertController: AlertController
  ) {}

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Datos Invalido',
      subHeader: 'El usuario o la contraseña son incorrectos',
      buttons: ['Aceptar'],
    });
    await alert.present();
  }
  login() {
    if (this.email === 'usuario@ejemplo.com' && this.password === 'contraseña') {
      this.router.navigate(['/home']);
    } else {
      this.presentAlert();
    }
  }
}

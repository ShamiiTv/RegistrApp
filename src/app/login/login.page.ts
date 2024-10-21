import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, AnimationController } from '@ionic/angular';
import { Haptics } from '@capacitor/haptics';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements AfterViewInit {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isSubmitting: boolean = false;
  isOscuro: boolean = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private animationCtrl: AnimationController
  ) {}

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  ngAfterViewInit() {}

  async animarError(index: number) {
    await Haptics.vibrate();
    const inputElement = document.querySelectorAll("input")[index];
  
    if (inputElement) {
      this.animationCtrl.create()
        .addElement(inputElement)
        .duration(100)
        .iterations(3)
        .keyframes([
          { offset: 0, transform: "translateX(0px)", border: "1px transparent solid" },
          { offset: 0.25, transform: "translateX(-5px)", border: "1px red solid" },
          { offset: 0.50, transform: "translateX(0px)", border: "1px transparent solid" },
          { offset: 0.75, transform: "translateX(5px)", border: "1px red solid" },
          { offset: 1, transform: "translateX(0px)", border: "1px transparent solid" },
        ])
        .play();
    }
  }

  claroOscuro() {
    this.isOscuro = !this.isOscuro;
    localStorage.setItem('isOscuro', JSON.stringify(this.isOscuro));
  }

  ionViewWillEnter() {
    this.isOscuro = JSON.parse(localStorage.getItem('isOscuro') || 'false');
  }

  toggleSetting(setting: string) {
    switch (setting) {
      case 'darkMode':
        this.isOscuro = !this.isOscuro;
        break;
    }
    localStorage.setItem('isOscuro', JSON.stringify(this.isOscuro));
  }

  async login() {
    if (!this.email || !this.password) {
      await this.presentAlert('Error', 'Por favor, ingresa tu correo y contraseña.');
      if (!this.email) {
        await this.animarError(0);
      }
      if (!this.password) {
        await this.animarError(1);
      }
      return;
    }
  
    this.isSubmitting = true;
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();
  
    const storedUser = localStorage.getItem(this.email);
  
    if (storedUser) {
      const userData = JSON.parse(storedUser);
  
      if (userData.password === this.password) {
        localStorage.setItem('user', JSON.stringify(userData));
  
        await loading.dismiss();
  
        if (userData.tipoUsuario === 'profesor') {
          this.router.navigate(['/inicio-profesores']);
        } else {
          this.router.navigate(['/inicio-alumnos']);
        }
      } else {
        await this.presentAlert('Error', 'Contraseña incorrecta.');
        await loading.dismiss();
      }
    } else {
      await this.presentAlert('Error', 'El correo ingresado no está registrado.');
      await loading.dismiss();
    }
  
    this.isSubmitting = false;
  }

  mostrarUsuarios() {
    console.log(localStorage.getItem('user'));
  }

  verstorage() {
    const users = Object.keys(localStorage).map(key => JSON.parse(localStorage.getItem(key)!));
    console.log('Usuarios:', users);
  }

  async animarExito() {
    const successElement = document.querySelector(".success-message");

    if (successElement) {
      this.animationCtrl.create()
        .addElement(successElement)
        .duration(500)
        .keyframes([
          { offset: 0, opacity: '0', transform: 'scale(0.5)' },
          { offset: 0.5, opacity: '0.5', transform: 'scale(1.2)' },
          { offset: 1, opacity: '1', transform: 'scale(1)' },
        ])
        .play();
    }
  }

  async animarCarga() {
    const loadingElement = document.querySelector(".loading-spinner");

    if (loadingElement) {
      this.animationCtrl.create()
        .addElement(loadingElement)
        .duration(1000)
        .iterations(Infinity)
        .keyframes([
          { offset: 0, transform: 'rotate(0deg)' },
          { offset: 1, transform: 'rotate(360deg)' },
        ])
        .play();
    }
  }

  async animarBoton() {
    const buttonElement = document.querySelector("button");

    if (buttonElement) {
      this.animationCtrl.create()
        .addElement(buttonElement)
        .duration(300)
        .keyframes([
          { offset: 0, transform: 'scale(1)', backgroundColor: 'blue' },
          { offset: 0.5, transform: 'scale(1.1)', backgroundColor: 'lightblue' },
          { offset: 1, transform: 'scale(1)', backgroundColor: 'blue' },
        ])
        .play();
    }
  }
}
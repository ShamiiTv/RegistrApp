import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, AnimationController } from '@ionic/angular';
import { AuthService } from '../auth.service'; 
import { Haptics } from '@capacitor/haptics';
import { firstValueFrom } from 'rxjs';

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
    private authService: AuthService,
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

  ngAfterViewInit() {
    this.animationCtrl.create()
      .addElement(document.querySelector("#logo")!)
      .duration(2000)
      .iterations(Infinity)
      .direction("alternate")
      .fromTo("color", "#6DDC98", "#51C8F0")
      .fromTo("transform", "rotate(-10deg)", "rotate(10deg)")
      .play();
  
    this.animationCtrl.create()
      .addElement(document.querySelector(".BienvenidaTXT")!)
      .duration(5000)
      .iterations(Infinity)
      .keyframes([
        { offset: 0, opacity: 0 },
        { offset: 0.5, opacity: 1 },
        { offset: 1, opacity: 0 }
      ])
      .play();
  
    this.animationCtrl.create()
      .addElement(document.querySelector(".ripple-parent")!)
      .duration(4000)
      .easing('ease-out')
      .fromTo('transform', 'scale(0.8)', 'scale(1)')
      .fromTo('opacity', '0', '1')
      .play();
  }

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

    try {
      const response = await firstValueFrom(this.authService.login(this.email, this.password));
      await loading.dismiss();

      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.user));

        localStorage.setItem('tipoUsuario', response.tipoUsuario);

        if (response.tipoUsuario === 'profesor') {
          this.router.navigate(['/inicio-profesores']); 
        } else {
          this.router.navigate(['/inicio-alumnos']); 
        }

    } else {
      await this.presentAlert('Error', 'Correo o contraseña incorrectos.');
    }
  } catch (error) {
    await loading.dismiss();
    await this.presentAlert('Error', 'Correo o contraseña incorrectos.');
    console.error('Error al iniciar sesión:', error);
  }
  this.isSubmitting = false;
}
}

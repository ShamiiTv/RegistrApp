import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, AnimationController } from '@ionic/angular';
import { AuthService } from '../auth.service'; 
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
    // Animación del logo
    this.animationCtrl.create()
      .addElement(document.querySelector("#logo")!)
      .duration(2000)
      .iterations(Infinity)
      .direction("alternate")
      .fromTo("color", "#6DDC98", "#51C8F0")
      .fromTo("transform", "rotate(-10deg)", "rotate(10deg)")
      .play();
  
    // Animación de la bienvenida
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
  
    // Animación del botón de inicio de sesión
    this.animationCtrl.create()
      .addElement(document.querySelector(".ripple-parent")!)
      .duration(4000)
      .easing('ease-out')
      .fromTo('transform', 'scale(0.8)', 'scale(1)')
      .fromTo('opacity', '0', '1')
      .play();
  }

  async animarError(index: number) {
    await Haptics.vibrate(); // Añadir vibración para un feedback háptico.
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
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!this.email || !emailRegex.test(this.email)) {
      await this.animarError(0);  // Índice 0 para el campo de correo
      await this.presentAlert('Error', 'Por favor ingresa un correo válido.');
      return;
    }

    if (!this.password || this.password.length < 6) {
      await this.animarError(1);  // Índice 1 para el campo de contraseña
      await this.presentAlert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    this.isSubmitting = true;
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();

    this.authService.login(this.email, this.password).subscribe(
      async (success: boolean) => {
        await loading.dismiss();
        if (success) {
          this.router.navigate(['/inicio']);
        } else {
          await this.presentAlert('Error', 'Correo electrónico o contraseña incorrectos');
        }
        this.isSubmitting = false;
      },
      async (error) => {
        await loading.dismiss();
        await this.presentAlert('Error', 'Correo electrónico o contraseña incorrectos');
        this.isSubmitting = false;
      }
    );
  }
}

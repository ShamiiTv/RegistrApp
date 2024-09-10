import { Component, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AnimationController } from '@ionic/angular';
import { Haptics } from '@capacitor/haptics';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements AfterViewInit {

  tipoUsuario: string = 'alumno'; // Valor por defecto
  isSubmitting: boolean = false;
  isOscuro: boolean = false;

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    private authService: AuthService,
    private animationCtrl: AnimationController
  ) { }

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

    // Animación del botón de registro
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

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      form.form.markAllAsTouched();
      await this.presentAlert('Error', 'Por favor, completa el formulario correctamente.');
      return;
    }

    const { email, password, confirmPassword, codigoProfesor } = form.value;

    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
      await this.animarError(2); // Índice 2 para la confirmación de contraseña
      await this.presentAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    // Mostrar un indicador de carga
    const loading = await this.loadingController.create({
      message: 'Registrando...',
    });
    await loading.present();

    try {
      await this.authService.register(email, password, confirmPassword, this.tipoUsuario, codigoProfesor).toPromise();
      await loading.dismiss();
      await this.presentAlert('Éxito', 'Registro completado exitosamente.');
      this.router.navigate(['/login']);
    } catch (error) {
      await loading.dismiss();
      await this.presentAlert('Error', 'Hubo un problema al registrar el usuario.');
      console.error('Error al registrar:', error);
    }
  }

  onUserTypeChange(event: any) {
    this.tipoUsuario = event.detail.value;
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}

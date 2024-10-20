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

  tipoUsuario: string = 'alumno';
  isSubmitting: boolean = false;
  isOscuro: boolean = false;
  codigoProfesor: string = '123456, 654321';

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    private authService: AuthService,
    private animationCtrl: AnimationController
  ) { }

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

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async validateField(field: string, value: string) {
    switch (field) {
      case 'nombre':
        if (value.length < 3) {
          await this.presentAlert('Error', 'El nombre debe tener al menos 3 caracteres.');
        }
        break;
      case 'email':
        if (!this.isEmailValid(value)) {
          await this.presentAlert('Error', 'Por favor, ingresa un correo electrónico válido.');
        }
        break;
      case 'password':
        if (value.length < 6) {
          await this.presentAlert('Error', 'La contraseña debe tener al menos 6 caracteres.');
        }
        break;
      case 'confirmPassword':
        const password = (document.querySelector('input[name="password"]') as HTMLInputElement).value;
        if (value !== password) {
          await this.presentAlert('Error', 'Las contraseñas no coinciden.');
        }
        break;
      case 'codigoProfesor':
        if (this.tipoUsuario === 'profesor') {
          const validCodes = this.codigoProfesor.split(',').map(code => code.trim());
          if (!validCodes.includes(value)) {
            await this.presentAlert('Error', 'El código de profesor es inválido.');
          }
        }
        break;
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


  async onSubmit(form: NgForm) {
    console.log('Formulario enviado:', form.value); // Agrega esta línea para verificar
    if (form.invalid) {
        form.form.markAllAsTouched();
        await this.presentAlert('Error', 'Por favor, completa el formulario correctamente.');
        return;
    }

    const { nombre, email, password, confirmPassword, codigoProfesor } = form.value;

    if (nombre.length < 3) {
      await this.presentAlert('Error', 'El nombre debe tener al menos 3 caracteres.');
      return;
    }
    if (!this.isEmailValid(email)) {
      await this.presentAlert('Error', 'Por favor, ingresa un correo electrónico válido.');
      return;
    }

    if (password.length < 6) {
      await this.presentAlert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      await this.presentAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    if (this.tipoUsuario === 'profesor') {
      const validCodes = this.codigoProfesor.split(',').map(code => code.trim());
      if (!validCodes.includes(codigoProfesor)) {
        await this.presentAlert('Error', 'El código de profesor es inválido.');
        return;
      }
    }

    const loading = await this.loadingController.create({
      message: 'Registrando...',
    });
    await loading.present();

    try {
      const userData = {
        nombre,
        email,
        password,
        tipoUsuario: this.tipoUsuario,
        codigoProfesor: this.tipoUsuario === 'profesor' ? codigoProfesor : null,
      };

      localStorage.setItem(email, JSON.stringify(userData));
      await loading.dismiss();
      await this.presentAlert('Éxito', 'Registro completado exitosamente.');
      this.router.navigate(['/login']);
    } catch (error) {
      await loading.dismiss();
      await this.presentAlert('Error', 'Hubo un problema al registrar el usuario.');
      console.error('Error al registrar:', error);
    }
  }

  isEmailValid(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  onUserTypeChange(event: any) {
    this.tipoUsuario = event.detail.value;
  }

  verstorage() {
    const users = Object.keys(localStorage).map(key => JSON.parse(localStorage.getItem(key)!));
    console.log('Usuarios:', users);
  }

}

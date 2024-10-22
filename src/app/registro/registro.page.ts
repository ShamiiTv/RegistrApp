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

  asignaturas: { id: number; nombre: string; profesor: string; codigoProfesor: string;}[] = [
    { id: 1, nombre: 'Programacion de aplicaciones moviles', profesor: 'Fernando Sepulveda' ,codigoProfesor: '111111'},
    { id: 2, nombre: 'Arquitectura', profesor: 'Juan Hernandez' ,codigoProfesor: '222222'},
    { id: 3, nombre: 'Calidad de software', profesor: 'Gabriel Estivales' ,codigoProfesor: '333333'},
    { id: 4, nombre: 'Estadistica Descriptiva', profesor: 'Eduardo Jara' ,codigoProfesor: '444444'},
    { id: 5, nombre: 'Ingles Intermedio', profesor: 'Nicolas Yañez' ,codigoProfesor: '555555'},
    { id: 6, nombre: 'Etica para el trabajo', profesor: 'Jorge Rojas' ,codigoProfesor: '666666'},
  ];

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
      case 'apellido':
        if (value.length < 3) {
          await this.presentAlert('Error', 'El apellido debe tener al menos 3 caracteres.');
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
    if (form.invalid) {
      form.form.markAllAsTouched();
      await this.presentAlert('Error', 'Por favor, completa el formulario correctamente.');
      return;
    }
  
    const { nombre, apellido, email, password, confirmPassword, codigoProfesor } = form.value;

  // Validaciones
  await Promise.all([
    this.validateField('nombre', nombre),
    this.validateField('apellido', apellido),
    this.validateField('email', email),
    this.validateField('password', password),
    this.validateField('confirmPassword', confirmPassword),
    this.validateField('codigoProfesor', codigoProfesor)
  ]);

  // Verificar si las contraseñas coinciden
  if (password !== confirmPassword) {
    await this.presentAlert('Error', 'Las contraseñas no coinciden.');
    return; // Salimos si las contraseñas no coinciden
  }

  // Si hubo errores en las validaciones, salimos de la función
  if (form.invalid) return;

  // Verificar si el correo ya está registrado aquí
  if (this.isEmailRegistered(email)) {
    await this.presentAlert('Error', 'Este correo electrónico ya está registrado.');
    return; // Salimos si el correo ya está registrado
  }

  const loading = await this.loadingController.create({
    message: 'Registrando...',
  });
  await loading.present();

  try {
    const userData = {
      nombre,
      apellido,
      email,
      password,
      tipoUsuario: this.tipoUsuario,
      codigoProfesor: this.tipoUsuario === 'profesor' ? codigoProfesor : null,
    };

    // Guardar en localStorage
    localStorage.setItem(email, JSON.stringify(userData)); // Esto se hace solo si el correo no está registrado
    await loading.dismiss();
    await this.presentAlert('Éxito', 'Registro completado exitosamente.');
    this.router.navigate(['/login']); // Redirigir al login solo después de un registro exitoso
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

  isEmailRegistered(email: string): boolean {
    return localStorage.getItem(email) !== null;
  }

  onUserTypeChange(event: any) {
    this.tipoUsuario = event.detail.value;
  }

  verstorage() {
    const users = Object.keys(localStorage).map(key => JSON.parse(localStorage.getItem(key)!));
    console.log('Usuarios:', users);
  }

}

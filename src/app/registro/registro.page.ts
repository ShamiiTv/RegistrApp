import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  tipoUsuario: string = 'alumno'; // Valor por defecto
  isSubmitting: boolean = false;
  isOscuro: boolean = false;  

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    private authService: AuthService,

  ) { }

  ngOnInit() {}

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      form.form.markAllAsTouched();
      await this.presentAlert('Error', 'Por favor, completa el formulario correctamente.');
      return;
    }
  
    const { email, password, confirmPassword, codigoProfesor } = form.value;
    console.log('Formulario:', form.value); // Depuración
  
    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
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

  claroOscuro() {
    this.isOscuro = !this.isOscuro;
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

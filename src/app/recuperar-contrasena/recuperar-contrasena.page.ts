import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
})
export class RecuperarContrasenaPage implements OnInit {
  isOscuro: boolean = false;
  email: string = '';
  usuarios: { nombre: string; email: string; password: string }[] = [];

  constructor(
    private loadingController: LoadingController,
    private http: HttpClient,
    private alertController: AlertController
  ) {
  }

  ngOnInit() {
    this.loadUsersFromStorage();
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


  loadUsersFromStorage() {
    const allUsers = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key) {
        const item = localStorage.getItem(key);

        if (item) {
          const user = JSON.parse(item);
          allUsers.push(user);
        }
      }
    }

    this.usuarios = allUsers;
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
  recuperarContrasena() {
    const usuario = this.usuarios.find(u => u.email === this.email);
  
    if (usuario) {
      const loading = this.loadingController.create({
        message: 'Enviando correo...'
      });
  
      loading.then(loading => loading.present());
  
      let nuevaPassword = Math.random().toString(36).slice(-6);
      usuario.password = nuevaPassword;
      
      let body = {
        nombre: usuario.nombre,
        app: 'RegistrApp',
        clave: nuevaPassword,
        email: usuario.email
      };
  
      console.log('Contraseña generada:', nuevaPassword);
      console.log('Cuerpo del correo:', body);
  
      this.http.post("https://myths.cl/api/reset_password.php", body).subscribe(
        data => {
          console.log(data);
          loading.then(loading => loading.dismiss());
          this.presentAlert('Éxito', 'Correo enviado con nueva contraseña');
  
          // Actualiza el localStorage con la nueva contraseña
          localStorage.setItem(usuario.email, JSON.stringify(usuario));
        },
        error => {
          console.error('Error al enviar correo:', error);
          loading.then(loading => loading.dismiss());
          this.presentAlert('Error', 'Error al enviar correo');
        }
      );
    } else {
      this.presentAlert('Error', 'Correo no encontrado');
    }
  }
  
  
}

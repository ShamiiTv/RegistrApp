import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, AlertController, ToastController } from '@ionic/angular';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';

interface Clase {
  id: number;
  dia: string;
  hora: string;
  asignatura: string;
  profesor: string;
}

@Component({
  selector: 'app-inicio-alumnos',
  templateUrl: './inicio-alumnos.page.html',
  styleUrls: ['./inicio-alumnos.page.scss'],
})
export class InicioAlumnosPage implements AfterViewInit, OnInit {
  isOscuro: boolean = false;
  receiveEmails: boolean = false;
  receiveTextMessages: boolean = false;
  isSupported: boolean = false;
  barcodes: Barcode[] = [];
  currentView: string = 'home';
  clasesHoy: Clase[] = [];
  showCalendar: boolean = false;
  diaActual: number = new Date().getDay();
  asistencia: { [key: string]: string } = {
    '2024-10-15': 'asistio', // Ejemplo de día con asistencia
    '2024-10-16': 'falto',
    '2024-10-17': 'parcial'
  };
  email: string = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).email : '';

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  asignaturas: { id: number; nombre: string; profesor: string; }[] = [
    { id: 1, nombre: 'Programacion de aplicaciones moviles', profesor: 'Fernando Sepulveda' },
    { id: 2, nombre: 'Arquitectura', profesor: 'Juan Hernandez' },
    { id: 3, nombre: 'Calidad de software', profesor: 'Gabriel Estivales' },
    { id: 4, nombre: 'Estadistica Descriptiva', profesor: 'Eduardo Jara' },
    { id: 5, nombre: 'Ingles Intermedio', profesor: 'Nicolas Yañez' },
    { id: 6, nombre: 'Etica para el trabajo', profesor: 'Jorge Rojas' },
  ];

  horarios: Clase[] = [
    { id: 1, dia: 'Lunes', hora: '12:11 - 13:40', asignatura: 'Estadistica Descriptiva', profesor: 'Eduardo Jara' },
    { id: 2, dia: 'Lunes', hora: '14:31 - 15:50', asignatura: 'Programacion de aplicaciones moviles', profesor: 'Fernando Sepulveda' },
    { id: 3, dia: 'Martes', hora: '12:11 - 14:20', asignatura: 'Programacion de aplicaciones moviles', profesor: 'Fernando Sepulveda' },
    { id: 4, dia: 'Martes', hora: '14:31 - 16:40', asignatura: 'Ingles Intermedio', profesor: 'Nicolas Yañez' },
    { id: 5, dia: 'Miercoles', hora: '15:11 - 16:40', asignatura: 'Arquitectura', profesor: 'Juan Hernandez' },
    { id: 6, dia: 'Miercoles', hora: '16:41 - 18:10', asignatura: 'Ingles Intermedio', profesor: 'Nicolas Yañez' },
    { id: 7, dia: 'Jueves', hora: '10:41 - 12:10', asignatura: 'Etica para el trabajo', profesor: 'Jorge Rojas' },
    { id: 8, dia: 'Jueves', hora: '12:11 - 13:40', asignatura: 'Estadistica Descriptiva', profesor: 'Eduardo Jara' },
    { id: 9, dia: 'Jueves', hora: '13:41 - 15:50', asignatura: 'Arquitectura', profesor: 'Juan Hernandez' },
    { id: 10, dia: 'Viernes', hora: '13:01 - 15:10', asignatura: 'Ingles Intermedio', profesor: 'Nicolas Yañez' },
    { id: 11, dia: 'Viernes', hora: '15:11 - 18:10', asignatura: 'Calidad de software', profesor: 'Gabriel Estivales' }
  ];

  constructor(
    private router: Router,
    private http: HttpClient,
    private animationCtrl: AnimationController,
    private alertController: AlertController,
    private toast: ToastController
  ) {
    this.isOscuro = JSON.parse(localStorage.getItem('isOscuro') || 'false');
  }

  async showToast(message: string) {
    const toast = await this.toast.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  }

  ngOnInit() {
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      this.email = userData.email;
    }

    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });

    const hoy = new Date();
    const diaDeLaSemana = hoy.getDay();
    if (diaDeLaSemana === 0 || diaDeLaSemana === 6) {
      this.showCalendar = true;
      this.generarCalendarioSemanal();
    } else {
      this.mostrarClasesHoy();
    }
  }

  ngAfterViewInit() {
    if (this.currentView === 'calendar') {
      this.generarCalendario();
    }
  }

  generarCalendarioSemanal() {
    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const clasesSemanal: Clase[] = []; 

    diasSemana.forEach(dia => {
      const clasesDelDia = this.horarios.filter(horario => horario.dia.toLowerCase() === dia);
      clasesSemanal.push(...clasesDelDia);
    });

    this.clasesHoy = clasesSemanal;
  }

  async scan() {
    const data = await CapacitorBarcodeScanner.scanBarcode({ hint: CapacitorBarcodeScannerTypeHint.ALL });
    this.showToast(data.ScanResult);
  }

  cerrarSesion() {
    localStorage.removeItem('user');
    localStorage.removeItem('tipoUsuario');
    this.router.navigate(['/login']);
  }

  cambiarVista(vista: string) {
    this.currentView = vista;
    if (vista === 'calendar') {
      setTimeout(() => this.generarCalendario(), 0);
    }
  }

  claroOscuro() {
    this.isOscuro = !this.isOscuro;
    localStorage.setItem('isOscuro', JSON.stringify(this.isOscuro));
  }

  ionWillEnter() {
    this.isOscuro = localStorage.getItem('isOscuro') === 'true';
  }

  generarCalendario() {
    const calendarBody = document.getElementById('calendar-body');
    if (calendarBody) {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startDay = firstDay.getDay();

      let html = '';
      let day = 1;

      for (let row = 0; row < 6; row++) {
        html += '<tr>';
        for (let col = 0; col < 7; col++) {
          if (row === 0 && col < startDay) {
            html += '<td></td>';
          } else if (day <= daysInMonth) {
            const dateKey = `${year}-${month + 1}-${day}`;
            let backgroundColor = 'white'; // Color por defecto
            if (this.asistencia[dateKey] === 'asistio') {
              backgroundColor = 'green';
            } else if (this.asistencia[dateKey] === 'falto') {
              backgroundColor = 'red';
            } else if (this.asistencia[dateKey] === 'parcial') {
              backgroundColor = 'yellow';
            }

            html += `<td><div style="background-color:${backgroundColor};height:60px;">${day}</div></td>`;
            day++;
          } else {
            html += '<td></td>';
          }
        }
        html += '</tr>';
      }

      calendarBody.innerHTML = html;
    } else {
      console.error('No se encontró el elemento calendar-body');
    }

    this.mostrarClasesHoy();
  }

  mostrarClasesHoy() {
    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sábado'];
    const diaSeleccionado = diasSemana[this.diaActual];
    this.clasesHoy = this.horarios.filter(horario => horario.dia.toLowerCase() === diaSeleccionado);
  }

  cambiarVistaCalendario() {
    this.currentView = 'semana';
  }

  esDiaActivo(dia: number): boolean {
    return this.diaActual === dia;
  }

  cambiarDia(dia: number) {
    this.diaActual = dia;
    if (dia === 0 || dia === 6) {
      this.showCalendar = true;
      this.generarCalendarioSemanal();
    } else {
      this.showCalendar = false;
      this.mostrarClasesHoy();
    }
  }

  async cambiarContrasena() {
    if (this.newPassword !== this.confirmPassword) {
      await this.showAlert('Error', 'Las contraseñas no coinciden');
      return;
    }

    const usuario = localStorage.getItem('user');
    if (usuario) {
      const userData = JSON.parse(usuario);
      this.email = userData.email;
      userData.password = this.newPassword;
      localStorage.setItem('user', JSON.stringify(userData)); // Cambié el ID a 'user'

      await this.showAlert('Éxito', 'Contraseña cambiada exitosamente');
    } else {
      await this.showAlert('Error', 'Correo no encontrado');
    }
  }

  async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}

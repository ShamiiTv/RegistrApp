import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, AlertController, ToastController } from '@ionic/angular';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';

interface Clase {
  id: number;
  dia: string;
  hora: string;
  asignatura: string;
  profesor: string;
}
interface Asistencia {
  fecha: string;
  hora: string;
  asignatura: string;
  estado: string;
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
  asistencia: Asistencia | null = null;
  asistencias: Asistencia[] = [];
  showCalendar: boolean = false;
  diaActual: number = new Date().getDay();
  userData: { nombre: string; apellido: string; email: string; tipoUsuario: string; password: string } = { nombre: '', apellido: '', email: '', tipoUsuario: '', password: '' };
  email: string = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).email : '';
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  hora = new Date().toLocaleTimeString('es-CL');
  asignaturas: { id: number; nombre: string; profesor: string; codigoProfesor: string;}[] = [
    { id: 1, nombre: 'Programacion de aplicaciones moviles', profesor: 'Fernando Sepulveda' ,codigoProfesor: '111111'},
    { id: 2, nombre: 'Arquitectura', profesor: 'Juan Hernandez' ,codigoProfesor: '222222'},
    { id: 3, nombre: 'Calidad de software', profesor: 'Gabriel Estivales' ,codigoProfesor: '333333'},
    { id: 4, nombre: 'Estadistica Descriptiva', profesor: 'Eduardo Jara' ,codigoProfesor: '444444'},
    { id: 5, nombre: 'Ingles Intermedio', profesor: 'Nicolas Yañez' ,codigoProfesor: '555555'},
    { id: 6, nombre: 'Etica para el trabajo', profesor: 'Jorge Rojas' ,codigoProfesor: '666666'},
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

    this.cargarAsistencia();
    const currentUser = localStorage.getItem('user');
  if (currentUser) {
    this.userData = JSON.parse(currentUser);
    this.email = this.userData.email;
  }

  this.cargarAsistencias();
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
      this.userData = JSON.parse(currentUser);
      this.email = this.userData.email;
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

    this.obtenerClasesHoy();

    this.cargarAsistencia();
  }

  cargarAsistencia() {
    const asistenciaGuardada = JSON.parse(localStorage.getItem('asistencia') || '{}');
    this.asistencia = asistenciaGuardada;
  }

  obtenerFechaYHoraActual() {
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString('es-CL');
    const hora = ahora.toLocaleTimeString('es-CL');
  }

  obtenerClasesHoy() {
    const hoy = new Date();
    const diaDeLaSemana = hoy.getDay();
    this.clasesHoy = this.horarios.filter(clase => this.convertirDiaANumero(clase.dia) === diaDeLaSemana);
  }

  convertirDiaANumero(dia: string): number {
    const dias: { [key: string]: number } = {
      'Lunes': 1,
      'Martes': 2,
      'Miércoles': 3,
      'Jueves': 4,
      'Viernes': 5,
      'Sábado': 6,
      'Domingo': 0
    };
    return dias[dia] || 0;
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

  cargarAsistencias() {
    const userEmail = this.userData.email; // Obtener el email del usuario actual
    if (userEmail) {
      const key = `asistencias_${userEmail}`;
      const asistenciasGuardadas = JSON.parse(localStorage.getItem(key) || '[]');
      this.asistencias = asistenciasGuardadas;
    } else {
      this.asistencias = []; // Si no hay usuario, la lista está vacía
    }
  }
  
  registrarAsistencia(nuevaAsistencia: Asistencia) {
    const userEmail = this.userData.email; // Obtener el email del usuario actual
    if (userEmail) {
      const key = `asistencias_${userEmail}`;
      this.asistencias.push(nuevaAsistencia); // Agregar la nueva asistencia al arreglo
      localStorage.setItem(key, JSON.stringify(this.asistencias)); // Guardar en localStorage
    } else {
      console.error('No se pudo registrar la asistencia: el usuario no está identificado.');
    }
  }

  async scan() {
    try {
      const data = await CapacitorBarcodeScanner.scanBarcode({ hint: CapacitorBarcodeScannerTypeHint.ALL });
  
      const qr = data.ScanResult.split("--");
  
      if (qr.length >= 3) {
        const horaActual = new Date().toLocaleTimeString();
  
        const nuevaAsistencia: Asistencia = {
          fecha: qr[0],
          hora: horaActual,
          asignatura: qr[2],
          estado: 'Asistió'
        };
  
        this.registrarAsistencia(nuevaAsistencia);
        this.showToast('Asistencia registrada');
      } else {
        console.error('Formato de QR no válido', qr);
        this.showToast('Error: Formato de QR no válido');
      }
    } catch (error) {
      console.error(error);
      this.showToast('Error al escanear el código');
    }
  }
  
  
  getHistorialAsistencias(): Asistencia[] {
    return this.asistencias;
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
      localStorage.setItem('user', JSON.stringify(userData));

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

  getUserData() {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      userData.nombre = this.getUserData().nombre;
      userData.apellido = this.getUserData().apellido;
      userData.email = this.getUserData().email;
      userData.tipoUsuario = this.getUserData().tipoUsuario;
      userData.password = this.getUserData().password;
      return userData;
    }
    return null;
  }
}

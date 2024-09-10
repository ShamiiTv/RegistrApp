import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-profesores',
  templateUrl: './inicio-profesores.page.html',
  styleUrls: ['./inicio-profesores.page.scss'],
})
export class InicioProfesoresPage implements OnInit, AfterViewInit {

  isOscuro: boolean = false;
  receiveEmails: boolean = false;
  receiveTextMessages: boolean = false;
  currentView: string = 'home';

  constructor(private router: Router, private http: HttpClient) {
    this.isOscuro = JSON.parse(localStorage.getItem('isOscuro') || 'false');
    this.receiveEmails = JSON.parse(localStorage.getItem('receiveEmails') || 'false');
    this.receiveTextMessages = JSON.parse(localStorage.getItem('receiveTextMessages') || 'false');
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.currentView === 'calendar') {
      this.generarCalendario();
    }
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

  toggleSetting(setting: string) {
    switch (setting) {
      case 'darkMode':
        this.isOscuro = !this.isOscuro;
        this.receiveEmails = false;
        this.receiveTextMessages = false;
        break;
      case 'receiveEmails':
        this.receiveEmails = !this.receiveEmails;
        this.isOscuro = false;
        this.receiveTextMessages = false;
        break;
      case 'receiveTextMessages':
        this.receiveTextMessages = !this.receiveTextMessages;
        this.isOscuro = false;
        this.receiveEmails = false;
        break;
    }
    localStorage.setItem('isOscuro', JSON.stringify(this.isOscuro));
    localStorage.setItem('receiveEmails', JSON.stringify(this.receiveEmails));
    localStorage.setItem('receiveTextMessages', JSON.stringify(this.receiveTextMessages));
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
      
      // Crear la tabla
      for (let row = 0; row < 6; row++) {
        html += '<tr>';
        for (let col = 0; col < 7; col++) {
          if (row === 0 && col < startDay) {
            html += '<td></td>';
          } else if (day <= daysInMonth) {
            html += `<td><div style="height:60px; align-content: center; border: solid 0.1px grey">${day}</div></td>`;
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
  }
}

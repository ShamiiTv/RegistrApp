import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-alumnos',
  templateUrl: './inicio-alumnos.page.html',
  styleUrls: ['./inicio-alumnos.page.scss'],
})
export class InicioAlumnosPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  cerrarSesion() {
    localStorage.removeItem('user');
    localStorage.removeItem('tipoUsuario');

    this.router.navigate(['/login']);
  }
}

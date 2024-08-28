import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // URL de tu API

  constructor(private http: HttpClient) { }

  register(email: string, password: string, confirmPassword: string, tipoUsuario: string, codigoProfesor?: string): Observable<any> {
    const body = { email, password, confirmPassword, tipoUsuario, codigoProfesor };
    return this.http.post<any>(`${this.apiUrl}/register`, body);
  }

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, body);
  }
  
}


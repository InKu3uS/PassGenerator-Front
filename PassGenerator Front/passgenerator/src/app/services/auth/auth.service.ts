import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../model/UserSchema';
import { Router } from '@angular/router';
import { environment } from '@envs/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient, private router:Router) { }

  private apiUrl = `${environment.API_URL}/auth`

  login(mail: string, password: string): Observable<any>{
    return this.http.post(`${this.apiUrl}/login`, { mail, password });
  }

  register(user:User): Observable<any>{
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  isLoggedIn(): boolean{
    const token = localStorage.getItem('tkActUs');
    return token!=null;
  }

  logout(): void{
    localStorage.removeItem('tkActUs');
    localStorage.removeItem('usLg');
    this.router.navigate(['/home']).then(() => {location.reload()});
  }
}

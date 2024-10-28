import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cuenta } from '../../model/cuentaSchema';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '@envs/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(private http:HttpClient, private router:Router) { }

  private apiUrl = `${environment.API_URL}/cuentas`
  private token = localStorage.getItem('tkActUs');
  private headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);

  getAllAccounts(): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(`${this.apiUrl}/list`, {headers: this.headers});
  }

  getAllAccountsByUser(mail:string): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(`${this.apiUrl}/user/${mail}`, {headers: this.headers});
  }

  countAllAccountsByEmail(email:string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/${email}`, {headers: this.headers});
  }

  deleteAccount(site:string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${site}`, {headers: this.headers});
  }

  save(cuenta:Cuenta): Observable<any>{
    return this.http.post(`${this.apiUrl}/save`, cuenta, {headers:this.headers, responseType: 'json', observe: 'response'});
  }

  update(cuenta:Cuenta): Observable<any>{
    return this.http.put(`${this.apiUrl}/update`, cuenta, {headers:this.headers, responseType: 'json', observe: 'response'});
  }

}

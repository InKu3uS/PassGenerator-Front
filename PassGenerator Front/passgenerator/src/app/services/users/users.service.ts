import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../model/UserSchema';
import { Observable } from 'rxjs';
import { environment } from '@envs/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  private apiUrl = `${environment.API_URL}/users`;
  private token = localStorage.getItem('tkActUs');
  private headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/list`, {headers: this.headers});
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/mail/${email}`, {headers: this.headers});
  }

verifyPassword(email: string, password: string): Observable<boolean> {
  const params = new HttpParams()
    .set('email', email)
    .set('password', password);
  return this.http.post<boolean>(`${this.apiUrl}/verify-password`, null, {headers: this.headers, params: params});
}

editUsername(email: string, username: string): Observable<any> {
  const params = new HttpParams()
    .set('email', email)
    .set('username', username);
  return this.http.put(`${this.apiUrl}/username`, null, {headers: this.headers, params: params});
}

editPassword(email: string, password: string) {
  const params = new HttpParams()
    .set('email', email)
    .set('password', password);
  return this.http.put(`${this.apiUrl}/password`, null, {headers: this.headers, params: params});
}

deleteUser(email: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${email}`, {headers: this.headers, responseType: 'text' as 'json'});
}

}

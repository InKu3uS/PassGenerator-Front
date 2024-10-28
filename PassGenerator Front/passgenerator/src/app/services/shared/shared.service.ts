import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private generatedPassword: string = "";
  private site: string = "";

  savePassword(password:string) {
    this.generatedPassword = password;
  }

  getPassword(){
    return this.generatedPassword;
  }

  resetPassword() {
    this.generatedPassword = "";
  }

  saveSite(site:string){
    this.site = site;
  }

  getSite(){
    return this.site;
  }

  resetSite() {
    this.site = "";
  }
}

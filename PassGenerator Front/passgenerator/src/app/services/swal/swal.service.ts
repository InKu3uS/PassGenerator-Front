import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {
  

  constructor() { }

  registeredUser(username: string){
    Swal.fire({
      position: "bottom-end",
      icon: "success",
      title: "Usuario registrado",
      text: `Bienvenido a PassGenerator ${username}`,
      showConfirmButton: false,
      timer: 2000
    });
  }

  savedAccount(site: string){
    Swal.fire({
      position: "bottom-end",
      icon: "success",
      title: "Cuenta guardada",
      text: `La contraseña de ${site} se ha registrado con éxito`,
      showConfirmButton: false,
      timer: 2000
    });
  }

  updatedAccount(site: string) {
    Swal.fire({
      position: "bottom-end",
      icon: "success",
      title: "Cuenta modificada",
      text: `La cuenta de ${site} se ha modificado con éxito`,
      showConfirmButton: false,
      timer: 2000
    });
  }

  duplicateAccount(error: any) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Cuenta duplicada`,
      text: error.error.message,
      showConfirmButton: true,
    });
  }

  errorUpdateAccount(error:any){
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Error al modificar la cuenta`,
      text: error.error.message,
      showConfirmButton: true,
    });
  }

  usernameSaved(username: string){
    Swal.fire({
      position: "bottom-end",
      icon: "success",
      title: "Usuario modificado",
      text: `El nombre de usuario ${username} se ha modificado con éxito`,
      showConfirmButton: false,
      timer: 2000
    });
  }

  passwordSaved(){
    Swal.fire({
      position: "bottom-end",
      icon: "success",
      title: "Usuario modificado",
      text: `La contraseña se ha modificado con éxito`,
      showConfirmButton: false,
      timer: 2000
    });
  }

  

  copyToClipBoard(){
    Swal.fire({
      position: "bottom-end",
      icon: "success",
      title: "Copiado",
      text: `La contraseña se ha copiado al portapapeles`,
      showConfirmButton: false,
      timer: 2000
    });
  }

  userDeleted(username: string){
    Swal.fire({
      position: "bottom-end",
      icon: "success",
      title: "Usuario borrado",
      text: `Se ha borrado la cuenta de ${username}`,
      showConfirmButton: false,
      timer: 2000
    });
  }
}

import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { TitleService } from '../../services/title/title.service';
import { AccountsService } from '../../services/accounts/accounts.service';
import { ExportService } from '../../services/export/export.service';
import { Title } from '@angular/platform-browser';
import { Cuenta, cuentaSchema } from '../../model/cuentaSchema';
import Swal from 'sweetalert2';
import { SwalService } from '../../services/swal/swal.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UsersService } from '../../services/users/users.service';
import { catchError, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-passwords',
  templateUrl: './passwords.component.html',
  styleUrl: './passwords.component.css',
  animations: [
    trigger('accordion-animation', [
      state('collapsed', style({
        height: '0px',
        opacity: 0,
        overflow: 'hidden'
      })),
      state('expanded', style({
        height: '*',
        opacity: 1
      })),
      transition('collapsed <=> expanded', [
        animate('0.3s ease-in-out')
      ])
    ])
  ]
})
export class PasswordsComponent implements OnInit {

  private titleService = inject(TitleService);
  private route = inject(Router);
  private service = inject(AccountsService);
  private sharedService = inject(SharedService);
  private title = inject(Title);
  private export = inject(ExportService);
  private swal = inject(SwalService);
  private userService = inject(UsersService);

  defaultTitle: string = 'PassGenerator - Passwords';
  accountList: Cuenta[] = [];
  userLoggedIn: string  = localStorage.getItem('usLg') || '';
  actualDate: string = '';

  hidePasswordButton: boolean = false;
  showPasswordButton: boolean = true;
  showExportButtons: boolean = false;

  userconfirmed: boolean = false;

  ngOnInit(): void {
    this.title.setTitle(this.defaultTitle);
    this.titleService.blurTitle(this.defaultTitle);
    this.getFechaActual();
    this.getAll();
  }


  /**
   * Alterna los valores de hidePasswordButton y showPasswordButton
   * que son los que se encargan de mostrar u ocultar los botones de ver y ocultar las contraseñas
   */
  changeButtons(){
    this.hidePasswordButton =!this.hidePasswordButton;
    this.showPasswordButton =!this.showPasswordButton;
  }

  /**
   * Solicita la contraseña al usuario si no se ha confirmado ya.
   * 
   * Si ya ha confirmado su contraseña cambia el valor de la variable showExportButtons
   * que se encarga de mostrar u ocultar los botones para exportar la lista de contraseñas
   */
  toggleExportButtons(){
    if(this.userconfirmed == false) {
      this.confirmPassword();
    } else {
      this.showExportButtons =!this.showExportButtons;
    }
  }


  /**
   * Muestra la contraseña del indice indicado cambiado su tipo a text.
   * Si el usuario no se ha confirmado aun, se le pedira confirmacion de contraseña.
   * 
   * @param index - El indice de la contraseña en la lista.
   * @returns {void}
   */
  showPassword(index:number): void {
    if(this.userconfirmed == false){
      this.confirmPassword();
    } else {
      let input: HTMLInputElement | null = document.querySelector('#password'+index);
      this.changeButtons();
      if (input) {
        input.setAttribute('type', 'text');
      }
    }

  }


  /**
   * Copia la contraseña del indice indicado al portapapeles.
   * 
   * Si el usuario no se ha confirmado aun, se le pedira confirmacion de contraseña.
   *
   * @param index - El indice de la contraseña en la lista.
   * @returns {void}
   */
  copyToClipboard(index:number): void {
    if(this.userconfirmed == false) {
      this.confirmPassword();
    } else {
      let input: HTMLInputElement | null = document.querySelector('#password'+index);
      if(input !== null) {
        navigator.clipboard.writeText(input.value);
        this.swal.copyToClipBoard();
      }
    }
  }


  /**
   * Oculta la contraseña del indice indicado cambiado su tipo a password.
   * 
   * Si el usuario no se ha confirmado aun, se le pedira confirmacion de contraseña.
   * 
   * @param index - El indice de la contraseña en la lista.
   * @returns {void}
   */
  hidePassword(index:number): void {
    if(this.userconfirmed == false) {
      this.confirmPassword();
    } else {
    let input: HTMLInputElement | null = document.querySelector('#password'+index);
    this.changeButtons();
      if (input) {
        input.setAttribute('type', 'password');
      }
    }
  }

  /**
   * Desplega un modal Swal para que el usuario confirme su contraseña.
   * 
   * Si la contraseña es correcta, se cambia el valor de userConfirmed a true
   * Si la contraseña no es correcta, se muestra un mensaje al usuario
   *
   * @returns {void}
   */
  confirmPassword(){
    Swal.fire({
      title: "Confirmar contraseña",
      text: "Por seguridad, confirma tu contraseña.",
      input: "password",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      confirmButtonColor: "#3085d6",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#d33",
      preConfirm: async (result) => {
        try {
          this.verifyPassword(this.userLoggedIn, result).subscribe({
            next: (isValid) =>{
              if(isValid == true) {
                Swal.fire({
                  title: "Contraseña confirmada",
                  text: "Ahora puedes ver, copiar y exportar tus contraseñas",
                  icon: "success"
                });
                this.userconfirmed = true;
              } else {
                Swal.fire({
                  title: "Error",
                  text: "La contraseña no coincide",
                  icon: "error"
                });
                return;
              }
            },
            error: (error) => {
              console.error('Error al verificar la contraseña:', error);
            }
          })
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Hubo un error al confirmar la contraseña",
            icon: "error"
          });
        }
      }
    });
  }


  /**
   * Verifica la autenticidad de la contraseña del usuario haciendo una peticion al backend
   *
   * @param email - El email del usuario.
   * @param password - La contraseña del usuario a verificar.
   *
   * @returns Observable que emite un booleano, indicando si la contraseña es correcta o incorrecta.
   * Si la contraseña es valida devolvera true. Si no, devolvera false.
   * En caso de ocurrir algun error durante el proceso, devolvera false y se mostrara un error.
   */
  verifyPassword(email: string, password: string): Observable<boolean> {
    return this.userService.verifyPassword(email, password).pipe(
      map((response) => {
        if (response) {
          return true;
        } else {
          return false;
        }
      }),
      catchError((error) => {
        console.error('Error:', error);
        return of(false);
      })
    );
  }


  
  /**
   * Borra la con el nombre indicado de la lista de cuentas.
   * 
   * Si el usuario no se ha confirmado aun, se le pedira confirmacion de contraseña.
   * 
   * Muestra un modal Swal de confirmacion antes de borrar la cuenta.
   * Si el usuario confirma, se envia la peticion al backend para borrar dicha cuenta.
   * Si el borrado se realiza con exito, se borra de la lista local y se envia un mensaje al usuario.
   * Si el borrado falla, se muestra un mensaje de error al usuario.
   * Si el usuario cancela el borrado, se le muestra un mensaje de cancelacion.
   * 
   *
   * @param site - El sitio o nombre de la cuenta a borrar.
   * @returns {void}
   */
  deleteAccount(site:string) {
    if(this.userconfirmed == false) {
      this.confirmPassword();
    } else {
      Swal.fire({
        title: "¿Desea borrar esta cuenta?",
        text: "Este cambio es irreversible",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Borrar",
        confirmButtonColor: "#3085d6",
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#d33"
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.deleteAccount(site).subscribe({
            next: () => {
              this.accountList = this.accountList.filter(acc => acc.site!== site);
              Swal.fire({
                title: "Borrado",
                text: "La cuenta se ha borrado con éxito.",
                icon: "success"
              });
            },
            error: (error) => {
              console.error(error);
              Swal.fire({
                title: "Error",
                text: "No se ha podido borrar la cuenta",
                icon: "error"
              });
            }
          });
        }
        if (result.isDismissed){
          Swal.fire({
            title: "Cancelado",
            text: "La operación fue cancelada",
            icon: "info"
          });
        }
      });
    }
  }

  editAccount(site: string){
    if(this.userconfirmed == false) {
      this.confirmPassword();
    } else {
      this.sharedService.saveSite(site);
      this.route.navigate(['/save']);
    }
  }



  /**
   * Obtiene la fecha actual y la guarda en la variable today
   * 
   * Luego la convierte a un String mediante el metodo toLocaleDateString
   * 
   * @returns {void}
   */
  getFechaActual(){
    let today = new Date();
    this.actualDate = today.toLocaleDateString();
  }
  



  /**
   * Obtiene la lista de contraseñas del usuario actual.
   * 
   * Por cada valor en la lista de contraseñas se parsea usando cuentaSchema y se añade a la lista.
   * Si se realiza el parseo con exito, se añade a la lista local accountList
   * Si el parseo falla se muestra un mensaje de error y se continua con el flujo.
   *
   * Si no hay usuario registrado, se muestra un mensaje de error.
   *
   * @returns {void}
   */
  getAll(): void {
    if (this.userLoggedIn === '') {
      console.error('No sesión de usuario iniciada');
      return;
    }

    this.service.getAllAccountsByUser(this.userLoggedIn).subscribe({
      next: (accounts) => {
        accounts.forEach((account) => {
          const accountsParsed = cuentaSchema.safeParse(account);
          if (accountsParsed.success) {
            this.accountList.push(accountsParsed.data);
          } else {
            console.error('Invalid account:', accountsParsed.error);
          }
        });
      },
      error: (error) => {
        console.error(error.error.message);
      }
    });
  }


 
  /**
   * Exporta la lista de cuentas a un archivo JSON.
   * 
   * Esta función verifica si la lista de cuentas no está vacía o no está definida.
   * Si la lista es válida, llama al método exportJson del servicio ExportService
   * para generar y descargar un archivo JSON que contiene los datos de las cuentas.
   * Si la lista está vacía o no está definida, registra un mensaje de error en la consola.
   *
   * @returns {void}
   */
  exportJson(){
    if (!this.accountList || this.accountList.length === 0) {
      console.error('La lista de cuentas está vacía o no está definida.');
      return;
    }
    this.export.exportJson(this.accountList);
  }





  /**
   * Exporta la lista de cuentas a un archivo Excel.
   * 
   * Esta función verifica si la lista de cuentas no está vacía o no está definida.
   * Si la lista es válida, llama al método `exportExcel` del servicio `ExportService`
   * para generar y descargar un archivo Excel que contiene los datos de las cuentas.
   * Si la lista está vacía o no está definida, registra un mensaje de error en la consola.
   *
   * @returns {void}
   */
  exportExcel() {
    if (!this.accountList || this.accountList.length === 0) {
      console.error('La lista de cuentas está vacía o no está definida.');
      return;
    }
    this.export.exportExcel(this.accountList);
  }



/**
 * Exporta la lista de cuentas a un archivo PDF.
 *
 * Esta función verifica si la lista de cuentas no está vacía o no está definida.
 * Si la lista es válida, llama al método `exportPDF` del servicio `ExportService`
 * para generar y descargar un archivo PDF que contiene los datos de las cuentas.
 * Si la lista está vacía o no está definida, registra un mensaje de error en la consola.
 *
 * @returns {void}
 */
exportPDF(): void {
  if (!this.accountList || this.accountList.length === 0) {
    console.error('La lista de cuentas está vacía o no está definida.');
    return;
  }
  this.export.exportPDF(this.accountList);
}
}

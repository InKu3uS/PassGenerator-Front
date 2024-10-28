import { Component, inject, OnInit } from '@angular/core';
import { TitleService } from '../../services/title/title.service';
import { Title } from '@angular/platform-browser';
import { emptyUser, userWithoutUuidSchema } from '../../model/UserSchema';
import { UsersService } from '../../services/users/users.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';
import { AccountsService } from '../../services/accounts/accounts.service';
import { SwalService } from '../../services/swal/swal.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css',
  
})
export class MyProfileComponent implements OnInit {
  private titleService = inject(TitleService);
  private route = inject(Router);
  private authService = inject(AuthService);
  private title = inject(Title);
  private accountService = inject(AccountsService);
  private userService = inject(UsersService);
  private swal = inject(SwalService);

  emailLoggedIn = '';
  user: emptyUser | undefined;
  totalAccounts: number = 0;

  defaultTitle: string = 'PassGenerator - Mi Perfil';

  errorEditUsername = '';
  errorEditPassword = '';

  permitUsernameEdit = false;
  permitPasswordEdit = false;

  usernameForm: FormGroup = new FormGroup({
    username: new FormControl(null, Validators.required),
  });

  passwordForm: FormGroup = new FormGroup({
    password: new FormControl(null, Validators.required),
    newPassword: new FormControl(null, [Validators.required, Validators.minLength(8)]),
  });

  ngOnInit(): void {
    this.title.setTitle(this.defaultTitle);
    this.titleService.blurTitle(this.defaultTitle);
    this.getMailLogged();
    
    if(this.emailLoggedIn) {
      this.getUser(this.emailLoggedIn);
      this.getNumberOfAccounts(this.emailLoggedIn);
    } else {
      this.route.navigate(['/home']);
      return;
    }
    
  }

  getMailLogged() {
    if (localStorage.getItem('usLg') != null) {
      this.emailLoggedIn = localStorage.getItem('usLg')!;
    }
  }

  getNumberOfAccounts(email: string) {
    this.accountService.countAllAccountsByEmail(email).subscribe({
      next: (count) => {
        this.totalAccounts = count;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  setFormValues() {
    this.usernameForm.get('username')?.setValue(this.user?.username);
    this.usernameForm.get('username')?.disable();
    this.passwordForm.get('password')?.disable();
    this.passwordForm.get('newPassword')?.disable();
  }

  editUsername() {
    this.permitUsernameEdit = !this.permitUsernameEdit;
    if (this.permitUsernameEdit) {
      this.usernameForm.get('username')?.enable();
      this.passwordForm.get('password')?.disable();
      this.passwordForm.get('newPassword')?.disable();
      this.permitPasswordEdit = false; // Asegurarse de que la contraseña no esté habilitada
    } else {
      this.usernameForm.get('username')?.disable();
    }
  }

  editPassword() {
    this.permitPasswordEdit = !this.permitPasswordEdit;
    if (this.permitPasswordEdit) {
      this.passwordForm.get('password')?.enable();
      this.passwordForm.get('newPassword')?.enable();
      this.usernameForm.get('username')?.disable();
      this.permitUsernameEdit = false; // Asegurarse de que el nombre de usuario no esté habilitado
    } else {
      this.passwordForm.get('password')?.disable();
      this.passwordForm.get('newPassword')?.disable();
    }
  }

  getUser(email: string) {
    if(!email) {
      console.error('No se ha proporcionado un email');
      return;
    }
    this.userService.getUserByEmail(email).subscribe({
      next: (user) => {
        if (user.email && user.password) {
          this.user = userWithoutUuidSchema.parse(user);
          this.setFormValues();
        }
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

verifyPassword(email: string, password: string): Observable<boolean> {
  return this.userService.verifyPassword(email, password).pipe(
    map((response) => {
      if (response) {
        console.log('Las contraseñas coinciden');
        return true;
      } else {
        this.errorEditPassword = 'La contraseña actual no es correcta';
        return false;
      }
    }),
    catchError((error) => {
      console.error('Error:', error);
      return of(false);
    })
  );
}

  changeUsername(){
    const username = this.usernameForm.get('username')?.value;

    if(username == this.user?.username){
      this.errorEditUsername = 'El nombre de usuario no puede ser el mismo';
      return;
    }

    this.userService.editUsername(this.emailLoggedIn, username).subscribe({
      next: (response) => {
          this.getUser(this.emailLoggedIn);
          this.permitUsernameEdit = false;
          this.swal.usernameSaved(username);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  changePassword() {
    const actualPassword = this.passwordForm.get('password')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;
    
    if (newPassword == actualPassword) {
      this.errorEditPassword = 'La nueva contraseña debe ser distinta de la actual';
      return;
    }

    this.verifyPassword(this.emailLoggedIn, actualPassword!).subscribe((isValid) => {
      if (isValid) {
        this.userService.editPassword(this.emailLoggedIn, newPassword).subscribe({
          next: (response) => {
            console.log("Contraseña actualizada con éxito");
            console.log("Respuesta: "+response);
            this.passwordForm.reset();
            this.permitPasswordEdit = false;
            this.swal.passwordSaved();
          },
          error: (error) => {
            console.error('Error al actualizar la contraseña:', error);
          }
        });
      }
    });
  }

  /**
   * Se solicita la contraseña del usuario para acceder a "deleteAccount".
   * 
   * Si la contraseña no es correcta se muestra un mensaje indicandolo.
   * 
   * Si cancela se muestra un mensaje indicando que se ha cancelado el proceso.
   * 
   * Si la contraseña es correcta se llama a "deleteAccount".
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
          this.verifyPassword(this.emailLoggedIn, result).subscribe({
            next: (isValid) =>{
              if(isValid == true) {
                this.deleteAccount();
              } else {
                Swal.fire({
                  title: "Error",
                  text: "La contraseña no coincide con la actual",
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
    })
  }

  /**
   * Dialogo que solicita confirmacion al usuario antes de llamar a "deleteUser" en el "userService".
   * 
   * Si el usuario confirma se llama a "deleteUser", si se borra la cuenta se muestra un mensaje, se cierra la sesion
   * y se limpia el localStorage.
   * 
   * Si no se puede borrar se muestra un mensaje al usuario.
   */
  deleteAccount() {
    Swal.fire({
      title: "¿Desea borrar su cuenta?",
      html: "Esto borrará todas las contraseñas que tuviera guardadas <br> Este cambio es irreversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Borrar",
      confirmButtonColor: "#3085d6",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#d33"
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(this.emailLoggedIn).subscribe({
          next: () => {
            this.swal.userDeleted(this.user?.username!);
            this.authService.logout();
          },
          error: (error) => {
            console.error('Error al eliminar la cuenta:', error);
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

import { Component, inject, OnInit } from '@angular/core';
import { TitleService } from '../../services/title/title.service';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private titleService = inject(TitleService);
  private route = inject(Router);
  private service = inject(AuthService);
  private title = inject(Title);

  private defaultTitle: string = 'PassGenerator - Login';

  errorLogin = '';

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, Validators.required),
  });

  ngOnInit(): void {
    this.title.setTitle(this.defaultTitle);
    this.titleService.blurTitle(this.defaultTitle);
    this.redirectIfLoggedIn();
  }

  login(): void {
    const helper = new JwtHelperService();
    let mail = this.loginForm.get('email')?.value;
    let password = this.loginForm.get('password')?.value;

    this.service.login(mail, password).subscribe({
      next: (session) => {
        localStorage.setItem('tkActUs', session.token);
        const decodedToken = helper.decodeToken(session.token);
        localStorage.setItem('usLg', decodedToken.sub);
        this.route.navigate(['/home']).then(()=> {location.reload()});
      },
      error: (error) => {
        if(error.status === 404){
          this.errorLogin = 'Email o contraseña incorrectas. Verifica los datos e intentalo de nuevo.';
        }else{
          this.errorLogin = 'Ha ocurrido un error al realizar el login. Vuelva a intentarlo.';
        }
      },
    });
  }

  redirectIfLoggedIn() {
    if (this.service.isLoggedIn()) {
      this.route.navigate(['/home']);
    }
  }
}

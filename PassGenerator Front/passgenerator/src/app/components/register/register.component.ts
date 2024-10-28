import { Component, inject, OnInit } from '@angular/core';
import { TitleService } from '../../services/title/title.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Title } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { createUser, User } from '../../model/UserSchema';
import { SwalService } from '../../services/swal/swal.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  private titleService = inject(TitleService);
  private route = inject(Router);
  private service = inject(AuthService);
  private title = inject(Title);
  private swal = inject(SwalService);

  private defaultTitle: string = 'PassGenerator - Registro';

  errorPassword: boolean = false;

  registerForm: FormGroup = new FormGroup({
    username: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, Validators.required),
    confirmPassword: new FormControl(null, Validators.required)
  });


  ngOnInit(): void {
    this.title.setTitle(this.defaultTitle);
    this.titleService.blurTitle(this.defaultTitle);
  }

  register(){
    let username = this.registerForm.get("username")?.value;
    let email = this.registerForm.get("email")?.value;
    let password = this.registerForm.get("password")?.value;
    let confirmPassword = this.registerForm.get("confirmPassword")?.value;
    
    if(password!==confirmPassword){
      this.errorPassword = true;
      return;
    }

    let user: User = {
      username: username,
      email: email,
      password: password,
      createTime: new Date().toISOString(),
    }

    const validationResult = createUser.safeParse(user);
    if(!validationResult.success){
      console.error('Invalid user:', validationResult.error);
      return;
    }

    this.service.register(user).subscribe({
      next: (response) => {
        this.route.navigate(['/login']).then(() => {this.swal.registeredUser(username)});
      },
      error: (error) => {
        console.error('Error registering user:', error);
      }
    });

  }

  redirectIfLoggedIn() {
    if (this.service.isLoggedIn()) {
      this.route.navigate(['/home']);
    }
  }

}

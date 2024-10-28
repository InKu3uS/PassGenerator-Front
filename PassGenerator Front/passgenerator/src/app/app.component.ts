import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  private route = inject(Router);
  private authService = inject(AuthService);

  title = 'passgenerator';
  ngOnInit(): void {

  }
  //TODO: Tests Springboot.
  //TODO: Tests Angular.
  //TODO: Redireccionar en mi perfil si no se encuentra el usuario.
  //TODO: Terminar tests
}

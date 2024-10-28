import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UsersService } from '../../services/users/users.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit{

  private authService = inject(AuthService);
  private userService = inject(UsersService);

  shodDropdown = false;
  showMobileMenu = false;
  isLoggedIn = false;
  username = '';

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if(this.isLoggedIn){
      this.getUserName();
    }
  }

  changeLogin(){
    this.isLoggedIn = this.authService.isLoggedIn();
  }


  toggleDropdown() {
    this.shodDropdown =!this.shodDropdown;
  }

  toggleMobileMenu() {
    this.showMobileMenu =!this.showMobileMenu;
  }

  logout() {
    this.authService.logout();
  }

  getUserName() {
    let email = localStorage.getItem('usLg');
    if(email!= null){
      this.userService.getUserByEmail(email).subscribe({
        next: (user) => {
          this.username = user.username;
        },
        error: (error) => {
          console.log(error);
        }
      });
    } 
  }
}

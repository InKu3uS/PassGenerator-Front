import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Redirect to login page if not logged in
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

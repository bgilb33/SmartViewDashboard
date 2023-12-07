// auth.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated: boolean = false;

  login(username: string, password: string): boolean {
    // Implement your authentication logic here
    // Example: Check if the provided username and password are valid
    if (username === 'example' && password === 'password123') {
      console.log('Authenticated!');
      this.isAuthenticated = true;
      return true;
    }
    console.log('Not Authenticated');
    return false;
  }

  logout(): void {
    this.isAuthenticated = false;
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }
}

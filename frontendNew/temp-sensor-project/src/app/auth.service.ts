// auth.service.ts
// trying spark a deploy

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  // Use localStorage to store authentication status
  get isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  set isAuthenticated(status: boolean) {
    localStorage.setItem('isAuthenticated', status.toString());
  }

  // Use localStorage to store labApi
  get labApi(): string {
    return localStorage.getItem('labApi') || '';
  }

  set labApi(api: string) {
    localStorage.setItem('labApi', api);
  }

  constructor(private http: HttpClient) {}

  // Check if the user is authenticated
  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  // API call for user login
  async login(username: string, password: string): Promise<boolean> {
    const loginUrl = 'https://labsensorapi.netlify.app/.netlify/functions/login';

    // No need to hash on the frontend

    // Create headers with content type
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    // Prepare the request body
    const requestBody = {
      labName: username,
      labPassword: password, // Send the plaintext password to the server
    };

    return this.http
      .post(loginUrl, requestBody, { headers: this.getHeaders() })
      .toPromise()
      .then((response: any) => {
        if (response.success) {
          console.log(response);
          this.isAuthenticated = true;
          this.labApi = response.api;
          return true;
        } else {
          this.isAuthenticated = false;
          return false;
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
        this.isAuthenticated = false;
        return false;
      });
  }
  // Simulate user logout
  logout(): void {
    // Clear authentication status on logout
    this.isAuthenticated = false;
  }
}

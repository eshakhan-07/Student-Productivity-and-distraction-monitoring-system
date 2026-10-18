import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';
  showPassword = false;
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    if (!this.email || !this.password) {
      alert('Please enter Email and Password');
      return;
    }

    this.loading = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        alert(res.message || 'Login Successful! 🎉');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Login failed:', err);
        const errorMsg = err.error?.message || 'Login failed. Please check your credentials or ensure the server is running.';
        alert('Login Error: ' + errorMsg);
      }
    });
  }
}
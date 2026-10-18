import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  name = '';
  enrollment = '';
  department = '';
  semester = '';
  email = '';
  mobile = '';
  password = '';
  confirmPassword = '';
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  register() {
    if (
      !this.name ||
      !this.enrollment ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {
      alert('Please fill all required fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const userData = {
      name: this.name,
      enrollment: this.enrollment,
      department: this.department,
      semester: this.semester,
      email: this.email,
      mobile: this.mobile,
      password: this.password
    };

    this.loading = true;

    this.authService.register(userData).subscribe({
      next: (res) => {
        this.loading = false;
        alert(res.message || 'Registration Successful! 🎉');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Registration failed:', err);
        const errorMsg = err.error?.message || 'Registration failed. Please make sure the backend server is running.';
        alert('Registration Error: ' + errorMsg);
      }
    });
  }
}
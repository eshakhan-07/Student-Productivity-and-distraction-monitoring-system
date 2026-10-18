import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface UserProfile {
  _id?: string;
  name: string;
  enrollment: string;
  department?: string;
  semester?: string;
  email: string;
  mobile?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) {}

  // Register new user
  register(userData: {
    name: string;
    enrollment: string;
    department?: string;
    semester?: string;
    email: string;
    mobile?: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, userData);
  }

  // Login existing user
  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials).pipe(
      tap((res) => {
        if (res.success && res.user) {
          this.setCurrentUser(res.user);
        }
      })
    );
  }

  // Get user profile from backend
  getProfile(userIdOrEmail: string): Observable<{ success: boolean; user: UserProfile }> {
    return this.http.get<{ success: boolean; user: UserProfile }>(
      `${this.API_URL}/user/profile/${userIdOrEmail}`
    );
  }

  // Update user profile in backend
  updateProfile(userIdOrEmail: string, data: Partial<UserProfile>): Observable<{ success: boolean; message: string; user: UserProfile }> {
    return this.http.put<{ success: boolean; message: string; user: UserProfile }>(
      `${this.API_URL}/user/profile/${userIdOrEmail}`,
      data
    ).pipe(
      tap((res) => {
        if (res.success && res.user) {
          this.setCurrentUser(res.user);
        }
      })
    );
  }

  // Save current active user into localStorage
  setCurrentUser(user: UserProfile): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('spmsUser', JSON.stringify(user));
    }
  }

  // Get current active user from localStorage
  getCurrentUser(): UserProfile | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('spmsUser');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  // Logout
  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('spmsUser');
    }
    this.router.navigate(['/login']);
  }
}

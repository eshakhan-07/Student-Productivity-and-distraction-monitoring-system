import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, UserProfile } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  user: UserProfile | null = null;
  isEditing = false;
  editData: Partial<UserProfile> = {};
  saving = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    const localUser = this.authService.getCurrentUser();
    if (localUser) {
      this.user = localUser;
      const id = localUser._id || localUser.email;
      this.authService.getProfile(id).subscribe({
        next: (res) => {
          if (res.success && res.user) {
            this.user = res.user;
            this.authService.setCurrentUser(res.user);
          }
        },
        error: (err) => console.warn('Could not sync user profile:', err)
      });
    }
  }

  toggleEdit() {
    if (this.user) {
      this.editData = {
        name: this.user.name,
        department: this.user.department || '',
        semester: this.user.semester || '',
        mobile: this.user.mobile || ''
      };
    }
    this.isEditing = !this.isEditing;
  }

  saveProfile() {
    if (!this.user) return;
    const id = this.user._id || this.user.email;
    this.saving = true;

    this.authService.updateProfile(id, this.editData).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success && res.user) {
          this.user = res.user;
          this.authService.setCurrentUser(res.user);
          alert('Profile updated successfully in MongoDB! 🎉');
          this.isEditing = false;
        }
      },
      error: (err) => {
        this.saving = false;
        console.error('Failed to update profile:', err);
        alert('Failed to update profile: ' + (err.error?.message || 'Server error'));
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
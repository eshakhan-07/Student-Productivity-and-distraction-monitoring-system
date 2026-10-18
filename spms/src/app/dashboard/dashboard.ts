import { RouterLink } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {

  user: UserProfile | null = null;

  @ViewChild('camera') camera!: ElementRef<HTMLVideoElement>;

  tabChanged = false;
  private stream: MediaStream | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {

    this.user = this.authService.getCurrentUser();

    // Backend se profile refresh
    if (this.user?._id || this.user?.email) {

      const identifier = this.user._id || this.user.email;

      this.authService.getProfile(identifier).subscribe({
        next: (res) => {
          if (res.success && res.user) {
            this.user = res.user;
            this.authService.setCurrentUser(res.user);
          }
        },

        error: (err) => {
          console.warn('Could not sync user profile from server:', err);
        }
      });
    }

    // Tab switch detection
    document.addEventListener('visibilitychange', this.checkTab);
  }

  ngAfterViewInit() {
    this.startCamera();
  }

  async startCamera() {

    try {

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      this.camera.nativeElement.srcObject = this.stream;

    } catch (error) {

      console.log('Camera permission denied:', error);

    }
  }

  checkTab = () => {

    if (document.hidden) {

      this.tabChanged = true;

      alert('⚠️ Distraction detected! Please return to SPMS.');

    } else {

      this.tabChanged = false;
    }
  };

  logout() {

    this.stopCamera();
    this.authService.logout();

  }

  stopCamera() {

    if (this.stream) {

      this.stream.getTracks().forEach(track => track.stop());

      this.stream = null;
    }
  }

  ngOnDestroy() {

    document.removeEventListener('visibilitychange', this.checkTab);

    this.stopCamera();

  }
}
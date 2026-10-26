import { RouterLink, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, UserProfile } from '../services/auth.service';
import { CameraService } from '../camera.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, AfterViewInit, OnDestroy {
  user: UserProfile | null = null;

  @ViewChild('camera') camera!: ElementRef<HTMLVideoElement>;

  tabChanged = false;
  private stream: MediaStream | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cameraService: CameraService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();

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
          console.warn('Could not sync profile:', err);
        }
      });
    }

    document.addEventListener('visibilitychange', this.checkTab);
  }

  async ngAfterViewInit() {
    try {
      this.stream = await this.cameraService.startCamera();

      if (this.camera?.nativeElement) {
        this.camera.nativeElement.srcObject = this.stream;
        await this.camera.nativeElement.play();
      }
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
    this.cameraService.stopCamera();
    this.stream = null;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    document.removeEventListener('visibilitychange', this.checkTab);

    // Camera ko yahan stop nahi karna hai.
    // Shared service stream ko active rakhegi.
  }
}
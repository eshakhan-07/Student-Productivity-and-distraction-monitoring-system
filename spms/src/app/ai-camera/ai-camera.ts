import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-camera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-camera.html',
  styleUrls: ['./ai-camera.css']
})
export class AiCameraComponent implements OnDestroy {
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;

  running = false;
  message = 'Camera is off';
  focusScore = 100;
  warnings = 0;
  private stream?: MediaStream;

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      this.video.nativeElement.srcObject = this.stream;
      await this.video.nativeElement.play();

      this.running = true;
      this.message = 'Camera is on';
    } catch {
      this.message = 'Please allow camera permission';
    }
  }

  stopCamera() {
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = undefined;
    this.running = false;
    this.message = 'Camera is off';
  }

  ngOnDestroy() {
    this.stopCamera();
  }
}
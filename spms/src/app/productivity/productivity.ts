import { Component, ElementRef, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

@Component({
  selector: 'app-productivity',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './productivity.html',
  styleUrl: './productivity.css'
})
export class Productivity implements OnDestroy {
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;

  seconds = 0;
  studyHours = 24;
  distractions = 0;
  timer: any = null;
  stream?: MediaStream;
  faceModel?: FaceLandmarker;
  phoneModel?: cocoSsd.ObjectDetection;

  message = 'Camera is off';
  warnings = 0;
  focusScore = 100;
  cameraRunning = false;
  loading = false;
  private frame: any;
  private busy = false;
  private lastWarning = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  get isRunning() {
    return this.timer !== null;
  }
  get time() {
    const m = Math.floor(this.seconds / 60);
    const s = this.seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  async startTimer() {
    if (this.isRunning || this.loading) return;
    this.loading = true;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video.nativeElement.srcObject = this.stream;
      await this.video.nativeElement.play();

      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
      );

      this.faceModel = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
        },
        runningMode: 'VIDEO',
        outputFaceBlendshapes: true
      });

      this.phoneModel = await cocoSsd.load();

      this.cameraRunning = true;
      this.message = 'Camera is monitoring your focus';
      this.timer = setInterval(() => {
        this.seconds++;
        this.cdr.detectChanges();
      }, 1000);

      document.addEventListener('visibilitychange', this.tabChange);
      this.detect();
    } catch (error) {
      console.error(error);
      this.message = 'Camera/model error. Allow camera permission and check internet.';
      this.stopCamera();
    }

    this.loading = false;
    this.cdr.detectChanges();
  }

  tabChange = () => {
    if (document.hidden && this.isRunning) {
      clearInterval(this.timer);
      this.timer = null;
      this.warnings++;
      this.focusScore = Math.max(0, this.focusScore - 5);
      this.message = 'Warning: You changed the browser tab!';
      this.stopCamera();
      this.cdr.detectChanges();
    }
  };

  detect() {
    if (!this.cameraRunning) return;

    const video = this.video.nativeElement;

    if (video.readyState >= 2) {
      const result = this.faceModel?.detectForVideo(video, performance.now());
      const eyes = result?.faceBlendshapes?.[0]?.categories ?? [];
      const left = eyes.find(x => x.categoryName === 'eyeBlinkLeft')?.score ?? 0;
      const right = eyes.find(x => x.categoryName === 'eyeBlinkRight')?.score ?? 0;

      if (!result?.faceLandmarks?.length) {
        this.warn('Warning: Face not detected!');
      } else if (left > 0.65 && right > 0.65) {
        this.warn('Warning: Eyes may be closed!');
      }

      if (this.phoneModel && !this.busy) {
        this.busy = true;
        this.phoneModel.detect(video).then(objects => {
          if (objects.some(x => x.class === 'cell phone' && x.score > 0.5)) {
            this.warn('Warning: Phone detected!');
          }
        }).finally(() => this.busy = false);
      }
    }

    this.frame = requestAnimationFrame(() => this.detect());
  }

  warn(text: string) {
    if (Date.now() - this.lastWarning < 5000) return;
    this.lastWarning = Date.now();
    this.message = text;
    this.warnings++;
    this.focusScore = Math.max(0, this.focusScore - 5);
    this.cdr.detectChanges();
  }

  stopCamera() {
    this.cameraRunning = false;
    cancelAnimationFrame(this.frame);
    document.removeEventListener('visibilitychange', this.tabChange);
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = undefined;
    this.faceModel?.close();
    this.faceModel = undefined;
    this.phoneModel = undefined;
    this.busy = false;

    if (this.video?.nativeElement) {
      this.video.nativeElement.srcObject = null;
    }
  }

  pauseTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.stopCamera();
    this.message = 'Session paused';
  }

  resetTimer() {
    this.pauseTimer();
    this.seconds = 0;
    this.warnings = 0;
    this.focusScore = 100;
    this.message = 'Camera is off';
  }

  ngOnDestroy() {
    this.pauseTimer();
  }
}
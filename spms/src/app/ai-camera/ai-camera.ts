import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

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
  warnings = 0;
  focus = 100;
  focusScore = 100;

  stream?: MediaStream;
  faceModel?: FaceLandmarker;
  phoneModel?: cocoSsd.ObjectDetection;
  private frame = 0;
  private busy = false;

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });

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
      this.video.nativeElement.srcObject = this.stream;
      await this.video.nativeElement.play();

      this.running = true;
      this.message = 'Monitoring started';
      document.addEventListener('visibilitychange', this.tabChange);
      this.detect();
    } catch {
      this.message = 'Camera/model error. Allow camera and check internet.';
      this.stop();
    }
  }

  tabChange = () => {
    if (document.hidden && this.running) this.warn('Tab changed!');
  };

  detect() {
    if (!this.running) return;

    const video = this.video.nativeElement;
    if (video.readyState >= 2) {
      const result = this.faceModel?.detectForVideo(video, performance.now());
      const eyes = result?.faceBlendshapes?.[0]?.categories ?? [];
      const left = eyes.find(x => x.categoryName === 'eyeBlinkLeft')?.score ?? 0;
      const right = eyes.find(x => x.categoryName === 'eyeBlinkRight')?.score ?? 0;

      if (!result?.faceLandmarks?.length) this.warn('Face not detected!');
      else if (left > 0.65 && right > 0.65) this.warn('Eyes closed!');

      if (this.phoneModel && !this.busy) {
        this.busy = true;
        this.phoneModel.detect(video).then(objects => {
          if (objects.some(x => x.class === 'cell phone' && x.score > 0.5))
            this.warn('Phone detected!');
        }).finally(() => this.busy = false);
      }
    }

    this.frame = requestAnimationFrame(() => this.detect());
  }

  warn(text: string) {
    this.message = text;
    this.warnings++;
    this.focus = Math.max(0, this.focus - 5);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.frame);
    document.removeEventListener('visibilitychange', this.tabChange);
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = undefined;
    this.faceModel?.close();
    this.faceModel = undefined;
    this.phoneModel = undefined;

    if (this.video?.nativeElement) this.video.nativeElement.srcObject = null;
    this.message = 'Camera stopped';
  }

  ngOnDestroy() {
    this.stop();
  }
}
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  stream?: MediaStream;

  async startCamera() {
    if (this.stream?.active) return this.stream;

    this.stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    return this.stream;
  }

  stopCamera() {
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = undefined;
  }
}
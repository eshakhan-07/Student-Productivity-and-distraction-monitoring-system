import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-productivity',
  standalone: true,
  templateUrl: './productivity.html',
  styleUrl: './productivity.css'
})
export class Productivity implements OnDestroy {
  seconds = 0;
  timer: any;
  studyHours = 24;
  focusScore = 89;
  distractions = 6;
constructor(private cdr: ChangeDetectorRef) {}
  get isRunning(): boolean {
  return this.timer !== null;
}
  get time(): string {
    const m = Math.floor(this.seconds / 60);
    const s = this.seconds % 60;

    return String(m).padStart(2, '0') + ':' +
           String(s).padStart(2, '0');
  }

  startTimer() {
    if (this.timer) return;

    this.timer = setInterval(() => {
      this.seconds++;
      this.cdr.detectChanges();
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.timer);
    this.timer = null;
  }

  resetTimer() {
    this.pauseTimer();
    this.seconds = 0;
  }

  ngOnDestroy() {
    this.pauseTimer();
  }
}
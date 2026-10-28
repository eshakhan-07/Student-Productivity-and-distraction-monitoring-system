import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productivity',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './productivity.html',
  styleUrl: './productivity.css'
})
export class Productivity implements OnDestroy {
  seconds = 0;
  timer: ReturnType<typeof setInterval> | null = null;

  studyHours = 24;
  focusScore = 89;
  distractions = 6;

  testMessage = 'Button not clicked';

  testTimer(): void {
    this.testMessage = 'Button is working!';
  }

  constructor(private cdr: ChangeDetectorRef) {}

  get isRunning(): boolean {
    return this.timer !== null;
  }

  startTimer(): void {
    if (this.timer !== null) {
      return;
    }

    this.timer = setInterval(() => {
      this.seconds++;
      this.cdr.detectChanges();
    }, 1000);
  }

  pauseTimer(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
      this.cdr.detectChanges();
    }
  }

  resetTimer(): void {
    this.pauseTimer();
    this.seconds = 0;
    this.cdr.detectChanges();
  }

  get time(): string {
    const min = Math.floor(this.seconds / 60);
    const sec = this.seconds % 60;

    return `${min.toString().padStart(2, '0')}:${sec
      .toString()
      .padStart(2, '0')}`;
  }

  ngOnDestroy(): void {
    this.pauseTimer();
  }
}
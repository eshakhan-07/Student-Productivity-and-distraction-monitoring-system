import { Component } from '@angular/core';

@Component({
  selector: 'app-productivity',
  standalone: true,
  templateUrl: './productivity.html',
  styleUrl: './productivity.css'
})
export class Productivity {

  seconds = 0;
  timer: any;

  studyHours = 24;
  focusScore = 89;
  distractions = 6;

  startTimer() {
    if (!this.timer) {
      this.timer = setInterval(() => {
        this.seconds++;
      }, 1000);
    }
  }

  pauseTimer() {
    clearInterval(this.timer);
    this.timer = null;
  }

  resetTimer() {
    this.pauseTimer();
    this.seconds = 0;
  }

  get time() {
    const min = Math.floor(this.seconds / 60);
    const sec = this.seconds % 60;

    return `${min.toString().padStart(2, '0')}:${sec
      .toString()
      .padStart(2, '0')}`;
  }
}
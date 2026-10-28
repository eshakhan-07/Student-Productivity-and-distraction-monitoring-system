import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './assignments.html',
  styleUrl: './assignments.css'
})
export class Assignments {
  title = '';
  subject = '';
  dueDate = '';
  tasks: any[] = [];

  addTask() {
    if (this.title && this.subject && this.dueDate) {
      this.tasks.push({
        title: this.title,
        subject: this.subject,
        dueDate: this.dueDate,
        done: false
      });

      this.title = '';
      this.subject = '';
      this.dueDate = '';
    }
  }
}
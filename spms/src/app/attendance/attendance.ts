import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css'
})
export class Attendance {

  selectedMonth = 'August';

  data: any = {

  January: [
    { name: 'Software Engineering', percent: 88 },
    { name: 'Advanced Web Technology', percent: 85 },
    { name: 'Database Management', percent: 90 },
    { name: 'Artificial Intelligence', percent: 87 },
    { name: 'Computer Networks', percent: 91 },
    { name: 'Microprocessor', percent: 84 }
  ],

  February: [
    { name: 'Software Engineering', percent: 90 },
    { name: 'Advanced Web Technology', percent: 87 },
    { name: 'Database Management', percent: 92 },
    { name: 'Artificial Intelligence', percent: 89 },
    { name: 'Computer Networks', percent: 93 },
    { name: 'Microprocessor', percent: 86 }
  ],

  March: [
    { name: 'Software Engineering', percent: 91 },
    { name: 'Advanced Web Technology', percent: 88 },
    { name: 'Database Management', percent: 93 },
    { name: 'Artificial Intelligence', percent: 90 },
    { name: 'Computer Networks', percent: 94 },
    { name: 'Microprocessor', percent: 87 }
  ],

  April: [
    { name: 'Software Engineering', percent: 89 },
    { name: 'Advanced Web Technology', percent: 90 },
    { name: 'Database Management', percent: 91 },
    { name: 'Artificial Intelligence', percent: 88 },
    { name: 'Computer Networks', percent: 92 },
    { name: 'Microprocessor', percent: 85 }
  ],

  May: [
    { name: 'Software Engineering', percent: 93 },
    { name: 'Advanced Web Technology', percent: 91 },
    { name: 'Database Management', percent: 94 },
    { name: 'Artificial Intelligence', percent: 92 },
    { name: 'Computer Networks', percent: 95 },
    { name: 'Microprocessor', percent: 89 }
  ],

  June: [
    { name: 'Software Engineering', percent: 90 },
    { name: 'Advanced Web Technology', percent: 89 },
    { name: 'Database Management', percent: 92 },
    { name: 'Artificial Intelligence', percent: 91 },
    { name: 'Computer Networks', percent: 93 },
    { name: 'Microprocessor', percent: 88 }
  ],

  July: [
    { name: 'Software Engineering', percent: 87 },
    { name: 'Advanced Web Technology', percent: 86 },
    { name: 'Database Management', percent: 90 },
    { name: 'Artificial Intelligence', percent: 88 },
    { name: 'Computer Networks', percent: 91 },
    { name: 'Microprocessor', percent: 85 }
  ],

  August: [
    { name: 'Software Engineering', percent: 92 },
    { name: 'Advanced Web Technology', percent: 89 },
    { name: 'Database Management', percent: 95 },
    { name: 'Artificial Intelligence', percent: 90 },
    { name: 'Computer Networks', percent: 93 },
    { name: 'Microprocessor', percent: 88 }
  ],

  September: [
    { name: 'Software Engineering', percent: 94 },
    { name: 'Advanced Web Technology', percent: 91 },
    { name: 'Database Management', percent: 96 },
    { name: 'Artificial Intelligence', percent: 93 },
    { name: 'Computer Networks', percent: 95 },
    { name: 'Microprocessor', percent: 90 }
  ],

  October: [
    { name: 'Software Engineering', percent: 90 },
    { name: 'Advanced Web Technology', percent: 94 },
    { name: 'Database Management', percent: 92 },
    { name: 'Artificial Intelligence', percent: 95 },
    { name: 'Computer Networks', percent: 91 },
    { name: 'Microprocessor', percent: 89 }
  ],

  November: [
    { name: 'Software Engineering', percent: 95 },
    { name: 'Advanced Web Technology', percent: 93 },
    { name: 'Database Management', percent: 97 },
    { name: 'Artificial Intelligence', percent: 94 },
    { name: 'Computer Networks', percent: 96 },
    { name: 'Microprocessor', percent: 91 }
  ],

  December: [
    { name: 'Software Engineering', percent: 96 },
    { name: 'Advanced Web Technology', percent: 94 },
    { name: 'Database Management', percent: 98 },
    { name: 'Artificial Intelligence', percent: 95 },
    { name: 'Computer Networks', percent: 97 },
    { name: 'Microprocessor', percent: 93 }
  ]
};
  get subjects() {
    return this.data[this.selectedMonth];
  }
}
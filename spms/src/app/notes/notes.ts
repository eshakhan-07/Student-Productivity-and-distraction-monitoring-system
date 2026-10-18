import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes.html',
  styleUrl: './notes.css'
})
export class Notes {

  subject = '';

  units = [
    'Unit 1',
    'Unit 2',
    'Unit 3',
    'Unit 4',
    'Unit 5'
  ];

  constructor(private route: ActivatedRoute) {
    this.subject =
      this.route.snapshot.paramMap.get('subject') || '';
  }

  openVideo(unit: string) {

    const search = encodeURIComponent(
      this.subject + ' ' + unit + ' lecture'
    );

    window.open(
      'https://www.youtube.com/results?search_query=' + search,
      '_blank'
    );
  }
}
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings implements OnInit {
  name = 'Student';
  email = '';
  theme = 'Dark';
  notifications = true;
  message = '';

  ngOnInit() {
    const saved = localStorage.getItem('spmsSettings');

    if (saved) {
      const data = JSON.parse(saved);
      this.name = data.name;
      this.email = data.email;
      this.theme = data.theme;
      this.notifications = data.notifications;
    }

    document.body.classList.toggle(
      'light-theme',
      this.theme === 'Light'
    );
  }

  changeTheme() {
    document.body.classList.toggle(
      'light-theme',
      this.theme === 'Light'
    );
  }

  saveSettings() {
    localStorage.setItem('spmsSettings', JSON.stringify({
      name: this.name,
      email: this.email,
      theme: this.theme,
      notifications: this.notifications
    }));

    this.changeTheme();
    this.message = 'Settings saved successfully!';
  }
}
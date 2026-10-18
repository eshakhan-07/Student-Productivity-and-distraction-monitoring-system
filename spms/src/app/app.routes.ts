import { Routes } from '@angular/router';
import { Register } from './register/register';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Profile } from './profile/profile';
import { Subjects } from './subjects/subjects';
import { Notes } from './notes/notes';
import { Attendance } from './attendance/attendance';
import { Productivity } from './productivity/productivity';
import { AiCameraComponent } from './ai-camera/ai-camera';

export const routes: Routes = [
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'profile', component: Profile },
  { path: 'subjects', component: Subjects },
  { path: 'notes/:subject', component: Notes },
  { path: 'attendance', component: Attendance },
  { path: 'productivity', component: Productivity },
  { path: 'ai-camera', component: AiCameraComponent },
  { path: '', redirectTo: 'register', pathMatch: 'full' }
];
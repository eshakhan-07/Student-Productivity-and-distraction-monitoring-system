import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Assignment {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
}

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assignments.html',
  styleUrls: ['./assignments.css']
})
export class AssignmentsComponent {
  assignments: Assignment[] = [
    {
      id: 1,
      title: 'SPMS Project Report',
      subject: 'Software Engineering',
      dueDate: '20 October 2026',
      priority: 'High',
      status: 'Pending'
    },
    {
      id: 2,
      title: 'React Components Practical',
      subject: 'Advanced Web Technology',
      dueDate: '22 October 2026',
      priority: 'Medium',
      status: 'In Progress'
    },
    {
      id: 3,
      title: 'Research Paper Review',
      subject: 'Data Science',
      dueDate: '25 October 2026',
      priority: 'High',
      status: 'Completed'
    },
    {
      id: 4,
      title: 'Algorithm Analysis',
      subject: 'Design and Analysis of Algorithms',
      dueDate: '28 October 2026',
      priority: 'Low',
      status: 'Pending'
    }
  ];

  get pendingCount(): number {
    return this.assignments.filter(a => a.status === 'Pending').length;
  }

  get progressCount(): number {
    return this.assignments.filter(a => a.status === 'In Progress').length;
  }

  get completedCount(): number {
    return this.assignments.filter(a => a.status === 'Completed').length;
  }

  markCompleted(id: number): void {
    this.assignments = this.assignments.map(a =>
      a.id === id ? { ...a, status: 'Completed' } : a
    );
  }

  startAssignment(id: number): void {
    this.assignments = this.assignments.map(a =>
      a.id === id ? { ...a, status: 'In Progress' } : a
    );
  }
}
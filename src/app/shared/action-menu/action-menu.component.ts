import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { AdmissionRecord } from '../../pages/admission/_models/entry-students.model';
import type { IRegisteredStudent } from '../../pages/admission/_models/registered-student.model';

// Interface
export interface ActionItem {
  label: string;
  icon: string;
  type?: 'default' | 'danger';
  disable?: boolean;
  action: string;
}

@Component({
  selector: 'app-action-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-menu.component.html',
  styleUrl: './action-menu.component.scss'
})
export class ActionMenuComponent {
  @Input() id = '';
  @Input() student!: AdmissionRecord & IRegisteredStudent;
  @Input() actions: ActionItem[] = [];
  @Output() onAction = new EventEmitter<{id: string, student: AdmissionRecord & IRegisteredStudent; action: string}>();

  showMenu = false;

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  select(action: string): void {
    this.onAction.emit({id: this.id, student: this.student, action});
    this.showMenu = false;
  }
}

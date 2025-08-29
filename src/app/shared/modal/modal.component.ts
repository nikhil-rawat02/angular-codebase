import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() loading: boolean = false;
  @Input() isOpen: boolean = false;
  @Input() actionText?: string;
  @Input() resetForm?: string;
  @Input() modalAction?: () => void;
  @Input() width: 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'lg';
  @Input() closeText?: string;
  @Input() onReset?: () => void;
  @Output() closeModal = new EventEmitter<void>();


  get modalWidth(): string {
    return {
      sm: 'max-w-sm',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      '2xl': 'max-w-[90rem]',
    }[this.width] || 'max-w-lg';
  }

  close() {
    this.closeModal.emit();
  }

  reset() {
    if (this.onReset) {      
      this.onReset();
    }
  }

  onAction() {
    if (this.modalAction) {
      this.modalAction();
    }
  }
}

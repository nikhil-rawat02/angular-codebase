import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-custom-filter',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './custom-filter.component.html',
  styleUrl: './custom-filter.component.scss'
})
export class CustomFilterComponent {
  isFilterOpen: boolean = false;
  @Input() width: 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'xl';
  @Output() resetForm = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  toggleReportFilter(isOpen: boolean) {
    this.isFilterOpen = isOpen;
  }

  onSubmit = () => {
    this.isFilterOpen = false;
    this.submit.emit();
  }

  reset() {    
    // this.isFilterOpen = false;
    this.resetForm.emit();
  }

  closeModal() {
    this.isFilterOpen = false;
  }
}

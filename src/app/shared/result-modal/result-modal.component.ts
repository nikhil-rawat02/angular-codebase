import type { WritableSignal } from '@angular/core';
import { Component, Input } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { CommonModule } from '@angular/common';
import type { ResultDTO } from '../_model/shared.model';

@Component({
  selector: 'app-result-modal',
  standalone: true,
  imports: [ModalComponent, CommonModule],
  templateUrl: './result-modal.component.html',
  styleUrl: './result-modal.component.scss',
})
export class ResultModalComponent {
  @Input() result!: WritableSignal<ResultDTO | null>;

  closeModal(): void {
    this.result.set(null)
  }
}

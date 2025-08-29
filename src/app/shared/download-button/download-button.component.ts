import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-download-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './download-button.component.html',
  styleUrl: './download-button.component.scss'
})
export class DownloadButtonComponent {
  isDropdownOpen = false;

  @Output() downloadType = new EventEmitter<string>();

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  downloadFile(type: string) {
    this.isDropdownOpen = false; 
    this.downloadType.emit(type.toUpperCase());
  }
}

import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Directive: AppOnlyNumbersDirective
 * 
 * Use Case:
 * This directive ensures that an input field only allows numeric characters (0-9).
 * 
 * It works for both:
 *  - User typing into the input
 *  - Pasted or programmatically set values
 * 
 * Additionally, it updates the associated Angular FormControl (if used)
 * to keep the form value synchronized and sanitized.
 * 
 * Usage Example:
 * <input type="text" formControlName="depositAmt" appAppOnlyNumbers />
 * 
 * This will automatically prevent any non-numeric characters from being entered
 * and ensures that the underlying FormControl has a clean numeric value.
 */
@Directive({
  selector: '[appAppOnlyNumbers]',
  standalone: true,
})
export class AppOnlyNumbersDirective {
  private readonly el = inject(ElementRef) as ElementRef<HTMLInputElement>;
  private readonly control = inject(NgControl, { optional: true });

  @HostListener('input', ['$event'])
  onInput(): void {
    const input = this.el.nativeElement;
    const originalValue = input.value;

    // Remove all non-digit characters
    const sanitized = originalValue.replace(/[^0-9]/g, '');

    if (sanitized !== originalValue) {
      input.value = sanitized;

      // Update form control if available
      if (this.control?.control) {
        this.control.control.setValue(sanitized || null, { emitEvent: true });
      }

      // Dispatch input event to ensure Angular detects changes
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}

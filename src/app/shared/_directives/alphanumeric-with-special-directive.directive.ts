import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Directive: AlphanumericWithSpecialDirectiveDirective
 * 
 * Use Case:
 * This directive ensures that an input field only allows:
 *  - Uppercase letters (A-Z)
 *  - Lowercase letters (a-z)
 *  - Numbers (0-9)
 *  - Certain special characters: hyphen (-), underscore (_), and slash (/)
 * 
 * It works for both:
 *  - User typing into the input
 *  - Pasted or programmatically set values
 * 
 * Additionally, it updates the associated Angular FormControl (if used)
 * to keep the form value synchronized and sanitized.
 * 
 * Usage Example:
 * <input type="text" formControlName="username" appAlphanumericWithSpecialDirective />
 * 
 * This will automatically prevent any invalid characters from being entered.
 */
@Directive({
  selector: '[appAlphanumericWithSpecialDirective]',
  standalone: true,
})
export class AlphanumericWithSpecialDirectiveDirective {
  private readonly el = inject(ElementRef) as ElementRef<HTMLInputElement>;
  private readonly control = inject(NgControl, { optional: true });

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;
    const sanitized = input.value.replace(/[^a-zA-Z0-9\-_/]/g, '');
    if (sanitized !== input.value) {
      input.value = sanitized;
      if (this.control?.control) {
        this.control.control.setValue(sanitized, { emitEvent: true });
      }
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}

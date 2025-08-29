import { Directive, ElementRef, HostListener } from "@angular/core";
import { NgControl } from "@angular/forms";

/**
 * Directive that trims input values on blur.
 * If trimmed value is empty, clears the input.
 *
 * Usage: Add `trimInput` to an input element using `FormControlName` and 
 * reflect trimmed value in the DOM so that if empty spaces is there show placeholder
 * */
@Directive({
  selector: "[trimInput]",
  standalone: true,
})
export class TrimInputDirective {
  constructor(
    private ngControl: NgControl,
    private el: ElementRef<HTMLInputElement>
  ) {}

  @HostListener("blur")
  onBlur(): void {
    const control = this.ngControl?.control;
    const value = control?.value;

    if (typeof value === "string") {
      const trimmed = value.trim();

      // Update the form control
      control?.setValue(trimmed || "", { emitEvent: false });

      //
      this.el.nativeElement.value = trimmed || "";
    }
  }
}

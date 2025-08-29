import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AppService } from '../../app.service';
import { catchError, map, Observable, of } from 'rxjs';

/**
 * Validator to check if the input contains only alphabets (letters and spaces).
 */
export function allStringValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /^[a-zA-Z\s]+$/.test(control.value);
    return valid ? null : { allString: true };
  };
}

/**
 * Validator to check if the input contains only numbers.
 */
export function allNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /^[1-9][0-9]*$/.test(control.value);
    return valid ? null : { allNumber: true };
  };
}

/**
 * Async + Sync Mobile Number Validator
 *
 * This validator performs:
 * 1. Required check → ensures the value is not empty or null.
 * 2. Numeric check → ensures only digits are entered.
 * 3. Length check → requires at least 9 digits.
 * 4. Async uniqueness check → calls the AppService to verify
 *    if the mobile number already exists (skips if above checks fail).
 *
 * Returns:
 *  - { required: true }     → if the field is empty
 *  - { inValid: true }      → if non-numeric characters are present
 *  - { lengthCheck: true }  → if length is less than 9 digits
 *  - { phoneExists: true }  → if the mobile number already exists (async)
 *  - null                   → if all validations pass
 */
export function mobileNumberValidator(
  service: AppService,
  regNo: string | null = null
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = control.value;

    // --- Sync validations first ---
    if (value === '' || value === null) {
      return of({ required: true });
    }

    const regex = new RegExp('^[0-9]*$');
    if (!regex.test(value)) {
      return of({ inValid: true });
    }

    if (value.length < 9) {
      return of({ lengthCheck: true });
    }

    // --- If sync validations pass, call async check ---
    return service.checkIfPhoneNoExists(value, regNo).pipe(
      map((res) => {
        return res?.result?.toUpperCase() === 'FAILED' ? { phoneExists: true } : null;
      }),
      catchError(() => of(null))
    );
  };
}

/**
 * Validator for a strong password.
 * - Minimum 10 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character
 * - No spaces allowed
 */
export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const strongRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])(?=\S+$).{10,}$/;
    return strongRegex.test(control.value) ? null : { strongPassword: true };
  };
}

/**
 * Validator to check if the input contains no spaces.
 */
export function noSpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value && control.value.includes(' ') ? { noSpaces: true } : null;
  };
}

/**
 * Validator to check if two fields match (e.g., password & confirm password).
 */
export function matchValidator(matchTo: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.parent && control.value === control.parent.get(matchTo)?.value
      ? null
      : { mustMatch: true };
  };
}

/**
 * Validator to check if the input contains only letters and numbers (no special characters).
 */
export function noSpecialCharsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /^[a-zA-Z0-9]+$/.test(control.value);
    return valid ? null : { noSpecialChars: true };
  };
}

/**
 * Validator to check if a date is not in the future.
 */
export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputDate = new Date(control.value);
    const today = new Date();
    return inputDate > today ? { futureDate: true } : null;
  };
}

/**
 * Validator to check if a person is at least a certain age (e.g., 18 years old).
 */
export function ageValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const birthDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= minAge ? null : { minAge: true };
  };
}

/**
 * Custom email validator for stricter email validation.
 */
export function customEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(control.value);
    return valid ? null : { invalidEmail: true };
  };
}

/**
 * Validator for minimum and maximum length.
 */
export function minLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value && control.value.length >= minLength ? null : { minLength: true };
  };
}

export function maxLengthValidator(maxLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value && control.value.length <= maxLength ? null : { maxLength: true };
  };
}

/**
 * Validator that ensures a form control value is not empty or only whitespace.
 *
 * @param control - The form control to validate.
 * @returns A validation error object if the trimmed value is empty; otherwise, null.
 */
export function requiredTrimValidator(control: AbstractControl): ValidationErrors | null {
  const rawValue = control.value;

  if (typeof rawValue === 'string' && rawValue.trim().length === 0) {
    return { required: true };
  }

  return null;
}

/**
 * Validator that ensures the uploaded file is a valid image and within size limits.
 *
 * Validates that:
 * - The file is of type PNG, JPG, or JPEG.
 * - The file size is less than or equal to 1MB.
 *
 * @returns A validator function that takes a form control and returns a validation error object
 *          if the file is invalid; otherwise, null.
 */
export function imageValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value;

    if (!file) return null;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSizeInBytes = 1 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return { invalidType: true };
    }

    if (file.size > maxSizeInBytes) {
      return { maxSizeExceeded: true };
    }

    return null;
  };
}

/**
 * Validator that ensures the selected year is not in the future.
 *
 * @param control - The form control to validate.
 * @returns A validation error object if the selected year is above the current year; otherwise, null.
 */
export function yearValidator(control: AbstractControl): ValidationErrors | null {
  const currentYear = new Date().getFullYear();
  const selectedYear = Number(control.value);

  if (selectedYear && selectedYear > currentYear) {
    return { yearAboveCurrent: true };
  }

  return null;
}

/**
 * Validator that ensures the uploaded file is a valid image or PDF and within size limits.
 *
 * Validates that:
 * - The file is of type PNG, JPG, JPEG, or PDF.
 * - The file size is less than or equal to 1MB.
 *
 * @returns A validator function that takes a form control and returns a validation error object
 *          if the file is invalid; otherwise, null.
 */
export function fileValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value;

    if (!file) return null;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    const maxSizeInBytes = 1 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return { invalidType: true };
    }

    if (file.size > maxSizeInBytes) {
      return { maxSizeExceeded: true };
    }

    return null;
  };
}

/**
 * Creates a custom validator that checks if the control's value is one of the allowed values.
 *
 * @param allowedValues - An array of strings that are considered valid values.
 * @return A ValidatorFn that returns null if valid, or a validation error object if not.
 */
export function allowedValuesValidator(allowedValues: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return allowedValues.includes(control.value) ? null : { invalidValue: true };
  };
}

// For checking exam time is between two dates
export function examTimeBetween(startDate: Date, endDate: Date): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    if (!value) return null;

    const examDate = new Date(value);
    if (examDate < startDate || examDate > endDate) {
      return { examTimeOutOfRange: true };
    }

    return null;
  };
}

export function depositAmountValidator(
  controlName: string,
  totalAmountFn: () => number
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control || !control.get) return null;

    const depositCtrl = control.get(controlName);
    if (!depositCtrl) return null;

    const depositAmount = Number(depositCtrl.value || 0);
    const total = totalAmountFn() || 0;

    return depositAmount !== total
      ? { depositLessThanTotal: true }
      : null;
  };
}

/**
 * Generic validator to ensure that startDate < endDate
 * @param startControlName Name of the start date FormControl
 * @param endControlName Name of the end date FormControl
 * @param errorKey Key used in the error object if validation fails
 */
export function startDateBeforeEndDateValidator(
  startControlName: string,
  endControlName: string,
  errorKey: string
): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
    const startDateValue = formGroup.get(startControlName)?.value;
    const endDateValue   = formGroup.get(endControlName)?.value;

    if (!startDateValue || !endDateValue) {
      return null; // Skip validation if any date is missing; required validators handle this
    }

    const startDate = new Date(startDateValue);
    const endDate   = new Date(endDateValue);

    if (startDate >= endDate) {
      return { [errorKey]: true };
    }

    return null;
  };
}

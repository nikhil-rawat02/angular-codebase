import {
  Component,
  DestroyRef,
  Input,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  map,
} from 'rxjs';
import { API } from '../../../core/helpers/api-constants';
import { AppService } from '../../../app.service';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-student-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-search.component.html',
  styleUrl: './student-search.component.scss',
})
export class StudentSearchComponent {
  private readonly appService = inject(AppService);
  private readonly destroyRef = inject(DestroyRef);

  registrationNumbers: WritableSignal<any> = signal([]);

  registrationNo = new FormControl('', Validators.required);

  @Input() selectedRegNo!: WritableSignal<string>;

  ngOnInit() {
    // Debounced search for Student registration numbers
    this.registrationNo?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((value) => !!value && value.length > 2),
        switchMap((value) =>
          this.appService.autoSearchStudentRegistrationNo(value || '')
        ),
        map((data) => data.map((item) => item.registrationNo)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (registrationNumbers) => {
          this.registrationNumbers.set(registrationNumbers);
        },
        error: (err) => {
          console.error(
            `Failed to fetch ${API.AUTO_SEARCH_REGISTRATION_NO}:`,
            err
          );
        },
      });
  }

  onFind(){
    if(this.registrationNo.valid){
      this.selectedRegNo.set(this.registrationNo.value || '');
    }else{
      this.registrationNo.markAllAsTouched();
    }
  }

  onReset(){
    this.selectedRegNo.set('');
    this.registrationNumbers.set([]);
    this.registrationNo.reset();
  }
}

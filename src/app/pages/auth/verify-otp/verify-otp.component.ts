import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { AuthService } from '../auth.service';
import { AuthResponse, UserRole } from '../auth.model';
import { CONSTANTS } from '../../../core/helpers/constants';
import { AuthServiceCore } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [ReactiveFormsModule, SpinnerComponent, CommonModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss',
})
export class VerifyOtpComponent {
  private authServiceCore = inject(AuthServiceCore);

  private password: string = '';
  private username: string = '';
  rememberMe: WritableSignal<boolean> = signal(false);
  loading: WritableSignal<boolean> = signal(false);
  errorMsg: WritableSignal<string> = signal<string>('');

  verifyForm = new FormGroup({
    digit1: new FormControl('', [Validators.required]),
    digit2: new FormControl('', [Validators.required]),
    digit3: new FormControl('', [Validators.required]),
    digit4: new FormControl('', [Validators.required]),
    digit5: new FormControl('', [Validators.required]),
    digit6: new FormControl('', [Validators.required]),
  });

  otpCode = computed(() =>
    Object.values(this.verifyForm.value).join('')
  );

  constructor(private router: Router, private authService: AuthService) {
    const navigation = this.router.getCurrentNavigation();
    if (!navigation?.extras.state) {
      this.router.navigateByUrl("login");
      return;
    }

    this.password = navigation?.extras.state["password"];
    this.username = navigation?.extras.state["username"];
    this.rememberMe.set(navigation.extras.state['rememberMe'] === 'true');
    history.replaceState({}, "");
  }

  /** Clear Error Message handler */
  clearErrorMessage() {
    setTimeout(() => {
      this.errorMsg.set('');
    }, 5 * 1000);
  }

  submitCode() {
    if (this.verifyForm.invalid) {
      console.error("Error in login form", this.verifyForm.errors);
      return;
    }

    const code = Object.values(this.verifyForm.value).join("");

    const REQ: { username: string; password: string; otp: string } = {
      username: this.username,
      password: this.password,
      otp: code,
    };

    this.loading.set(true);

    this.authService.confirmOtp(REQ).subscribe({
      next: (response: AuthResponse) => {
        if (response.errorMessage) {
          this.errorMsg.set(response.errorMessage);
          this.clearErrorMessage();
          return;
        }

        // todo: create another storage service to store data in localstorage or session storage
        const storage = this.rememberMe() ? localStorage : sessionStorage;
        storage.setItem(CONSTANTS.TOKEN, response.token);
        storage.setItem(CONSTANTS.USER_DATA, JSON.stringify({userName: response.username, userId: response.userId}));
        storage.setItem('ums-roles', JSON.stringify(response.roles));
        storage.setItem('ums-privilege-list', JSON.stringify(response.privilegeList));

        const roleName = response.roles.name;

        this.authServiceCore.startTokenExpiryTimer();
        
        switch (roleName) {
          case UserRole.Admin:
          case UserRole.APPO:
            this.router.navigate(["/dashboard"]);
            break;
          case UserRole.Student:
            this.router.navigate(["/student"]);
            break;
          case UserRole.Instructor:
            this.router.navigate(["/staff"]);
            break;
          default:
            this.router.navigate(["/dashboard"]);
            break;
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMsg.set('Verify otp failed, Please try again.');
        this.clearErrorMessage();
      },
      complete: () => {
        this.loading.set(false);
      }
    });
}

  moveToNext(event: any, nextInput: any) {
    const input = event.target;
    if (input.value.length === 1 && nextInput) {
      nextInput.focus();
    }
  }
}

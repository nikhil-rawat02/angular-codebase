import { Component, signal, WritableSignal } from '@angular/core';
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
import { AuthResponse } from '../auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  loading:WritableSignal<boolean> = signal(false);
  errorMsg: WritableSignal<string> = signal('');

  rememberMe: WritableSignal<boolean> = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required),
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  /** Clear Error Message handler */
  clearErrorMessage() {
    setTimeout(() => {
      this.errorMsg.set('');
    }, 5 * 1000);
  }

  toggleRemember() {
    this.rememberMe.update(v => !v);
  }

  onRememberChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.rememberMe.set(input.checked);
  }

  onForget() {
    this.router.navigateByUrl('reset-password');
  }

  submitLogin() {
    if (this.loginForm.invalid) {
      console.error('Error in login form', this.loginForm.errors);
      return;
    }

    const REQ = {
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value,
      rememberMe: this.rememberMe(),
    };

    this.loading.set(true);

    this.authService.login(REQ).subscribe({
      next: (res: AuthResponse) => {
        if (res.errorMessage) {
          this.errorMsg.set(res.errorMessage);
          this.clearErrorMessage();
          return;
        }

        if (!res.roles) {
          return;
        }

        if (res.firstlogin === 0) {
          this.router.navigateByUrl('/change-password');
          return;
        }

        this.router.navigateByUrl('/verify-otp', {
          state: { password: REQ.password, username: REQ.username },
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMsg.set('Login failed. Please try again.');
        this.clearErrorMessage();
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

}

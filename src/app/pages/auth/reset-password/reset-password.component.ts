import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../../../app.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { matchValidator, strongPasswordValidator } from '../../../core/validators/global.validators';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  resetForm!: FormGroup;
  showPassword: boolean = false;
  showRePassword: boolean = false;
  loading: boolean = false;
  errorMsg: string = '';
  isSuccess: boolean = false;
  
  // Constants
  TIMEOUT: number = 5;

  constructor(private appService: AppService, private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.resetForm = new FormGroup({
      password: new FormControl('', [Validators.required, strongPasswordValidator()]),
      repassword: new FormControl('', [Validators.required, matchValidator('password')]),
    });
  }

  togglePassword(type: string) {
    if(type==='PASSWORD'){
      this.showPassword = !this.showPassword;
    }else{
      this.showRePassword = !this.showRePassword;
    }
  }

  savePassword() {
    if (this.resetForm.valid) {
      const REQ: { newPassword: string; confirmNewPassword: string } = {
        newPassword: this.resetForm.get('password')?.value,
        confirmNewPassword: this.resetForm.get('repassword')?.value,
      };

      try {
        this.loading = true;
        this.appService.resetPassword(REQ).subscribe({
          next: (res) => {
            this.loading = false;
            this.isSuccess = true;
            localStorage.setItem('token', res.data.accessToken);
            localStorage.setItem('refresh_token', res.data.refreshToken);

            let intervel = setInterval(() => {
              this.TIMEOUT --;
            }, 1000);

            setTimeout(()=>{
              this.router.navigateByUrl('dashboard');
              clearInterval(intervel);
            }, 5 * 1000)
          },
          error: (err) => {
            this.loading = false;
            this.toastr.error('Something went wrong!', 'Error');
          },
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Form Invalid:', this.resetForm.errors);
    }
  }

  onProceed(){
    if(this.isSuccess){
      this.router.navigateByUrl('dashboard');
    }
  }
}

import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { emit } from 'process';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgetpassword',
  imports: [ReactiveFormsModule],
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.scss',
})
export class ForgetpasswordComponent {
  step: number = 1;
  done: string = '';
  isSuccess: boolean = false;
  isLoading: boolean = false;
  isError: boolean = false;
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);
  private readonly _AuthService = inject(AuthService);
  verifyEmail: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]],
  });
  verifyCode: FormGroup = this._FormBuilder.group({
    resetCode: [null, [Validators.required, Validators.pattern(/^\w{5,}$/)]],
  });
  resetPassword: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    newPassword: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]],
  });
  verifyEmailSubmit(): void {
    let emailValue = this.verifyEmail.get('email')?.value;
    this.resetPassword.get('email')?.patchValue(emailValue);
    if (this.verifyEmail.valid) {
      this.isLoading = true;
      this.isSuccess = false;

      this._AuthService.setEmailVerify(this.verifyEmail.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.statusMsg === 'success') {
            this.isLoading = false;
            this.isSuccess = true;
            this.done = res.message;
            setTimeout(() => {
              this.step = 2;
              this.isSuccess = false;
            }, 1500);
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading = true;
          this.isSuccess = false;
        },
      });
    }
  }
  verifyCodeSubmit(): void {
    this.isSuccess = false;
    if (this.verifyCode.valid) {
      this.isLoading = true;
      this.isSuccess = false;
      this._AuthService.setCodeVerify(this.verifyCode.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.status === 'Success') {
            this.isLoading = false;
            this.isSuccess = true;
            setTimeout(() => {
              this.step = 3;
              this.isSuccess = false;
            }, 500);
          }
        },
        error: (err) => {
          this.isLoading = true;
          this.isSuccess = false;
          console.log(err);
        },
      });
    }
  }
  resetPasswordSubmit(): void {
    this.isSuccess = false;
    if (this.resetPassword.valid) {
      this.isLoading = true;
      this.isSuccess = false;
      this._AuthService.setResetPass(this.resetPassword.value).subscribe({
        next: (res) => {
          console.log(res);
          this.isLoading = false;
          this.isSuccess = true;
          setTimeout(() => {
            localStorage.setItem('userToken', res.token);
            this._AuthService.saveUserData();
            this._Router.navigate(['/home']);
          }, 500);
        },
        error: (err) => {
          this.isLoading = true;
          this.isSuccess = false;
          console.log(err);
        },
      });
    }
  }
}

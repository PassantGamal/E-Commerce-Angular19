import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgetpassword',
  imports: [ReactiveFormsModule],
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.scss',
})
export class ForgetpasswordComponent {
  step: WritableSignal<number> = signal(1);
  done: WritableSignal<string> = signal('');
  isSuccess: WritableSignal<boolean> = signal(false);
  isLoading: WritableSignal<boolean> = signal(false);
  isError: WritableSignal<boolean> = signal(false);
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
      this.isLoading.set(true);
      this.isSuccess.set(false);

      this._AuthService.setEmailVerify(this.verifyEmail.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.statusMsg === 'success') {
            this.isLoading.set(false);
            this.isSuccess.set(true);
            this.done.set(res.message);
            setTimeout(() => {
              this.step.set(2);
              this.isSuccess.set(false);
            }, 1500);
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading.set(true);
          this.isSuccess.set(false);
        },
      });
    }
  }
  verifyCodeSubmit(): void {
    this.isSuccess.set(false);
    if (this.verifyCode.valid) {
      this.isLoading.set(true);
      this.isSuccess.set(false);
      this._AuthService.setCodeVerify(this.verifyCode.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.status === 'Success') {
            this.isLoading.set(false);
            this.isSuccess.set(true);
            setTimeout(() => {
              this.step.set(3);
              this.isSuccess.set(false);
            }, 500);
          }
        },
        error: (err) => {
          this.isLoading.set(true);
          this.isSuccess.set(false);
          console.log(err);
        },
      });
    }
  }
  resetPasswordSubmit(): void {
    this.isSuccess.set(false);
    if (this.resetPassword.valid) {
      this.isLoading.set(true);
      this.isSuccess.set(false);
      this._AuthService.setResetPass(this.resetPassword.value).subscribe({
        next: (res) => {
          console.log(res);
          this.isLoading.set(false);
          this.isSuccess.set(true);
          setTimeout(() => {
            localStorage.setItem('userToken', res.token);
            this._AuthService.saveUserData();
            this._Router.navigate(['/home']);
          }, 500);
        },
        error: (err) => {
          this.isLoading.set(true);
          this.isSuccess.set(false);
          console.log(err);
        },
      });
    }
  }
}

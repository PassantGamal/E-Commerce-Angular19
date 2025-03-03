import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly authServices = inject(AuthService);
  private readonly router = inject(Router);
  private readonly _FormBuilder = inject(FormBuilder);

  isLoading: WritableSignal<boolean> = signal(false);
  isSuccess: WritableSignal<string> = signal('');
  msgErorr: WritableSignal<string> = signal('');

  register: FormGroup = this._FormBuilder.group(
    {
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]],
      rePassword: [null, [Validators.required]],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
      ],
    },
    { validators: this.confirmPasswordValidator() }
  );

  confirmPasswordValidator(): ValidatorFn {
    return (group: AbstractControl) => {
      const password = group.get('password')?.value;
      const repassword = group.get('rePassword')?.value;
      return password === repassword ? null : { mismatch: true };
    };
  }

  submitForm(): void {
    if (this.register.valid) {
      this.isLoading.set(true);
      this.authServices.sendRegisterForm(this.register.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            setTimeout(() => {
              localStorage.setItem('userToken', res.token);
              this.authServices.saveUserData();
              this.router.navigate(['/login']);
            }, 500);
            this.isLoading.set(false);
            this.isSuccess.set(res.message);
            this.msgErorr.set('');
          }
        },
        error: (err) => {
          this.isSuccess.set('');
          this.msgErorr.set(err.error.message);
          this.isLoading.set(false);
        },
      });
    } else {
      this.register.setErrors({ mismatch: true });
      this.register.markAllAsTouched();
    }
  }
}

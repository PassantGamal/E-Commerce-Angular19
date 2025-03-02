import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
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
  isLoading: boolean = false;
  isSuccess: string = '';
  msgErorr: string = '';
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
    { validators: this.confirmPassword }
  );

  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const repassword = group.get('rePassword')?.value;
    return password === repassword ? null : { mismatch: true };
  }
  submitForm(): void {
    if (this.register.valid) {
      this.isLoading = true;
      this.authServices.sendRegisterForm(this.register.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            setTimeout(() => {
              localStorage.setItem('userToken', res.token);

              this.authServices.saveUserData();
              this.router.navigate(['/login']);
            }, 500);
            this.isLoading = false;
            this.isSuccess = res.message;
            this.msgErorr = '';
          }
        },
        error: (err) => {
          this.isSuccess = '';
          this.msgErorr = err.error.message;
          this.register.statusChanges.subscribe((status) => {
            this.isLoading = status === 'INVALID';
            this.msgErorr = '';
          });
        },
      });
    } else {
      this.register.setErrors({ mismatch: true });
      this.register.markAllAsTouched();
    }
  }
}

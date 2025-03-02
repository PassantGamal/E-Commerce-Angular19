import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isError: string = '';
  isSuccess: string = '';
  isLoading: boolean = false;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  login: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^\w{6,}$/),
    ]),
  });
  submitForm(): void {
    console.log(this.login);
    if (this.login.valid) {
      this.isLoading = true;
      this.authService.sendLoginForm(this.login.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            localStorage.setItem('userToken', res.token);
            this.authService.saveUserData();
            this.isSuccess = res.message;
            this.isLoading = false;
            this.isError = '';
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 500);
          }
        },
        error: (err) => {
          this.isError = err.error.message;
          this.login.statusChanges.subscribe((status) => {
            this.isLoading = status === 'INVALID';
            this.isError = '';
          });
          this.isSuccess = '';
          this.isLoading = true;
        },
      });
    } else {
      this.login?.setErrors({ mismatch: true });
      this.login.markAllAsTouched();
    }
  }
}

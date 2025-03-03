import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isError: WritableSignal<string> = signal('');
  isSuccess: WritableSignal<string> = signal('');
  isLoading: WritableSignal<boolean> = signal(false);

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
    if (this.login.valid) {
      this.isLoading.set(true);
      this.authService.sendLoginForm(this.login.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            localStorage.setItem('userToken', res.token);
            this.authService.saveUserData();
            this.isSuccess.set(res.message);
            this.isError.set('');
            this.isLoading.set(false);
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 500);
          }
        },
        error: (err) => {
          this.isError.set(err.error.message);
          this.isSuccess.set('');
          this.isLoading.set(false);

          this.login.statusChanges.pipe(take(1)).subscribe((status) => {
            this.isLoading.set(status === 'INVALID');
            this.isError.set('');
          });
        },
      });
    } else {
      this.login.setErrors({ mismatch: true });
      this.login.markAllAsTouched();
    }
  }
}

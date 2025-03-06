import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastrService = inject(ToastrService);
  const router = inject(Router);

  // Check if the request is going to a protected API endpoint
  const isProtectedApi = req.url.includes(`${environment.baseUrl}`); // Change '/api/' to match your API base URL

  return next(req).pipe(
    catchError((err) => {
      if (isProtectedApi && err.status === 401) {
        toastrService.error(
          'You are not logged in. Please login to get access.',
          'FreshCart'
        );
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerComponent, NgxPaginationModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor() {}
  showAlert() {
    Swal.fire({
      title: 'Success!',
      text: 'This is a SweetAlert in Angular 19',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  }
}

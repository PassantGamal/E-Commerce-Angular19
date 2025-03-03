import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../core/services/orders/order.service';
import { CartService } from '../../core/services/cart/cart.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  isSuccess = false;
  msgErorr = false;
  isLoading = false;

  private readonly _FormBuilder = inject(FormBuilder);
  private readonly ActivatedRoute = inject(ActivatedRoute);
  private readonly _OrderService = inject(OrderService);
  private readonly _CartService = inject(CartService);
  private readonly _Router = inject(Router);

  cartId: WritableSignal<string> = signal('');
  paymentMethod: WritableSignal<string> = signal('visa');
  checkout!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.getCartId();

    // استرجاع طريقة الدفع من الرابط
    this.ActivatedRoute.queryParams.pipe(take(1)).subscribe((params) => {
      this.paymentMethod.set(params['payment'] || 'visa');
    });
  }

  initForm(): void {
    this.checkout = this._FormBuilder.group({
      details: [null, [Validators.required, Validators.minLength(3)]],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
      ],
      city: [null, [Validators.required, Validators.minLength(2)]],
    });
  }

  submitForm(): void {
    if (!this.checkout.valid) return;

    this.isLoading = true;

    if (this.paymentMethod() === 'visa') {
      this._OrderService
        .checkoutPayment(this.cartId(), this.checkout.value)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            if (res.status === 'success') {
              window.open(res.session.url, '_self');
              this._CartService.cartNumber.next(res.numOfCartItems);
            }
          },
          error: () => (this.isLoading = false),
        });
    } else {
      this._OrderService
        .cashOrder(this.cartId(), this.checkout.value)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            if (res.status === 'success') {
              this._Router.navigate(['/allorders']);
              this._CartService.cartNumber.next(0);
            }
          },
          error: () => (this.isLoading = false),
        });
    }
  }

  getCartId(): void {
    this.ActivatedRoute.paramMap.pipe(take(1)).subscribe({
      next: (param) => {
        this.cartId.set(param.get('id') ?? '');
      },
    });
  }
}

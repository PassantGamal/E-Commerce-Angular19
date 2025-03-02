import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../core/services/orders/order.service';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  isSuccess: boolean = false;
  msgErorr: boolean = false;
  isLoading: boolean = false;
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly ActivatedRoute = inject(ActivatedRoute);
  private readonly _OrderService = inject(OrderService);
  private readonly _CartService = inject(CartService);
  private readonly _Router = inject(Router);
  cartId: string = '';
  paymentMethod: string = '';
  checkout!: FormGroup;
  ngOnInit(): void {
    this.initForm();
    this.getCartId();
    this.ActivatedRoute.queryParams.subscribe((params) => {
      this.paymentMethod = params['payment'] || 'visa';
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
    if (this.paymentMethod === 'visa') {
      this._OrderService
        .checkoutPayment(this.cartId, this.checkout.value)
        .subscribe({
          next: (res) => {
            if (res.status === 'success') {
              open(res.session.url, '_self');
              this._CartService.cartNumber.next(res.numOfCartItems);
            }
          },
        });
    } else {
      this._OrderService.cashOrder(this.cartId, this.checkout.value).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this._Router.navigate(['/allorders']);
            this._CartService.cartNumber.next(res.numOfCartItems);
          }
        },
      });
    }
  }
  getCartId(): void {
    this.ActivatedRoute.paramMap.subscribe({
      next: (param) => {
        this.cartId = param.get('id')!;
      },
    });
  }
}

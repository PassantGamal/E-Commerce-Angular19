import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/orders/order.service';
import { ICartItem, IOrder } from '../../shared/interfaces/iorder';
import { CurrencyPipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-allorders',
  imports: [CurrencyPipe],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss',
})
export class AllordersComponent implements OnInit {
  private readonly _OrderService = inject(OrderService);

  private readonly _WishlistService = inject(WishlistService);
  cartsId!: string;
  cartOrdered: IOrder[] = [];
  orderNumber: number = 0;
  wishNumber: number = 0;
  totalCartOrder: number = 0;
  isDelivered!: boolean;
  isPaid!: boolean;
  paymentMethodType!: string;
  ngOnInit(): void {
    this.cartsId = this._OrderService.getUserId();
    this.getUserOrder();

    this.getLoggedUser();
  }
  getUserOrder(): void {
    this._OrderService.AllOrders(this.cartsId).subscribe({
      next: (res) => {
        console.log(res);

        this.cartOrdered = res;
        for (let item of res) {
          this.orderNumber += 1;
          this.totalCartOrder += item.totalOrderPrice;
          this.isDelivered = item.isDelivered;
          this.isPaid = item.isPaid;
          this.paymentMethodType = item.paymentMethodType;
        }
      },
    });
  }
  getLoggedUser(): void {
    this._WishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this._WishlistService.wishNumber.next(res.count);
        }
      },
    });
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../shared/interfaces/icart';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cartDetails: ICart = {} as ICart;
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  paymentMethod: string = '';
  ngOnInit(): void {
    this.getCartData();
  }
  getCartData(): void {
    this._CartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartDetails = res.data;
      },
    });
  }

  removeCartItem(id: string): void {
    this._CartService.removeSpecificCartItem(id).subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this._CartService.cartNumber.next(res.numOfCartItems);
        setTimeout(() => {
          this._ToastrService.success('Item Removed Successfully');
        }, 100);
      },
    });
  }
  updateCount(id: string, count: number): void {
    this._CartService.updateProductQuantity(id, count).subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this._CartService.cartNumber.next(res.numOfCartItems);
      },
    });
  }
  deleteAllCart() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D19C97',
      cancelButtonColor: '#D19C97',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this._CartService.clearAllCarts().subscribe({
          next: (res) => {
            if (res.message == 'success') {
              this.cartDetails = {} as ICart;
              this._CartService.cartNumber.next(0);
            }
          },
          error: (err) => {
            console.log(err);
          },
        });
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
        });
      }
    });
  }
}

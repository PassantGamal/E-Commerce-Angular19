import { IProduct } from './../../shared/interfaces/iproduct';
import { Component, inject, OnInit } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IWishlist } from '../../shared/interfaces/iwishlist';
import { TermtextPipe } from '../../shared/pipes/termtext.pipe';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  imports: [TermtextPipe, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent implements OnInit {
  wishList: IWishlist[] = [];
  private readonly _WishlistService = inject(WishlistService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);

  ngOnInit(): void {
    this.getLoggedUserWish();
  }
  getLoggedUserWish(): void {
    this._WishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        if (res.status == 'success') {
          this.wishList = res.data;
          this._WishlistService.wishNumber.next(res.count);
          this._WishlistService.whishList.next(res);
        }
      },
    });
  }
  addToCart(id: string): void {
    this._CartService.addProductToCart(id).subscribe({
      next: (res) => {
        if (res.status == 'success') {
          this._ToastrService.success(res.message, 'FreshCart');
        }
      },
    });
  }
  removeProductFromWish(id: string): void {
    this._WishlistService.removeProductFromWishlist(id).subscribe({
      next: (res) => {
        this.wishList = this.wishList.filter((item) =>
          res.data.includes(item._id)
        );
        this._WishlistService.wishNumber.next(this.wishList.length);
        this._WishlistService.whishList.next(res);
      },
    });
  }
}

import { WishlistService } from './../../core/services/wishlist/wishlist.service';
import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SearchPipe } from '../../shared/pipes/search.pipe';
import { TermtextPipe } from '../../shared/pipes/termtext.pipe';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { IWishlist } from '../../shared/interfaces/iwishlist';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-products',
  imports: [
    FormsModule,
    RouterLink,
    SearchPipe,
    TermtextPipe,
    NgxPaginationModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  allProducts: WritableSignal<IProduct[]> = signal([]);
  text: WritableSignal<string> = signal('');
  wishList: WritableSignal<IWishlist[]> = signal([]);
  p: WritableSignal<number> = signal(1);

  private readonly _WishlistService = inject(WishlistService);
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _Router = inject(Router);

  ngOnInit(): void {
    this._ProductsService.getAllProducts().subscribe({
      next: (res) => {
        this.allProducts.set(res.data);
      },
    });

    this._WishlistService.whishList.subscribe((data) => {
      if (data.length > 0) {
        this.wishList.set(data);
        console.log(this.wishList());
      }
    });
  }

  addToCart(id: string): void {
    this._CartService.addProductToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this._ToastrService.success(res.message, 'FreshCart');
          this._CartService.cartNumber.next(res.numOfCartItems);
        }
      },
    });
  }

  addProductToWishs(id: string): void {
    this._WishlistService.addProductToWishlist(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          console.log(res);
          this.wishList.set(res.data);
          this._WishlistService.wishNumber.next(res.data.length);
          this._ToastrService.success(res.message, 'FreshCart');
        }
      },
    });
  }

  removeProductFromWish(id: string): void {
    this._WishlistService.removeProductFromWishlist(id).subscribe({
      next: (res) => {
        this.wishList.set(res.data);
        this._WishlistService.wishNumber.next(res.data.length);
        this._ToastrService.success(res.message, 'FreshCart');
      },
    });
  }

  getLoggedUser(): void {
    if (!this._Router.url.includes('wishlist')) {
      this._WishlistService.getLoggedUserWishlist().subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.wishList.set(res.data);
            const wish = res.data.map((item: any) => item.id);
            this._WishlistService.whishList = wish;
            this._WishlistService.wishNumber.next(res.data.length);
            console.log(this._WishlistService.whishList);
          }
        },
      });
    }
  }
}

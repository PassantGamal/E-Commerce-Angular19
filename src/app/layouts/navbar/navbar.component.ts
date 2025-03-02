import { Component, HostListener, inject, input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  countNumber: number = 0;
  wishNumber: number = 0;
  readonly _AuthService = inject(AuthService);
  readonly _CartService = inject(CartService);
  readonly _WishlistService = inject(WishlistService);
  private readonly _Router = inject(Router);
  ngOnInit(): void {
    this._CartService.cartNumber.subscribe({
      next: (data) => {
        this.countNumber = data;
      },
    });
    this._CartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this._CartService.cartNumber.next(res.numOfCartItems);
      },
    });
    this._WishlistService.wishNumber.subscribe({
      next: (data) => {
        this.wishNumber = data;
      },
    });

    if (!this._Router.url.includes('whishlist')) {
      this._WishlistService.getLoggedUserWishlist().subscribe({
        next: (res) => {
          if (res.status === 'success') {
            const whishList = res.data.map((item: any) => item._id);
            this._WishlistService.whishList.next(whishList);
            this._WishlistService.wishNumber.next(res.data.length);
            this.wishNumber = res.data.length;
          }
        },
      });
    }
  }

  scroll: boolean = false;
  menuOpen: boolean = false;
  isLogin = input<boolean>(true);
  @HostListener('window:scroll') onScroll() {
    if (scrollY > 0) {
      this.scroll = true;
    } else {
      this.scroll = false;
    }
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}

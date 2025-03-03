import {
  Component,
  HostListener,
  inject,
  signal,
  WritableSignal,
  OnInit,
  Input,
} from '@angular/core';
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
  countNumber: WritableSignal<number> = signal(0);
  wishNumber: WritableSignal<number> = signal(0);
  readonly _AuthService = inject(AuthService);
  readonly _CartService = inject(CartService);
  readonly _WishlistService = inject(WishlistService);
  private readonly _Router = inject(Router);

  @Input() isLogin: boolean = true;
  scroll: boolean = false;
  menuOpen: boolean = false;

  ngOnInit(): void {
    this._CartService.cartNumber.subscribe({
      next: (data) => this.countNumber.set(data),
    });

    this._CartService.getLoggedUserCart().subscribe({
      next: (res) => this._CartService.cartNumber.next(res.numOfCartItems),
    });

    this._WishlistService.wishNumber.subscribe({
      next: (data) => this.wishNumber.set(data),
    });

    if (!this._Router.url.includes('whishlist')) {
      this._WishlistService.getLoggedUserWishlist().subscribe({
        next: (res) => {
          if (res.status === 'success') {
            const wishList = res.data.map((item: any) => item._id);
            this._WishlistService.whishList.next(wishList);
            this._WishlistService.wishNumber.next(res.data.length);
            this.wishNumber.set(res.data.length);
          }
        },
      });
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scroll = window.scrollY > 0;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}

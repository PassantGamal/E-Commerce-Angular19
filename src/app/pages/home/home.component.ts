import { IWishlist } from './../../shared/interfaces/iwishlist';
import { TermtextPipe } from './../../shared/pipes/termtext.pipe';
import { CategoriesService } from './../../core/services/categories/categories.service';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from './../../shared/interfaces/iproduct';
import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ICategory } from '../../shared/interfaces/icategory';
import { SliderComponent } from '../slider/slider.component';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Router, RouterLink } from '@angular/router';
import { SearchPipe } from '../../shared/pipes/search.pipe';
import { FormsModule, NgModel } from '@angular/forms';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-home',
  imports: [
    SliderComponent,
    CarouselModule,
    RouterLink,
    TermtextPipe,
    SearchPipe,
    FormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    autoplay: true,
    autoplayTimeout: 1000,
    autoplayHoverPause: true,
    navText: ['', ''],
    responsive: {
      0: {
        items: 3,
      },
      400: {
        items: 3,
      },
      740: {
        items: 4,
      },
      940: {
        items: 6,
      },
    },
    nav: false,
  };
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly toastrService = inject(ToastrService);
  private readonly cartService = inject(CartService);
  private readonly _WishlistService = inject(WishlistService);
  private readonly _Router = inject(Router);
  products: IProduct[] = [];
  categories: ICategory[] = [];
  wishList: IWishlist[] = [];
  prodId: WritableSignal<string> = signal('');
  text: WritableSignal<string> = signal('');
  ngOnInit(): void {
    this.getProductsData();
    this.getCategoryData();
    this._WishlistService.whishList.subscribe((data) => {
      if (data.length > 0) {
        this.wishList = data;
        console.log(this.wishList);
      }
    });
    this.getLoggedUser();
  }
  getProductsData(): void {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.data;
      },
    });
  }
  getCategoryData(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
      },
    });
  }
  addToCart(id: string): void {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        if (res.status == 'success') {
          this.toastrService.success(res.message, 'FreshCart');
          console.log(res);

          this.cartService.cartNumber.next(res.numOfCartItems);
        }
      },
    });
  }
  addProductToWishs(id: string): void {
    this._WishlistService.addProductToWishlist(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.wishList = res.data;
          this._WishlistService.wishNumber.next(res.data.length);
          this.toastrService.success(res.message, 'FreshCart');
          this.prodId.set(id);
        }
      },
    });
  }
  removeProductFromWish(id: string): void {
    this._WishlistService.removeProductFromWishlist(id).subscribe({
      next: (res) => {
        this.wishList = res.data;
        this._WishlistService.wishNumber.next(res.data.length);
        console.log(res.data.length);

        this.toastrService.success(res.message, 'FreshCart');
      },
    });
  }
  getLoggedUser(): void {
    if (!this._Router.url.includes('whishlist')) {
      this._WishlistService.getLoggedUserWishlist().subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.wishList = res.data;
            this._WishlistService.wishNumber.next(res.count);
          }
        },
      });
    }
  }
}

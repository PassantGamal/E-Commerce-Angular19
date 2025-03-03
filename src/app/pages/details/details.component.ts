import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { OwlOptions, CarouselModule } from 'ngx-owl-carousel-o';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-details',
  imports: [CarouselModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
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
        items: 3,
      },
      940: {
        items: 4,
      },
    },
  };
  private readonly _CartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _ProductsService = inject(ProductsService);

  productDetails: IProduct | null = null;
  imgsrc: WritableSignal<string> = signal('');
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (p) => {
        let idProduct = p.get('id')!;
        this._ProductsService.getSpecificProducts(idProduct).subscribe({
          next: (res) => {
            console.log(res.data);
            this.productDetails = res.data;
            this.imgsrc.set(this.productDetails?.imageCover!);
          },
        });
      },
    });
  }
  imgs(det: string): void {
    this.imgsrc.set(det);
  }
  addToCart(id: string): void {
    this._CartService.addProductToCart(id).subscribe({
      next: (res) => {
        console.log(res);

        if (res.status == 'success') {
          this.toastrService.success(res.message, 'FreshCart');
          this._CartService.cartNumber.next(res.numOfCartItems);
        }
      },
    });
  }
}

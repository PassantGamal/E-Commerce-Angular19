import { Component, inject, OnInit } from '@angular/core';
import { BrandsService } from '../../core/services/brands/brands.service';
import { IBrand } from '../../shared/interfaces/ibrand';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-brands',
  imports: [RouterLink, NgxPaginationModule],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
})
export class BrandsComponent implements OnInit {
  p: number = 1;
  private readonly _BrandsService = inject(BrandsService);

  allBrands: IBrand[] = [];
  ngOnInit(): void {
    this._BrandsService.getAllBrands().subscribe({
      next: (res) => {
        console.log(res);
        this.allBrands = res.data;
      },
    });
  }
}

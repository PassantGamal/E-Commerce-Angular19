import { Component, inject, OnInit } from '@angular/core';
import { BrandsService } from '../../core/services/brands/brands.service';
import { ActivatedRoute } from '@angular/router';
import { IBrand } from '../../shared/interfaces/ibrand';

@Component({
  selector: 'app-brands-details',
  imports: [],
  templateUrl: './brands-details.component.html',
  styleUrl: './brands-details.component.scss',
})
export class BrandsDetailsComponent implements OnInit {
  private readonly _BrandsService = inject(BrandsService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  brandDetails: IBrand = {} as IBrand;
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (p) => {
        let brandId = p.get('id')!;
        this._BrandsService.getSpecificBrand(brandId).subscribe({
          next: (res) => {
            console.log(res);

            this.brandDetails = res.data;
          },
        });
      },
    });
  }
}

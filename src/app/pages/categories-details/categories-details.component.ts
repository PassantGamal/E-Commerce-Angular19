import { Component, inject, OnInit } from '@angular/core';
import { ICategory } from '../../shared/interfaces/icategory';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ActivatedRoute } from '@angular/router';
import { ISubcategory } from '../../shared/interfaces/iproduct';

@Component({
  selector: 'app-categories-details',
  imports: [],
  templateUrl: './categories-details.component.html',
  styleUrl: './categories-details.component.scss',
})
export class CategoriesDetailsComponent implements OnInit {
  catigories: ICategory = {} as ICategory;

  subCategoryData: ISubcategory[] | null = null;

  private readonly _CategoriesService = inject(CategoriesService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (res) => {
        let catId = res.get('id')!;
        this._CategoriesService.getSpecificCategories(catId).subscribe({
          next: (res) => {
            this.catigories = res.data;
          },
        });

        console.log(catId);
        this._CategoriesService.getSpecificSubCategories(catId).subscribe({
          next: (res) => {
            this.subCategoryData = res.data;
          },
        });
      },
    });
  }
}

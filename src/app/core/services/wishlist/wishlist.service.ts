import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IWishlist } from '../../../shared/interfaces/iwishlist';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor() {}
  whishList: BehaviorSubject<any> = new BehaviorSubject([]);
  private readonly _HttpClient = inject(HttpClient);
  wishNumber: BehaviorSubject<number> = new BehaviorSubject(0);
  addProductToWishlist(id: string): Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/wishlist`, {
      productId: id,
    });
  }
  getLoggedUserWishlist(): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/wishlist`);
  }
  removeProductFromWishlist(id: string): Observable<any> {
    return this._HttpClient.delete(
      `${environment.baseUrl}/api/v1/wishlist/${id}`
    );
  }
}

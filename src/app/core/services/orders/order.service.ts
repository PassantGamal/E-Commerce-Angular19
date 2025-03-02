import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from './../../../../../node_modules/jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor() {}
  userData: any = null;
  myToken = localStorage.getItem('userToken')!;
  private readonly _HttpClient = inject(HttpClient);

  checkoutPayment(id: string, data: object): Observable<any> {
    return this._HttpClient.post(
      `${environment.baseUrl}/api/v1/orders/checkout-session/${id}?url=http://localhost:4200`,
      {
        shippingAddress: data,
      }
    );
  }
  cashOrder(id: string, data: object): Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/orders/${id}`, {
      shippingAddress: data,
    });
  }
  AllOrders(id: string): Observable<any> {
    return this._HttpClient.get(
      `${environment.baseUrl}/api/v1/orders/user/${id}`
    );
  }
  getUserId(): any {
    if (this.myToken != null!) {
      this.userData = jwtDecode(this.myToken);
      return this.userData.id;
    }
  }
}

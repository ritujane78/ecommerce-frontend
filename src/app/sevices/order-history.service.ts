import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  private orderUrl = 'http://localhost:9090/api/orders/';

  constructor(private httpClient: HttpClient) {}
  getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory>{
    let orderSearchUrl = `${this.orderUrl}search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;

    return this.httpClient.get<GetResponseOrderHistory>(orderSearchUrl);

  }
}
interface GetResponseOrderHistory{
  _embedded: {
    orders: OrderHistory[];
  }
}

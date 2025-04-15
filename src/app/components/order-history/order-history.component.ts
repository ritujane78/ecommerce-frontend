import { Component } from '@angular/core';
import { OrderHistory } from '../../common/order-history';
import { OrderHistoryService } from '../../sevices/order-history.service';

@Component({
  selector: 'app-order-history',
  standalone: false,
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent {

  orderHistoryList: OrderHistory[] = [];
  storage:Storage = localStorage;

  constructor(private orderHistoryService: OrderHistoryService){}

  ngOnInit(){
    this.handleOrderHistory();
  }
  handleOrderHistory() {

    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    this.orderHistoryService.getOrderHistory(theEmail).subscribe(
      data => {
        this.orderHistoryList = data._embedded.orders;
      }
    )
  }

}

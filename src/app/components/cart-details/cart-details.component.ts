import { Component } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-details',
  standalone: false,
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent {

  cartItems: CartItem[] =[];
  totalPrice: number = 0.00;
  totalQuantity:number=0;

  constructor(private cartService:CartService){}

  ngOnInit(): void {
    this.listCartDetails();
  }
  listCartDetails() {
    this.cartItems = this.cartService.cartItems;

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice =data
    )

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )
    this.cartService.computeCartTotals();
  }
  remove(theCartItem: CartItem) {
    this.cartService.remove(theCartItem);
  }
  decrementQuantity(theCartItem: CartItem) {
  this.cartService.decrementQuantity(theCartItem);
  }
  incrementQuantity(theCartItem: CartItem) {
    this.cartService.addToCart(theCartItem);
  }
}

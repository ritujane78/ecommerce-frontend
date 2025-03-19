import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }
  addToCart(theCartItem: CartItem){
    let alreadyExistsInCart : boolean= false;
    let existingCartItem: CartItem | undefined = undefined;

    if(this.cartItems.length > 0){
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
      
      alreadyExistsInCart = (existingCartItem != undefined);
      console.log(alreadyExistsInCart);
    }
    if(alreadyExistsInCart && existingCartItem){
      existingCartItem.quantity++;
      console.log(theCartItem.quantity);
    }else {
      this.cartItems.push(theCartItem)
    }
    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue : number = 0;
    let totalQuantity :number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantity += currentCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantity);
    this.logCartData(totalPriceValue, totalQuantity);
    
  }
  logCartData(totalPriceValue: number, totalQuantity: number) {
    for(let currentCartItem of this.cartItems){
      const subTotalPrice = currentCartItem.quantity * currentCartItem.unitPrice;
      console.log(`Cart name = ${currentCartItem.name}, quantity = ${currentCartItem.quantity}, price = ${subTotalPrice}`);
    }
    console.log(`Total price = ${totalPriceValue.toFixed(2)}, total quantity = ${totalQuantity}`);
    console.log('-----');
  }
}

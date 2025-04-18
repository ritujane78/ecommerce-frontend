import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  // storage: Storage = sessionStorage;
  storage: Storage = localStorage;


  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if(data != null){
      this.cartItems = data;

      this.computeCartTotals();
    }
   }
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

    this.persistItems();
    
  }
  persistItems(){
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
  logCartData(totalPriceValue: number, totalQuantity: number) {
    for(let currentCartItem of this.cartItems){
      const subTotalPrice = currentCartItem.quantity * currentCartItem.unitPrice;
      console.log(`Cart name = ${currentCartItem.name}, quantity = ${currentCartItem.quantity}, price = ${subTotalPrice}`);
    }
    console.log(`Total price = ${totalPriceValue.toFixed(2)}, total quantity = ${totalQuantity}`);
    console.log('-----');
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if(theCartItem.quantity === 0){
      this.remove(theCartItem)
    } else{
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    const cartIndex = this.cartItems.findIndex(cartItem => cartItem.id === theCartItem.id);

    if(cartIndex > -1){
      this.cartItems.splice(cartIndex,1);
    }
    this.computeCartTotals();
  }
}

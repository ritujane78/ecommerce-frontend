import { Component } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {

  product!: Product;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute ){}
  
  ngOnInit(): void{
  this.route.paramMap.subscribe( ()=> {
    this.getProductDetails();
  })
  }
  getProductDetails() {
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product=data;
      }
    )
  }
  addToCart(){
   const theCartItem = new CartItem(this.product);
   this.cartService.addToCart(theCartItem);
  }

}

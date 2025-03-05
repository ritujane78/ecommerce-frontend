import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component-grid.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: Product[]=[];
  constructor(private produtService: ProductService){}

  ngOnInit():void{
    this.listProducts();
  }
  listProducts(){
    this.produtService.getProductList().subscribe(
      data => {
      this.products = data;
      }
    )
  }

}

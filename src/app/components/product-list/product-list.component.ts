import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component-grid.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  currentCategoryId: number=1;
  products: Product[]=[];
  constructor(private produtService: ProductService,
              private route: ActivatedRoute
   ){}

  ngOnInit():void{
    this.route.paramMap.subscribe(()=> {
      this.listProducts();
  })
  }
  listProducts(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if(hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }else{
      this.currentCategoryId=1;
    }

    this.produtService.getProductList(this.currentCategoryId).subscribe(
      data => {
      this.products = data;
      }
    )
  }

}

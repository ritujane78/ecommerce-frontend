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
  searchMode: boolean=false;

  // For pagination
  thePageNumber: number = 1;
  thePageSize: number= 5;
  theTotalElements: number=0;
  previousCategoryId: number=1;

  constructor(private produtService: ProductService,
              private route: ActivatedRoute
   ){}

  ngOnInit():void{
    this.route.paramMap.subscribe(()=> {
      this.listProducts();
  })
  }
  listProducts(){
    this.searchMode= this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }else {
      this.handleListProducts();
    }
  }
  handleSearchProducts(){
    const theKeyword: string= this.route.snapshot.paramMap.get('keyword')!;

    this.produtService.searchProducts(theKeyword).subscribe(
      data => {
        this.products= data;
      }
    )
  }
  handleListProducts(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if(hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }else{
      this.currentCategoryId=1;
    }
    
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber=1;
    }
    this.previousCategoryId = this.currentCategoryId;

    console.log(`the page number = ${this.thePageNumber}`);


    this.produtService.getProductListPaginate(this.thePageNumber-1,
                                              this.thePageSize,
                                              this.currentCategoryId).subscribe(
                                                data => {
                                                  this.products = data._embedded.products,
                                                  this.thePageNumber= data.page.number+1,
                                                  this.thePageSize= data.page.size,
                                                  this.theTotalElements = data.page.totalElements;
                                                }
                                            );
  
  }
  updatePageSize(pageSize: string){
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = environment.ecommerceApiUrl + '/products';
  private categoryUrl = environment.ecommerceApiUrl + '/product-category';
  
  constructor(private httpClient:HttpClient) { }
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => {
        return response._embedded.products;
      })
    );
  }
  
  searchProducts(theKeyword: string):   Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return  this.getProducts(searchUrl)
    
  }

searchProductsPaginate(thePage: number, 
                        thePageSize: number, 
                        theKeyword: string):   
                        Observable<GetResponseProducts>{
  const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                      +`&page=${thePage}&size=${thePageSize}`;
  
  return  this.httpClient.get<GetResponseProducts>(searchUrl);
  }
  
  getProductListPaginate(thePage: number, 
                          thePageSize: number, 
                          theCategoryId: number):   Observable<GetResponseProducts>{
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}+
                        &page=${thePage}&size=${thePageSize}`;
    return  this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(theCategoryId: number):   Observable<Product[]>{
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return  this.getProducts(searchUrl)
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return  this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => {
        return  response._embedded.ProductCategory 
      })
    )
  }
  
  getProduct(theProductId: number): Observable<Product> {
    const productUrl= `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }
}

interface GetResponseProducts{
  _embedded: {
    products: Product[];
  },
    page: {
      size:number,
      totalElements: number,
      totalPages: number,
      number: number
    }
}

interface GetResponseProductCategory{
  _embedded: {
    ProductCategory: ProductCategory[];
  }
}

import { Component, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { Routes,RouterModule, Router } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NgbModule  } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Luv2ShopFormService } from './services/luv2-shop-form.service';
import { CheckoutService } from './services/checkout.service';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { OrderHistoryButtonComponent } from './components/order-history-button/order-history-button.component';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';

import {
  OktaAuthModule,
  OktaCallbackComponent,
  OKTA_CONFIG,
  OktaAuthGuard
} from '@okta/okta-angular';

import {OktaAuth} from '@okta/okta-auth-js';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';


const oktaAuth = new OktaAuth({
  clientId: '0oao6058s3l7B7Wwh5d7',
  issuer: 'https://dev-55924850.okta.com/oauth2/default',
  redirectUri: 'https://localhost:4200/login/callback'
});

function sendToLoginPage(oktaAuth: InstanceType<typeof OktaAuth>,injector: Injector ){
  const router = injector.get(Router);

  router.navigate(["/login"]);

}

const routes: Routes = [
  {path: "login/callback", component: OktaCallbackComponent},
  {path: "login", component: LoginComponent},
  {path: "members", component: MembersPageComponent, canActivate: [OktaAuthGuard],
                    data: {onAuthRequired: sendToLoginPage}
  },
  {path: "order-history", component: OrderHistoryComponent, canActivate: [OktaAuthGuard], data: {onAuthRequired: sendToLoginPage}},
  {path: "checkout", component: CheckoutComponent},
  {path: "cart-details", component: CartDetailsComponent},
  {path: "products/:id", component: ProductDetailsComponent},
  {path: "search/:keyword", component: ProductListComponent},
  {path: "category/:id", component: ProductListComponent},
  {path: 'category',component: ProductListComponent},
  {path: 'products', component:ProductListComponent},
  {path: "", redirectTo: "/products", pathMatch: 'full'},
  {path: "**", redirectTo: "/products", pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    OrderHistoryComponent,
    OrderHistoryButtonComponent,
    LoginStatusComponent,
    MembersPageComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    OktaAuthModule.forRoot({ oktaAuth }),
  ],
  providers: [
    ProductService,
    Luv2ShopFormService,
    CheckoutService, 
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

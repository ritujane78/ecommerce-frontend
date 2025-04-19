import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { from, lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private oktaAuth: InstanceType<typeof OktaAuth>) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("🔍 Interceptor triggered for:", request.url);
    return from(this.handleAccess(request, next));
  }
  
  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    if (request.url.includes('/api/orders')) {
      const isAuthenticated = await this.oktaAuth.isAuthenticated();
      console.log("✅ Authenticated:", isAuthenticated);
  
      const accessToken = await this.oktaAuth.getAccessToken();
      console.log("🔐 Token:", accessToken);
  
      if (accessToken) {
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + accessToken
          }
        });
      }
    }
  
    return await lastValueFrom(next.handle(request));
  }
  
}

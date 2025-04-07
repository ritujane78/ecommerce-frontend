import { Component, Inject } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  standalone: false,
  templateUrl: './login-status.component.html',
  styleUrl: './login-status.component.css'
})
export class LoginStatusComponent {
  isAuthenticated: boolean= false;
  userFullName: string = '';

  constructor(private oktaAuthService: OktaAuthStateService,
              @Inject(OKTA_AUTH) private oktaAuth: InstanceType<typeof OktaAuth>
  ){

  }

  ngOnInit(): void{
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    )
  }
  
  getUserDetails() {
    if (this.isAuthenticated) {
      this.oktaAuth.getUser().then((result: any) => {
        this.userFullName = result.name as string;
      });
    }
  }

  logout(){
    this.oktaAuth.signout();
  }
}

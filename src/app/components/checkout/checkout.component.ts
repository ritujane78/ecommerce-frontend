import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Luv2ShopFormService } from '../../sevices/luv2-shop-form.service';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  checkoutFormGroup!: FormGroup;
  totalQuantity: number = 0;
  totalPrice: number = 0.0;
  creditCardMonths: number[] = [];
  creditCardYear: number[] = [];


  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService : Luv2ShopFormService
  ){}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({  
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({  
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({  
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({  
        cardType: [''],
        nameOfCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      }),

    });

    const startMonth = new Date().getMonth() + 1;

    this.luv2ShopFormService.creditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    )
    this.luv2ShopFormService.getCreditCardYear().subscribe(
      data => this.creditCardYear = data
    )
  }
  copyShippingToBillingAddress(event: any){
    if(event.target.checked){
      this.checkoutFormGroup.get('billingAddress')?.setValue(
        this.checkoutFormGroup.get('shippingAddress')?.value)
    } else {
      this.checkoutFormGroup.get('billingAddress')?.reset();
    }
  }

  onSubmit(){
      console.log(this.checkoutFormGroup.get('customer')?.value);
  }

}

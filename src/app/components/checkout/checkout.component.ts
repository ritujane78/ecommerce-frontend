import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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


  constructor(private formBuilder: FormBuilder){}

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

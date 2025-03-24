import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Luv2ShopFormService } from '../../sevices/luv2-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';

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

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];


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
    this.luv2ShopFormService.getCountries().subscribe(
      data => this.countries = data
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
  handleMonthsAndYears(){
    let formCreditCardGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(formCreditCardGroup?.value.expirationYear);

    // console.log(currentYear, selectedYear);

    let startMonth : number = 0;
    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.luv2ShopFormService.creditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    )
  }

  onSubmit(){
      console.log(this.checkoutFormGroup.get('customer')?.value);
  }

  getStates(theGroupName: string){
    const formGroup = this.checkoutFormGroup.get(theGroupName);

    const code = formGroup?.value.country.code;
    const name = formGroup?.value.country.name;

    this.luv2ShopFormService.getStates(code).subscribe(
      data => {
        console.log(`${JSON.stringify(data)}`);
        if(theGroupName === "shippingAddress"){
          this.shippingAddressStates = data;
        }else{
          this.billingAddressStates = data;
        }
        formGroup?.get('state')?.setValue(data[0]);
      }
    )
  }

}

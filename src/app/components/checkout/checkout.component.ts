import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { Luv2ShopValidators } from '../../validators/luv2-shop-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { environment } from '../../../environments/environment';
import { PaymentInfo } from '../../common/payment-info';

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

  storage: Storage = localStorage;

  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any= "";


  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService : Luv2ShopFormService,
              private cartService : CartService,
              private checkoutService: CheckoutService,
              private router:Router
  ){}

  ngOnInit(): void {

    this.setupStripePaymentForm();
    
    this.reviewCartDetails();

    const theEmail = "rbafna.official@gmail.com";

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({  
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        email: new FormControl(theEmail, [Validators.required,
                                Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
        ])
      }),
      shippingAddress: this.formBuilder.group({  
        street: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        city:new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        state:new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode:new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({  
        street: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        city:new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        state:new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode:new FormControl('', [Validators.required,  Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({  
        /*
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
        */
      }),

    });
  /*
    const startMonth = new Date().getMonth() + 1;

    this.luv2ShopFormService.creditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    )
    this.luv2ShopFormService.getCreditCardYear().subscribe(
      data => this.creditCardYear = data
    )
  */
    this.luv2ShopFormService.getCountries().subscribe(
      data => this.countries = data
    )
  }
  setupStripePaymentForm() {
    var elements = this.stripe.elements();

    this.cardElement = elements.create('card', {hidePostalCode: true});

    this.cardElement.mount('#card-element');
    this.cardElement.on('change',(event: any) => {

      this.displayError = document.getElementById('card-errors');

      if(event.complete){
        this.displayError.textContent = "";
      } else if (event.error){
        this.displayError.textContent = event.error.messaage
      }
    }); 
  }
  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    )
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    )
  }
  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressZipCode(){return this.checkoutFormGroup.get('shippingAddress.zipCode');}
  
  get billingAddressStreet(){return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity(){return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressState(){return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressCountry(){return this.checkoutFormGroup.get('billingAddress.country');}
  get billingAddressZipCode(){return this.checkoutFormGroup.get('billingAddress.zipCode');}

  get creditCardType(){return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardNameOnCard(){return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardCardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode(){return this.checkoutFormGroup.get('creditCard.securityCode');}

  copyShippingToBillingAddress(event: any){
    if(event.target.checked){
      this.checkoutFormGroup.get('billingAddress')?.setValue(
        this.checkoutFormGroup.get('shippingAddress')?.value)
        
        // Bug fix for states
        this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.get('billingAddress')?.reset();

      // Bug fix for states
      this.billingAddressStates = [];
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
      if(this.checkoutFormGroup.invalid){
        this.checkoutFormGroup.markAllAsTouched();
        return;
      }

      let order = new Order();
      order.totalPrice = this.totalPrice;
      order.totalQuantity = this.totalQuantity;

      const cartItems = this.cartService.cartItems;

      let orderItems : OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

      let purchase = new Purchase();

      purchase.customer = this.checkoutFormGroup.get('customer')?.value;

      purchase.shippingAddress = this.checkoutFormGroup.get('shippingAddress')?.value;
      const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
      const shippingCountry: State = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
      purchase.shippingAddress.state = shippingState.name;
      purchase.shippingAddress.country = shippingCountry.name;

      purchase.billingAddress = this.checkoutFormGroup.get('billingAddress')?.value;
      const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
      const billingCountry: State = JSON.parse(JSON.stringify(purchase.billingAddress.country));
      purchase.billingAddress.state = billingState.name;
      purchase.billingAddress.country = billingCountry.name;

      purchase.order = order;
      purchase.orderItems = orderItems;

    /*
      this.checkoutService.placeOrder(purchase).subscribe(
        {
          next: response => {
            alert(`Youe order has been received. \n Order Tracking Number: ${response.orderTrackingNumber}`)

            this.resetCart();
          },
          error: err => {
            alert(`There was an error: ${err.messaage}`);
          }
        }
      )
    */
      this.paymentInfo.amount = Math.round(this.totalPrice * 100);
      this.paymentInfo.currency = "USD"; 

      if(!this.checkoutFormGroup.invalid && this.displayError.textContent == ""){
        this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
          (paymentIntentResponse) => {
            this.stripe.confirmCardPayment(paymentIntentResponse.client_secret, 
              {
                payment_method: {
                  card: this.cardElement
                }
              }, {handleActions: false})
              .then((result: any) => {
                if(result.error){
                  alert(`There was an error: ${result.error.messaage}`);
                }else {
                  this.checkoutService.placeOrder(purchase).subscribe({
                    next: ( response:any) => {
                      alert(`Your order has been received. \n Order tracking Number: ${response.orderTrackingNumber}`);
                      this.resetCart();
                    },
                    error: (error: any) => {
                      alert(`There was an error: ${error.messaage}`);
                    }
                  })
                }
              })
          }
        )
      } else {
        this.checkoutFormGroup.markAllAsTouched();
        return;
      }
  }
  resetCart() {
    this.cartService.cartItems = [];

    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistItems();

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl('/products');
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

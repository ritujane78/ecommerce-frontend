import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

    // whitespace validator

    static notOnlyWhiteSpace(control: FormControl): ValidationErrors | null {
        
        // Check if string only contains whitespace
        if((control.value !== null) && (control.value.trim().length === 0)){
            return {'notOnlyWhiteSpace': true};
        } else {
            return null;
        }

    }
}

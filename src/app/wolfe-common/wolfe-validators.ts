import { FormControl, ValidationErrors } from '@angular/forms';

export class WolfeValidators {

  constructor() { }

  static validatePositiveInteger(formControl: FormControl): ValidationErrors | null {
    const regExp: RegExp = new RegExp('^[1-9]\\d*$');
    if (formControl && !regExp.test(formControl.value)) {
      return { positiveInteger : true};
    }
    // If we make it here everything is OK, retun null to indicate that
    return null;
  }

  static validateCurrency(formControl: FormControl): ValidationErrors | null {
    // This is a really bad regex, but I guess better than nothing.
    // Make sure it starts with an optional dollar sign and then the rest of the
    // field should have nothing other than numbers, commas, and periods
    const regExp: RegExp = new RegExp('^[$]?([0-9.,])+$');
    if (formControl && !regExp.test(formControl.value)) {
      return { currency : true};
    }
    // If we make it here everything is OK, retun null to indicate that
    return null;
  }

}

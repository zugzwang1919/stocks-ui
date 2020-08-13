import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  // STRING  utils
  isEmptyNullOrUndefined(inputString: string): boolean {
    return !(this.hasContent(inputString));
  }

  hasContent(inputString: string): boolean {
    return inputString && (inputString !== '');
  }

}

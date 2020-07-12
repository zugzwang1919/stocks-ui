import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  buildUrl(inputString: string): string {
    return 'http://' + environment.serverName + ':' + environment.serverPort + inputString;
  }

  isEmptyNullOrUndefined(inputString: string): boolean {
    return !(this.hasContent(inputString));
  }

  hasContent(inputString: string): boolean {
    return inputString && (inputString !== '');
  }

}

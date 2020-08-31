import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activity'
})
export class ActivityPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    switch (value) {
      case 'BUY_TO_OPEN':
        return 'Buy to Open';
      case 'BUY_TO_CLOSE':
        return 'Buy to Close';
      case 'SELL_TO_OPEN':
        return 'Sell to Open';
      case 'SELL_TO_CLOSE':
        return 'Sell to Close';
      default:
        return 'Unknown';
    }
  }

}

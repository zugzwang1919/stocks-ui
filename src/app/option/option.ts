import { DatePipe, CurrencyPipe } from '@angular/common';
import { WolfeTrackedItem } from '../wolfe-common/wolfe-tracked-item';
import { Stock } from '../stock/stock';
import { UtilService } from '../wolfe-common/util.service';

export class Option extends WolfeTrackedItem {
    optionType: string;
    stock: Stock;
    strikePrice: number;
    expirationDate: Date;



    constructor(obj?: any) {
        super(obj);
        this.optionType = (obj && obj.optionType) || undefined;
        this.stock = (obj && obj.stock) ? new Stock(obj.stock) : undefined;
        this.strikePrice = (obj && obj.strikePrice) || undefined;
        // When the date comes in as "2020-06-12" we need to add a time component, or Typescript will assume that it's UTC,
        // subtract 4-5 hours from it & move it back one day
        this.expirationDate = (obj && obj.expirationDate) ? new Date(obj.expirationDate + 'T00:00:00') : undefined;
    }

    getName(): string {
        const eDate: Date = this.expirationDate;
        const dayOfMonth: number = eDate.getDate();
        const datePipe: DatePipe = new DatePipe('en-US');
        const dateSubstring: string = dayOfMonth > 14 && dayOfMonth < 22 ?
                                      datePipe.transform(eDate, 'MMM-yyyy') :
                                      datePipe.transform(eDate, 'MM/dd/yyyy');
        const currencyPipe: CurrencyPipe = new CurrencyPipe('en-US');
        return this.stock.ticker + ':' +  dateSubstring + ' - ' +
          currencyPipe.transform(this.strikePrice) + ' : ' + this.optionType;
    }

}

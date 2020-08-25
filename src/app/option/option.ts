import { WolfeTrackedItem } from '../wolfe-common/wolfe-tracked-item';
import { Ticker } from '../ticker/ticker';

export class Option extends WolfeTrackedItem {
    optionType: string;
    stock: Ticker;
    strikePrice: number;
    expirationDate: Date;

    constructor(obj?: any) {
        super(obj);
        this.optionType = (obj && obj.optionType) || undefined;
        this.stock = (obj && obj.stock) ? new Ticker(obj.stock) : undefined;
        this.strikePrice = (obj && obj.strikePrice) || undefined;
        // When the date comes in as "2020-06-12" we need to add a time component, or Typescript will assume that it's UTC,
        // subtract 4-5 hours from it & move it back one day
        this.expirationDate = (obj && obj.expirationDate) ? new Date(obj.expirationDate + 'T00:00:00') : undefined;
    }

}

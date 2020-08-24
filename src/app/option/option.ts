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
        this.expirationDate = (obj && obj.expirationDate) ? new Date(obj.expirationDate) : undefined;
    }

}

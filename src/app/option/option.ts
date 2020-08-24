import { WolfeTrackedItem } from '../wolfe-common/wolfe-tracked-item';
import { Ticker } from '../ticker/ticker';

export class Option extends WolfeTrackedItem {
    optionType: string;
    stock: Ticker;
    strikePrice: number;
    expirationDate: Date;

}

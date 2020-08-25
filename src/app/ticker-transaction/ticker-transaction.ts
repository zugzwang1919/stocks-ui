import { Portfolio } from '../portfolio/portfolio';
import { Ticker } from '../ticker/ticker';
import { WolfeTrackedItem } from '../wolfe-common/wolfe-tracked-item';


export class TickerTransaction extends WolfeTrackedItem {

    portfolio: Portfolio;
    date: Date;
    stock: Ticker;
    activity: string;
    tradeSize: number;
    amount: number;



    constructor(obj?: any) {
        super(obj);
        this.portfolio = (obj && obj.portfolio) ? new Portfolio(obj.portfolio) : undefined;
        // When the date comes in as "2020-06-12" we need to add a time component, or Typescript will assume that it's UTC,
        // subtract 4-5 hours from it & move it back one day
        this.date = (obj && obj.date) ? new Date(obj.date + 'T00:00:00') : undefined;
        this.stock = (obj && obj.stock) ? new Ticker(obj.stock) : undefined;
        this.activity = (obj && obj.activity) || undefined;
        this.tradeSize = (obj && obj.tradeSize) || undefined;
        this.amount = (obj && obj.amount) || undefined;
    }

}

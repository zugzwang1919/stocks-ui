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

}

export enum TickerTransactionActivity {
    BUY,
    SELL
}


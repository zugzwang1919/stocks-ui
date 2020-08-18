import { Portfolio } from '../portfolio/portfolio';
import { Ticker } from '../ticker/ticker';


export class TickerTransaction {

    id ?: number;
    portfolio: Portfolio;
    date: Date;
    stock: Ticker;
    activity: TickerTransactionActivity;
    tradeSize: number;
    amount: number;
    createDate?: Date;
    updateDate?: Date;


}

export enum TickerTransactionActivity {
    BUY,
    SELL
}


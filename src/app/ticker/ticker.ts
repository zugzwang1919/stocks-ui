import { WolfeTrackedItem } from '../wolfe-common/wolfe-tracked-item';

export class Ticker extends WolfeTrackedItem {
    ticker: string;
    name: string;
    benchmark: boolean;

    constructor(obj?: any) {
        super(obj);
        this.ticker = (obj && obj.ticker) || undefined;
        this.name = (obj && obj.name) || undefined;
        this.benchmark = (obj && obj.benchmark) || undefined;
    }
}

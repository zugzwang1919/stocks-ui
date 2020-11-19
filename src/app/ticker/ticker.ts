import { WolfeTrackedItem } from '../wolfe-common/wolfe-tracked-item';

export class Ticker extends WolfeTrackedItem {
    ticker: string;
    name: string;
    benchmark: boolean;

    constructor(obj?: any) {
        super(obj);
        this.ticker = (obj && obj.ticker) || undefined;
        this.name = (obj && obj.name) || undefined;
        // Have to be careful here not to use the pattern above.
        // If obj.benchmark comes back false, benchmark would be undefined.
        this.benchmark = obj ? obj.benchmark : undefined;

    }
}

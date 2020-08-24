import { WolfeTrackedItem } from '../wolfe-common/wolfe-tracked-item';

export class Portfolio extends WolfeTrackedItem {
    portfolioName: string;

    constructor(obj?: any) {
        super(obj);
        this.portfolioName = (obj && obj.portfolioName) || undefined;
    }
}

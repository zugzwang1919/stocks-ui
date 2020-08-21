import { WolfeTrackedItem } from '../wolfe-common/wolfe-tracked-item';

export class Ticker extends WolfeTrackedItem {
    ticker: string;
    name: string;
    benchmark: boolean;
}

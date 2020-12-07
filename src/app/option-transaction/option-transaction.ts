import { Option } from '../option/option';
import { WolfeTrackedItem } from '../wolfe-common/wolfe-tracked-item';
import { Portfolio } from '../portfolio/portfolio';
import { Stock } from '../stock/stock';

export class OptionTransaction extends WolfeTrackedItem {
    activity: string;
    date: Date;
    portfolio: Portfolio;
    option: Option;
    numberOfContracts: number;
    amount: number;

    // This is primarily used to take a pile of JSON and build full fledged objects from it
    constructor(obj?: any) {
        super(obj);
        this.activity = (obj && obj.activity) || undefined;
        this.date = (obj && obj.date) ? new Date(obj.date + 'T00:00:00') : undefined;
        this.portfolio = (obj && obj.portfolio) ? new Portfolio(obj.portfolio) : undefined;
        this.option = (obj && obj.option) ? new Option(obj.option) : undefined;
        this.numberOfContracts = (obj && obj.numberOfContracts) || undefined;
        this.amount = (obj && obj.amount) || undefined;
    }
}

export class Ticker {
    id?: number; // Id will not be present when we're creating a ticker
    ticker: string;
    name: string;
    benchmark: boolean;
    createDate: Date;
    updateDate: Date;
}

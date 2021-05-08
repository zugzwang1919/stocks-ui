export class Profile {

    userName: string;
    emailAddress: string;
    authenticationsSupported: AuthenticationSupported[];
    numberOfStocks: number;
    numberOfOptions: number;
    numberOfStockTransactions: number;
    numberOfOptionTransactions: number;


}

export enum AuthenticationSupported {
    ID_PW = 'ID_PW',
    GOOGLE = 'GOOGLE'
}

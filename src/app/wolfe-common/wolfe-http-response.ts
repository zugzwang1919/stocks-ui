


export class WolfeHttpResponse {
  wolfeHttpResponseCode: WolfeHttpResponse.WolfeHttpResponseCode;
  message: string;
  body: any;


}

// tslint:disable-next-line:no-namespace
export namespace WolfeHttpResponse {
  export enum WolfeHttpResponseCode {
    OK,
    AUTHENTICATION_ERROR,
    ERROR
}
}

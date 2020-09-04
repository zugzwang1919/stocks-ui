import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Observable } from 'rxjs';

import { Option } from './option';
import { WolfeGenericService } from '../wolfe-common/wolfe-generic-service';
import { WolfeHttpService } from '../wolfe-common/wolfe-http.service';

@Injectable({
  providedIn: 'root'
})
export class OptionService extends WolfeGenericService<Option> {

  constructor(
    wolfeHttpService: WolfeHttpService,
    private datePipe: DatePipe
  ) {
    super(wolfeHttpService, '/option');
  }

  // NOTE: retrieve(), retrieveAll(), and delete() are picked up
  //       from the base class

  create(optionType: string, stockId: number, strikePrice: number | string, expirationDate: Date): Observable<Option> {
    const params = this.buildParams(optionType, stockId, strikePrice, expirationDate);
    return this.wolfeHttpService.post('/option', params, null);
  }

  update(id: number, optionType: string, stockId: number, strikePrice: number | string, expirationDate: Date): Observable<Option> {
    const params = this.buildParams(optionType, stockId, strikePrice, expirationDate);
    return this.wolfeHttpService.post('/option/' + id, params, null);
  }

  private buildParams( optionType: string, stockId: number, strikePrice: number | string, expirationDate: Date) {
    const params: any = {};
    params.optionType = optionType;
    params.stockId = stockId;
    // Remove any $ or commas
    params.strikePrice = strikePrice.toString().replace('$', '').replace(',', '');
    // Format the date properly
    params.expirationDate = this.datePipe.transform(expirationDate, 'yyyy-MM-dd');
    return params;
  }

  // Override so that we can provide a fully functional Ticker object
  buildFullyFuctionalModel(thinOption: any): Option {
    return new Option(thinOption);
  }

}

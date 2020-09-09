import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import { WolfeHttpService } from '../wolfe-common/wolfe-http.service';


@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  constructor(
    private datePipe: DatePipe,
    private wolfeHttpService: WolfeHttpService,
  ) { }

  // FIXME: Change from "any" to "IncomeAnalysis" once "IncomeAnalysis" exists.
  analyzeIncome(beginDate: Date, endDate: Date, portfolioIds: number[], stockIds: number[],
                includeDividends: boolean, includeOptions: boolean): Observable<any> {
    const params: any = {};
    // NOTE: If the caller wants to use the null/undefined Date to indicate either the
    // NOTE: beginning of time or NOW, pass an empty string as a request param
    params.beginDate = beginDate ? this.datePipe.transform(beginDate, 'yyyy-MM-dd') : '';
    params.endDate = endDate ? this.datePipe.transform(endDate, 'yyyy-MM-dd') : '';
    params.portfolioIds = portfolioIds;
    params.stockIds = stockIds;
    params.includeDividends = includeDividends;
    params.includeOptions = includeOptions;
    return this.wolfeHttpService.post('/income-analysis', params, null);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { WolfeHttpService } from '../wolfe-common/wolfe-http.service';


@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  constructor(
    private wolfeHttpService: WolfeHttpService,
  ) { }

  // FIXME: Change from "any" to "IncomeAnalysis" once "IncomeAnalysis" exists.
  analyzeIncome(beginDate: Date, endDate: Date, portfolioIds: number[], stockIds: number[],
                includeDividends: boolean, includeOptions: boolean): Observable<any> {
    const params = { beginDate, endDate, portfolioIds, stockIds, includeDividends, includeOptions };
    return this.wolfeHttpService.post('/income-analysis', params, null);
  }
}

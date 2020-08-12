import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UtilService } from '../wolfe-common/util.service';
import { WolfeHttpService } from '../wolfe-common/wolfe-http.service';
import { Portfolio } from './portfolio';


@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  constructor(
    private util: UtilService,
    private wolfeHttpService: WolfeHttpService
  ) { }

  retrieveAll(): Observable<Portfolio[]> {
    const retrieveAllPortfoliosUrl: string = this.util.buildUrl('/portfolio');
    return  this.wolfeHttpService.get(retrieveAllPortfoliosUrl)
      .pipe(
        catchError(this.util.handleStandardError)
      );
  }

  delete(id: number): Observable<any> {
    const deleteOnePortfolioUrl: string = this.util.buildUrl('/portfolio/' + id);
    return  this.wolfeHttpService.delete(deleteOnePortfolioUrl)
      .pipe(
        catchError(this.util.handleStandardError)
      );
  }
}

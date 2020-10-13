import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WolfeHttpService } from '../wolfe-common/wolfe-http.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private wolfeHttpService: WolfeHttpService
  ) {

  }

  updateAllStockPrices(): Observable<any> {
    return this.wolfeHttpService.post('/admin/reloadAllStockPrices', null, null);
  }

  updateAllDividends(): Observable<any> {
    return this.wolfeHttpService.post('/admin/reloadAllDividends', null, null);
  }
}

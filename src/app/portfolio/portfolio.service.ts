import { Injectable } from '@angular/core';

import { Portfolio } from './portfolio';
import { WolfeRDService } from '../wolfe-common/wolfe-rd';
import { WolfeHttpService } from '../wolfe-common/wolfe-http.service';

@Injectable({
  providedIn: 'root'
})

export class PortfolioService extends WolfeRDService<Portfolio> {

  constructor(
    wolfeHttpService: WolfeHttpService
  ) {
    super(wolfeHttpService, '/portfolio');
  }

  // NOTE: retrieve(), retrieveAll(), and delete() are picked up
  //       from the base class

}

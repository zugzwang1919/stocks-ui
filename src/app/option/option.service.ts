import { Injectable } from '@angular/core';

import { Option } from './option';
import { WolfeGenericService } from '../wolfe-common/wolfe-generic-service';
import { WolfeHttpService } from '../wolfe-common/wolfe-http.service';

@Injectable({
  providedIn: 'root'
})
export class OptionService extends WolfeGenericService<Option> {

  constructor(
    wolfeHttpService: WolfeHttpService
  ) {
    super(wolfeHttpService, '/option');
  }

  // NOTE: retrieve(), retrieveAll(), and delete() are picked up
  //       from the base class

}

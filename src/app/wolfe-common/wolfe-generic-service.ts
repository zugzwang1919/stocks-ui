// This class can be used by any service that needs a few
// very simple cRuD services - most notably the R & D
// parts of CRUD (Retrieve and Delete)
import { Observable } from 'rxjs';

import { WolfeHttpService } from './wolfe-http.service';

export class WolfeGenericService<T> {

    constructor(
        protected wolfeHttpService: WolfeHttpService,
        private urlPath: string
      ) { }

    // Retrieve all of a specific type of element (Ticker, Portfolio, Transaction, etc)
    retrieveAll(): Observable<T[]> {
        return  this.wolfeHttpService.get(this.urlPath);
    }

    // Retrive a single element (Ticker, Portfolio, Transaction, etc)
    retrieve(id: number): Observable<T> {
        return  this.wolfeHttpService.get(this.urlPath + '/' + id);
    }

    // Retrive a single element (Ticker, Portfolio, Transaction, etc)
    delete(id: number): Observable<T> {
        return this.wolfeHttpService.delete(this.urlPath + '/' + id);
    }

}

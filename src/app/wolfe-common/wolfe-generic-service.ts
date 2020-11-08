// This class can be used by any service that needs a few
// very simple cRuD services - most notably the R & D
// parts of CRUD (Retrieve and Delete)
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { WolfeHttpService } from './wolfe-http.service';
import { WolfeTrackedItem } from './wolfe-tracked-item';
import { CompileShallowModuleMetadata } from '@angular/compiler';

export class WolfeGenericService<T> {

    constructor(
        protected wolfeHttpService: WolfeHttpService,
        private urlPath: string
      ) { }

    // Retrieve all of a specific type of element (Ticker, Portfolio, Transaction, etc)
    retrieveAll(): Observable<T[]> {
        return  this.wolfeHttpService.get(this.urlPath)
            .pipe(
                map(arrayOfShallowT => {
                    return arrayOfShallowT.map( t => {
                        return this.buildFullyFuctionalModel(t);
                    });
                })

            );
    }

    // Retrive a single element (Ticker, Portfolio, Transaction, etc)
    retrieve(id: number): Observable<T> {
        return  this.wolfeHttpService.get(this.urlPath + '/' + id)
            .pipe(
                map(oneShallowT => {
                    return this.buildFullyFuctionalModel(oneShallowT);
                })
            );
    }

    // Delete a single element (Ticker, Portfolio, Transaction, etc)
    delete(id: number): Observable<any> {
        return this.wolfeHttpService.delete(this.urlPath + '/' + id);
    }

    // Delete multiple elements (Ticker, Portfolio, Transaction, etc)
    deleteList(ids: number[]): Observable<any> {
        return this.wolfeHttpService.delete(this.urlPath, {ids});
    }


    // By Definition, the responses that we get back from the HTTP service will have objects
    // that have nothing but numbers and strings in them.  This method provides a mechanism
    // for those using this service to override and inject "real" Typescript objects that contain
    // real objects (like Dates) and real methods that can be called.
    buildFullyFuctionalModel(thinT: T) {
        return thinT;
    }
}

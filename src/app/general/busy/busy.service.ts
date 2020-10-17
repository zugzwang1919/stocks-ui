import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { BusyEvent, BusyOrFinished } from './busy-event';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  private subject = new Subject<BusyEvent>();

  // enable subscribing to alerts observable
  onActivity(): Observable<BusyEvent> {
      return this.subject.asObservable();
  }


  // indicate that some activity is busy
  busy(taskId: number) {
      const startBusyEvent = new BusyEvent(BusyOrFinished.BUSY, taskId);
      this.subject.next(startBusyEvent);
  }

  // indicate that some activity has completed
  finished(taskId: number) {
    const finishedBusyEvent = new BusyEvent(BusyOrFinished.FINISHED, taskId);
    this.subject.next(finishedBusyEvent);
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BusyEvent, BusyOrFinished } from './busy-event';
import { BusyService } from './busy.service';

@Component({
  selector: 'app-busy',
  templateUrl: './busy.component.html',
  styleUrls: ['./busy.component.sass']
})
export class BusyComponent implements OnInit, OnDestroy {

  eventsInProgress: BusyEvent[] = [];
  busySubscription: Subscription;
  routeSubscription: Subscription;

  constructor(
    private router: Router,
    private busyService: BusyService
    ) { }

  ngOnInit() {
    // subscribe to new busy notifications
    this.busySubscription = this.busyService.onActivity()
        .subscribe((busyEvent: BusyEvent) => {
            if (busyEvent.busyOrFinished === BusyOrFinished.BUSY) {
              this.eventsInProgress.push(busyEvent);
            }
            else {
              this.eventsInProgress = this.eventsInProgress.filter((arrayEvent: BusyEvent) => arrayEvent.activityId !== busyEvent.activityId);
            }
        });

    // clear all Busy Events on location change should anything be in progress
    this.routeSubscription = this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this.eventsInProgress = this.eventsInProgress.filter(busyEvent => false);
        }
    });
  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    this.busySubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

}









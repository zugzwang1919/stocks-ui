import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export enum Timeframe {
  ALL_DATES = 'All Dates',
  THIS_CALENDAR_YEAR = 'This Calendar Year',
  PREVIOUS_CALENDAR_YEAR = 'Previous Calendar Year',
  PREVIOUS_AND_THIS_CALENDAR_YEAR = 'Previous and This Calendar Year',
  LAST_TWELVE_MONTHS = 'Last Twelve Months',
  LAST_TWENTY_FOUR_MONTHS = 'Last Twenty-four Months',
  CUSTOM_DATES = 'Custom Dates'
}

@Injectable({
  providedIn: 'root'
})
export class TimeframeService {

  constructor(
    private cookieService: CookieService
  ) { }


  public getTimeframeFromCookie(cookieName: string): Timeframe{
    const timeframeCookie: string = this.cookieService.get(cookieName);
    let timeframe: Timeframe;
    // NOTE: This seems like a painful way to handle enums
    if (timeframeCookie.length > 0) {
      const tfKey: string = Object.keys(Timeframe).find(x => Timeframe[x] === timeframeCookie);
      timeframe = Timeframe[tfKey];
    }
    return timeframe;
  }

  public calculateStartDate(inputTimeframe: Timeframe, customStartDate: Date): Date {
    const now: Date = new Date();
    switch (inputTimeframe) {
      case Timeframe.THIS_CALENDAR_YEAR:
        return new Date(now.getFullYear() - 1, 11, 31);
      case Timeframe.PREVIOUS_CALENDAR_YEAR:
      case Timeframe.PREVIOUS_AND_THIS_CALENDAR_YEAR:
        return new Date(now.getFullYear() - 2, 11, 31);
      case Timeframe.LAST_TWELVE_MONTHS:
        return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      case Timeframe.LAST_TWENTY_FOUR_MONTHS:
        return new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
       case Timeframe.CUSTOM_DATES:
        return customStartDate;
       case Timeframe.ALL_DATES:
        return undefined;
    }
  }

  public calculateEndDate(inputTimeframe: Timeframe, customEndDate: Date): Date {
    const now: Date = new Date();
    switch (inputTimeframe) {
      case Timeframe.PREVIOUS_CALENDAR_YEAR:
        return new Date(now.getFullYear() - 1, 11, 31);
      case Timeframe.CUSTOM_DATES:
        return customEndDate;
      case Timeframe.THIS_CALENDAR_YEAR:
      case Timeframe.PREVIOUS_AND_THIS_CALENDAR_YEAR:
      case Timeframe.LAST_TWELVE_MONTHS:
      case Timeframe.LAST_TWENTY_FOUR_MONTHS:
      case Timeframe.ALL_DATES:
        return undefined;
    }

  }

}

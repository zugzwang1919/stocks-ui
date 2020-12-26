import { DataSource } from '@angular/cdk/table';
import { CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DetailedPriceDialogComponent } from '../detailed-price-dialog/detailed-price-dialog.component';


@Component({
  selector: 'app-lifecycle-dialog',
  templateUrl: './lifecycle-dialog.component.html',
  styleUrls: ['./lifecycle-dialog.component.sass']
})
export class LifecycleDialogComponent {



  lifecycleDataSource: MatTableDataSource<any>;
  lifecycleDisplayedColumns: string[] = ['date', 'stockActivity', 'stockSize', 'stockProceeds', 'dividendProceeds',
                                          'optionActivity', 'optionNumberOfContracts', 'optionProceeds'];

  constructor(@Inject(MAT_DIALOG_DATA)  public lifecycle: any,
              public eventDialog: MatDialog,
              private currencyPipe: CurrencyPipe) {

    const eventsFromLifecycle = [];

    // Opening Position
    const openingPositionEvent = this.buildEventFromOpeningPosition(lifecycle.openingPosition);
    eventsFromLifecycle.push(openingPositionEvent);

    // Other transactions
    const transactionEvents: any[] = this.buildEventsFromInterveningTransactions(lifecycle.interveningStockTransactions);
    transactionEvents.forEach(transactionEvent => eventsFromLifecycle.push(transactionEvent));

    // Dividends
    const dividendEvents: any[] = this.buildEventsFromDividends(lifecycle.dividendPayments);
    dividendEvents.forEach(dividendEvent => eventsFromLifecycle.push(dividendEvent));

    // Options
    const optionEvents: any[] = this.buildEventsFromOptionTransactions(lifecycle.optionTransactions);
    optionEvents.forEach(optionEvent => eventsFromLifecycle.push(optionEvent));


    // Closing Position
    const closingPositionEvent = this.buildEventFromClosingPosition(lifecycle.closingPosition);
    eventsFromLifecycle.push(closingPositionEvent);


    const sortedEventsFromLifecycle = eventsFromLifecycle.sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
    this.lifecycleDataSource = new MatTableDataSource(sortedEventsFromLifecycle);
  }

  examineEvent(event: any) {
    let s: string;

    if (event.stockProceeds) {
      s = event.stockSize + ' shares at ' + this.currencyPipe.transform(Math.abs(event.stockProceeds / event.stockSize)) + ' per share.';
    }
    else if (event.dividendProceeds) {
      s = event.stockSize + ' shares at ' + this.currencyPipe.transform(event.dividendProceeds / event.stockSize) + ' per share.';
    }
    else if (event.optionProceeds) {
      s = event.optionNumberOfContracts + ' contracts at ' + this.currencyPipe.transform(Math.abs(event.optionProceeds / event.optionNumberOfContracts / 100)) + ' per contract.';
    }
    this.eventDialog.open(DetailedPriceDialogComponent, {data: s} );
  }

  private buildEventFromOpeningPosition(openingPosition: any) {
    return {
      date: openingPosition.date,
      stockActivity: openingPosition.containsOlderTransactions ? 'Opening Position' : 'Buy',
      stockSize: openingPosition.size,
      stockProceeds: openingPosition.proceeds,
      dividendProceeds: '',
      optionActivity: '',
      optionNumberOfContracts: '',
      optionProceeds: ''
    };
  }

  private buildEventsFromDividends(dividendPayments: any[]) {
    return dividendPayments.map(dividendPayment => {
      return {
        date: dividendPayment.dividend.exDividendDate,
        stockActivity: '',
        stockSize: dividendPayment.numberOfShares,
        stockProceeds: '',
        dividendProceeds: dividendPayment.totalAmount,
        optionActivity: '',
        optionNumberOfContracts: '',
        optionProceeds: ''
        };
    });
  }

  private buildEventsFromInterveningTransactions(transactions: any[]) {
    return transactions.map(t => {
      return {
        date: t.date,
        stockActivity: t.activity,
        stockSize: t.tradeSize,
        stockProceeds: t.amount * (t.activity === 'BUY' ? -1 : 1),
        dividendProceeds: '',
        optionActivity: '',
        optionNumberOfContracts: '',
        optionProceeds: ''
      };
    });
  }

  private buildEventsFromOptionTransactions(optionTransactions: any[]) {
    return optionTransactions.map(t => {
      return {
        date: t.date,
        stockActivity: '',
        stockSize: '',
        stockProceeds: '',
        dividendProceeds: '',
        optionActivity: t.activity,
        optionNumberOfContracts: t.numberOfContracts,
        optionProceeds: t.amount * (t.activity.substring(0, 3) === 'BUY' ? -1 : 1)  // Handles 'BUY_TO_OPEN' and 'BUY_TO_CLOSE'
      };
    });
  }

  private buildEventFromClosingPosition(closingPosition: any) {
    return {
      date: closingPosition.date,
      stockActivity: closingPosition.positionActiveAtEndDate ? 'Closing Position' : 'Sell',
      stockSize: closingPosition.size,
      stockProceeds: closingPosition.value,
      dividendProceeds: '',
      optionActivity: '',
      optionNumberOfContracts: '',
      optionProceeds: ''

    };
  }



}

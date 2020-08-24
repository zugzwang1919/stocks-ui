import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe} from '@angular/common';
import { Router } from '@angular/router';


import { Option } from '../option';
import { OptionService } from '../option.service';
import { AlertService } from 'src/app/general/alert/alert.service';
import { WolfeGenericListComponent } from '../../wolfe-common/wolfe-generic-list-component';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.sass']
})
export class OptionsComponent extends WolfeGenericListComponent<Option>  implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select', 'name', 'stock.ticker', 'optionType', 'expirationDate', 'strikePrice'];

  constructor(
    router: Router,
    alertService: AlertService,
    optionService: OptionService,
    changeDetectorRefs: ChangeDetectorRef,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe
  ) {
    super(router,
          alertService,
          optionService,
          changeDetectorRefs,
          '/option',
          (o: Option): string => 'The selected option' );
  }

  buildName(option: Option): string {
      const dayOfMonth: number = +this.datePipe.transform(option.expirationDate, 'dd');
      const dateSubstring: string = dayOfMonth > 14 && dayOfMonth < 22 ?
                                    this.datePipe.transform(option.expirationDate, 'MMM-yyyy') :
                                    this.datePipe.transform(option.expirationDate, 'MM-dd-yyyy');
      return option.stock.ticker + ':' +  dateSubstring + ' - ' +
        this.currencyPipe.transform(option.strikePrice) + ' : ' + option.optionType;
  }
}

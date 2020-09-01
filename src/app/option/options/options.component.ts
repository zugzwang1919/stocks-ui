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

  displayedColumns: string[] = ['select', 'name', 'ticker', 'optionType', 'expirationDate', 'strikePrice'];

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

  flattenItemIfNecessary(o: Option): any {
    const flatItem: any = {};
    flatItem.id = o.id;
    flatItem.createDate = o.createDate;
    flatItem.updateDate = o.updateDate;
    flatItem.optionType = o.optionType;
    flatItem.ticker = o.stock.ticker;
    flatItem.strikePrice = o.strikePrice;
    flatItem.expirationDate = o.expirationDate;
    flatItem.name = o.getName();
    return flatItem;
  }



}

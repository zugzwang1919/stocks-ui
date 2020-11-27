import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { Option } from '../option';
import { OptionService } from '../option.service';
import { AlertService } from 'src/app/general/alert/alert.service';
import { WolfeGenericListDirective } from '../../wolfe-common/wolfe-generic-list-directive';
import { WolfeCheckboxInTableService } from 'src/app/wolfe-common/wolfe-checkbox-in-table.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.sass']
})
export class OptionsComponent extends WolfeGenericListDirective<Option>  implements OnInit {

  displayedColumns: string[] = ['select', 'name', 'ticker', 'optionType', 'expirationDate', 'strikePrice'];

  constructor(
    router: Router,
    alertService: AlertService,
    optionService: OptionService,
    public wcits: WolfeCheckboxInTableService,
  ) {
    super(router,
          alertService,
          optionService,
          '/option');
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

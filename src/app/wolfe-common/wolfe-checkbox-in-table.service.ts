import { Injectable } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { WolfeTrackedItem } from './wolfe-tracked-item';

@Injectable({
  providedIn: 'root'
})
export class WolfeCheckboxInTableService {

  constructor() { }

    /*****  Methods that just help manage checkboxes imbedded in tables in general *****/

    areAllSelected(selectionModel: SelectionModel<any>, dataSource: MatTableDataSource<any>) {
      const numSelected = selectionModel.selected.length;
      const numRows = dataSource.data.length;
      return numSelected === numRows;
    }

    checkboxLabel(selectionModel: SelectionModel<any>, dataSource: MatTableDataSource<any>, row?: WolfeTrackedItem): string {
      if (!row) {
          return `${this.areAllSelected(selectionModel, dataSource) ? 'select' : 'deselect'} all`;
      }
      return (selectionModel.isSelected(row) ? 'deselect ' : 'select ')  + row.id;
    }


    masterToggle(selectionModel: SelectionModel<any>, dataSource: MatTableDataSource<any>) {
      this.areAllSelected(selectionModel, dataSource) ?
          selectionModel.clear() :
          dataSource.data.forEach(row => selectionModel.select(row));
    }
}

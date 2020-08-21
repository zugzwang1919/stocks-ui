import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel} from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AlertService } from 'src/app/general/alert/alert.service';
import { WolfeGenericService } from './wolfe-generic-service';
import { WolfeTrackedItem } from './wolfe-tracked-item';

export class WolfeGenericListComponent<T extends WolfeTrackedItem> {

    initialData: T[] = [];
    dataSource = new MatTableDataSource<T>(this.initialData);
    selection = new SelectionModel<T>(true, []);

    @ViewChild(MatSort) sort: MatSort;
    constructor(
        protected router: Router,
        protected alertService: AlertService,
        protected wolfeTrackedItemService: WolfeGenericService<T>,
        protected changeDetectorRef: ChangeDetectorRef,
        private   beginningOfPath: string,
        private   itemName: ((t: T) => string)
      ) { }


    // tslint:disable-next-line:use-lifecycle-interface
    ngOnInit(): void {
        this.updateWolfeTrackedItems();
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    updateWolfeTrackedItems() {
        this.wolfeTrackedItemService.retrieveAll()
          .subscribe(
            // If this goes well, update the list of Tickers
            items =>  {
              // Set the data in the table to be the data that was returned from the service
              this.dataSource.data = items;
              // Indicate that the data in the table has changed
              this.changeDetectorRef.detectChanges();
              // Reset the check boxes
              this.selection = new SelectionModel<T>(true, []);
            },
            // If the retrieval goes poorly, show the error
            error => this.alertService.error(error)
          );
    }

    deleteSelectedItems() {
        // Before we take any action, clear any error messages that have been previously displayed
        this.alertService.clear();
        // There should be exactly one ticker selected to get here
        const wolfeTrackedItem: T  = this.selection.selected[0];
        // Remember the name of the item that we are about to delete for the error message
        const itemName: string = this.itemName(wolfeTrackedItem);
        this.wolfeTrackedItemService.delete(wolfeTrackedItem.id)
          .subscribe(
            success => {
                this.alertService.success( itemName + ' was successfully deleted');
                this.updateWolfeTrackedItems();
            },
            error => this.alertService.error(error)
          );
      }

    editSelectedItem() {
        // navigate to the appropriate page
        this.router.navigate([this.beginningOfPath + '/' + this.selection.selected[0].id]);
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: T): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} {{T.id}}`;
    }

    isExactlyOneSelected(): boolean {
        return this.selection.selected.length === 1;
    }

    areAnySelected(): boolean {
        return this.selection.selected.length !== 0;
    }
}

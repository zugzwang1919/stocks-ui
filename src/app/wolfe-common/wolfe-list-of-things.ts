import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel} from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AlertService } from 'src/app/general/alert/alert.service';
import { WolfeRDService } from './wolfe-rd';

export class WolfeListOfThings<T> {

    initialData: T[] = [];
    dataSource = new MatTableDataSource<T>(this.initialData);
    selection = new SelectionModel<T>(true, []);

    @ViewChild(MatSort) sort: MatSort;
    constructor(
        private router: Router,
        private alertService: AlertService,
        private thingyService: WolfeRDService<T>,
        private changeDetectorRef: ChangeDetectorRef
      ) { }


    // tslint:disable-next-line:use-lifecycle-interface
    ngOnInit(): void {
        this.updateThings();
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    }

    updateThings() {
        this.thingyService.retrieveAll()
          .subscribe(
            // If this goes well, update the list of Tickers
            portfolios =>  {
              // Set the data in the table to be the data that was returned from the service
              this.dataSource.data = portfolios;
              // Indicate that the data in the table has changed
              this.changeDetectorRef.detectChanges();
              // Reset the check boxes
              this.selection = new SelectionModel<T>(true, []);
            },
            // If the retrieval goes poorly, show the error
            error => this.alertService.error(error)
          );
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
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} ticker id ${row.id}`;
    }

    isExactlyOneSelected(): boolean {
        return this.selection.selected.length === 1;
    }

    areAnySelected(): boolean {
        return this.selection.selected.length !== 0;
    }
}

import { ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel} from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AlertService } from 'src/app/general/alert/alert.service';
import { WolfeGenericService } from './wolfe-generic-service';
import { WolfeTrackedItem } from './wolfe-tracked-item';

export class WolfeGenericListComponent<T extends WolfeTrackedItem> {

    initialData: any[] = [];
    dataSource = new MatTableDataSource(this.initialData);
    selection = new SelectionModel(true, []);

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
        // Asynchronously populate the DataSource
        this.updateWolfeTrackedItems();
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngAfterViewInit(): void {
        // Attach the matSort to our DataSource
        // NOTE:  This needs to occur here rather than during ngOnInit as
        // NOTE:  the matSort has not been created yet.
        this.dataSource.sort = this.sort;
    }

    updateWolfeTrackedItems() {
        this.wolfeTrackedItemService.retrieveAll()
          .subscribe(
            // If this goes well, update the list of Ites (WolfeTrackedItems to be specific)
            items =>  {

              // Flatten the data that was returned by the service so that it can be sorted
              // and then associate it with the DataSource
              this.dataSource.data = items.map(this.flattenItemIfNecessary);
              // Indicate that the data in the table has changed
              this.changeDetectorRef.detectChanges();
              // Reset the check boxes
              this.selection = new SelectionModel(true, []);
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

    // NOTE: Many items are heirarchical in nature.  I could not figure out a way (short of writing a custom sorter)
    // NOTE: that allowed these items to be sortable once they were in a list (for example transaction.portfolio.portfolioName)
    // NOTE: The solution that I've chosen is to let the derived class flatten items if it would like to be able to sort them
    // NOTE: In the above example, the derived class would return a field in the object that was simply transaction.portfolioName
    flattenItemIfNecessary(t: T): any {
        return t;
    }

}

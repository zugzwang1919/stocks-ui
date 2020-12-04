import { ViewChild, Directive } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel} from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AlertService } from 'src/app/general/alert/alert.service';
import { WolfeGenericService } from './wolfe-generic-service';
import { WolfeTrackedItem } from './wolfe-tracked-item';

@Directive()
export class WolfeGenericListDirective<T extends WolfeTrackedItem> {

    initialData: any[] = [];
    unFilteredData: any[] = [];
    dataSource = new MatTableDataSource(this.initialData);
    selection = new SelectionModel(true, []);

    @ViewChild(MatSort) sort: MatSort;


    constructor(
        protected router: Router,
        protected alertService: AlertService,
        protected wolfeTrackedItemService: WolfeGenericService<T>,
        protected   prefixOfEditPath: string,
      ) { }


    // tslint:disable-next-line:use-lifecycle-interface
    ngOnInit(): void {
        // Asynchronously start the population of  the DataSource
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
            // If this goes well, update the list of Items (WolfeTrackedItems to be specific)
            items =>  {

              // Flatten the data that was returned by the service so that it can be sorted
              // and then associate it with the DataSource
              this.dataSource.data = items.map(this.flattenItemIfNecessary);
              this.unFilteredData = items.map(this.flattenItemIfNecessary);
              // Reset the check boxes
              this.selection = new SelectionModel(true, []);
            },
            // If the retrieval goes poorly, show the error
            error => this.alertService.error(error)
          );
    }

    /*
      performFilter() -
        Some lists may want to allow users to filter results.  As the user changes what they want
        to see in the subclass, it is the responsibility of the subclass to call this method
        and this super class will filter results based on the filter function passed in.
    */
    performFilter(filterFunction: (i: any) => boolean) {
      // If we're asked to filter the list of items being displayed, apply the filter
      // to the full set of data & then stick the results into the dataSource so that they will
      // be visible
      this.dataSource.data = this.unFilteredData.filter(filterFunction);
      // Reset the check boxes
      this.selection = new SelectionModel(true, []);
    }

    deleteSelectedItems() {
        // Before we take any action, clear any error messages that have been previously displayed
        this.alertService.clear();
        // Delete all of the items
        const wolfeTrackedItems: T[]  = this.selection.selected;
        this.wolfeTrackedItemService.deleteList(wolfeTrackedItems.map(wti => wti.id))
          .subscribe(
            success => {
                this.alertService.success('Item(s) were successfully deleted.');
                this.updateWolfeTrackedItems();
            },
            error => this.alertService.error(error)
          );
      }

    editSelectedItem() {
        // navigate to the appropriate page
        this.router.navigate([this.prefixOfEditPath + '/' + this.selection.selected[0].id]);
    }

    // NOTE: Many items are heirarchical in nature.  I could not figure out a way (short of writing a custom sorter)
    // NOTE: that allowed these items to be sortable once they were in a list (for example transaction.portfolio.portfolioName)
    // NOTE: The solution that I've chosen is to let the derived class flatten items if it would like to be able to sort them
    // NOTE: In the above example, the derived class would return a field in the object that was simply transaction.portfolioName
    flattenItemIfNecessary(t: T): any {
        return t;
    }

}

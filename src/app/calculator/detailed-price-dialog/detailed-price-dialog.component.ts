import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-detailed-price-dialog',
  templateUrl: './detailed-price-dialog.component.html',
  styleUrls: ['./detailed-price-dialog.component.sass']
})
export class DetailedPriceDialogComponent  {

  displayedString: string;

  constructor(@Inject(MAT_DIALOG_DATA) public stringToDisplay: string) {
    this.displayedString = stringToDisplay;
  }

}

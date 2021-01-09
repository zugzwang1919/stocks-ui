import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs';


import { AlertService } from '../../general/alert/alert.service';
import { Portfolio } from '../portfolio';
import { PortfolioService } from '../portfolio.service';

@Component({
  selector: 'app-portfolio-details',
  templateUrl: './portfolio-details.component.html',
  styleUrls: ['./portfolio-details.component.sass']
})
export class PortfolioDetailsComponent implements OnInit, OnDestroy {

  portfolioDetailsGroup: FormGroup;

  retrievedPortfolioId: number;
  attemptingToCreate: boolean;

  routeSubscription: Subscription;

  constructor(
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private portfolioService: PortfolioService,
    private activatedRoute: ActivatedRoute,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.portfolioDetailsGroup = this.formBuilder.group({
      portfolioName: ['',  [Validators.required ]]
    });

    this.routeSubscription = this.activatedRoute.url.subscribe((urlSegments) => this.initialize(urlSegments));
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  onSubmit() {
    // reset any previous alerts
    this.alertService.clear();


    // Try to create the new security/stock/etf/mutual fund
    if (this.attemptingToCreate) {
      this.portfolioService.create( this.portfolioDetailsGroup.get('portfolioName').value )
        .subscribe(
            // SUCCESS! ->  navigate to the Porfolio List Page
            success  =>  this.router.navigate(['/portfolio']),
            // ERROR! -> Display the error
            error => this.alertService.error(error)
        );
    } else {
      this.portfolioService.update(this.retrievedPortfolioId, this.portfolioDetailsGroup.get('portfolioName').value)
        .subscribe(
          // SUCCESS!
          updatedPortfolio  =>  {
            // Update our version of the portfolio name with whatever the server returned
            this.portfolioDetailsGroup.get('portfolioName').setValue(updatedPortfolio.portfolioName);
            // Display a success message
            this.alertService.success(updatedPortfolio.portfolioName + ' was successfully updated.');
          },
          // ERROR! -> Display the error
          error => this.alertService.error(error)
        );
     }
  }

  getErrorForPortfolioName(): string {
    return this.portfolioDetailsGroup.get('portfolioName').hasError('required') ? 'You must provide a portfolio name.' : '';
  }

  private initialize(urlSegments: UrlSegment[]) {
    this.attemptingToCreate = urlSegments[1].toString() === 'create';
    // If we're setting up for a create request
    if (this.attemptingToCreate) {
      this.portfolioDetailsGroup.get('portfolioName').setValue('');
    }
    // If we're setting up for an edit request (i.e., a non-create request)
    else {
      // Retrieve the requested portfolio & drop it into our Porfolio variable
      const id: number = +(urlSegments[1].toString());
      this.portfolioService.retrieve(id)
        .subscribe(
          foundPortfolio => {
            this.retrievedPortfolioId = foundPortfolio.id;
            this.portfolioDetailsGroup.get('portfolioName').setValue(foundPortfolio.portfolioName);
          },
          error => this.alertService.error(error)
        );
    }
  }

}

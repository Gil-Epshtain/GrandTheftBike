import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BikeTheftsService, iBikeTheft } from '../../services/bike-thefts/bike-thefts.service';

@Component({
  selector: 'app-incident-details',
  templateUrl: './incident-details.component.html',
  styleUrls: ['./incident-details.component.scss']
})
export class IncidentDetailsComponent implements OnInit
{
  public bikeTheft: iBikeTheft;

  public constructor(
    private _activatedRoute: ActivatedRoute,
    private _bikeTheftsService: BikeTheftsService)
  {
    console.log("Incidents-Details.component - ctor");
  }

  public ngOnInit(): void
  {
    const id: number = this._activatedRoute.snapshot.params.id;
    if (id)
    {
      //this._bikeTheftsService.getIncident(id).then( // API V2
      this._bikeTheftsService.getBikeTheft(id).then( // API V3
        (bikeTheft: iBikeTheft) => {
          this.bikeTheft = bikeTheft;
        },
        () => {
          this.bikeTheft = null;
        })
    }
    else
    {
      console.error("Incidents-Details.component - ngOnInit - missing incidentId");
    }

  }
}
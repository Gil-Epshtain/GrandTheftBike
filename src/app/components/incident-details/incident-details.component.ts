import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IncidentsService, iBikeTheft } from './../../services/incidents/incidents.service';

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
    private _incidentsService: IncidentsService)
  {
    console.log("Incidents-Details.component - ctor");
  }

  public ngOnInit(): void
  {
    const incidentId: number = this._activatedRoute.snapshot.params.incidentId;
    if (incidentId)
    {
      this._incidentsService.getIncident(incidentId).then(
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
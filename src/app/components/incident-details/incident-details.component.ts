import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-incident-details',
  templateUrl: './incident-details.component.html',
  styleUrls: ['./incident-details.component.scss']
})
export class IncidentDetailsComponent implements OnInit
{
  public incidentId: number;

  public constructor(
    private _activatedRoute: ActivatedRoute)
  {
    console.log("Incidents-Details.component - ctor");
  }

  public ngOnInit(): void
  {
    this.incidentId = this._activatedRoute.snapshot.params.incidentId;
  }
}
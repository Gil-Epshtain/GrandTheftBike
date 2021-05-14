import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IncidentsService, iIncident } from './../../services/incidents/incidents.service';

@Component({
  selector: 'app-incidents-list',
  templateUrl: './incidents-list.component.html',
  styleUrls: ['./incidents-list.component.scss']
})
export class IncidentsListComponent implements OnInit
{
  public incidentsList: iIncident[];
  public pageNum: number;

  public constructor(
    private _router: Router,
    private _incidentsService: IncidentsService)
  {
    console.log("Incidents-List.component - ctor");
  }

  public ngOnInit(): void
  {
    this.pageNum = 1;

    this._incidentsService.loadBerlinThefts(this.pageNum).then(
      (list: iIncident[]) =>
      {
        this.incidentsList = list
      },
      () => // error
      {
        this.incidentsList = [];
      });
  }

  public onClick_Incident(incident: iIncident): void
  {
    console.log("Incidents-List.component - onClick_Incident");

    this._router.navigate(['incident', incident.id]);
  }
}
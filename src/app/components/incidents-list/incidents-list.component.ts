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
  public theftsList: iIncident[];
  public pageNum: number;

  public constructor(
    private _router: Router,
    private _incidentsService: IncidentsService)
  {
    console.log("Incidents-List.component - ctor");
  }

  public ngOnInit(): void
  {
    this._loadTheftsList();
  }

  private _loadTheftsList(): void
  {
    this.pageNum = 1;

    this._incidentsService.loadBerlinThefts(this.pageNum).then(
      (incidentList: iIncident[]) =>
      {
        this.theftsList = incidentList;
      },
      () => // error
      {
        this.theftsList = [];
      });
  }

  public onClick_Incident(incident: iIncident): void
  {
    console.log("Incidents-List.component - onClick_Incident");

    this._router.navigate(['incident', incident.id]);
  }
}
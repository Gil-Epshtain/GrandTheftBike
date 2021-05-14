import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-incidents-list',
  templateUrl: './incidents-list.component.html',
  styleUrls: ['./incidents-list.component.scss']
})
export class IncidentsListComponent implements OnInit
{
  public constructor(
    private _router: Router)
  {
    console.log("Incidents-List.component - ctor");
  }

  public ngOnInit(): void
  {
  }

  public onClick(incidentId: number): void
  {
    this._router.navigate(['incident', incidentId]);
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

import { BikeTheftsService, iBikeTheft } from '../../services/bike-thefts/bike-thefts.service';

interface iListState
{
  length: number;
  pageSize: number;
  pageSizeOptions: number[];
  pageIndex: number;
}

@Component({
  selector: 'app-incidents-list',
  templateUrl: './incidents-list.component.html',
  styleUrls: ['./incidents-list.component.scss']
})
export class IncidentsListComponent implements OnInit
{
  public theftsList: iBikeTheft[];
  public listState: iListState;

  public constructor(
    private _router: Router,
    private _bikeTheftsService: BikeTheftsService)
  {
    console.log("Incidents-List.component - ctor");
  }

  public ngOnInit(): void
  {
    this._initListState();
    this._loadTheftsList();
  }

  private _initListState(): void
  {
    this.listState =
    {
      length: 0,
      pageSize: 10, // default 10
      pageSizeOptions: [5, 10, 25, 100],
      pageIndex: 0
    };
  }

  private _loadTheftsList(): void
  {
    //this._bikeTheftsService.loadBerlinTheftsIncidents(this.listState.pageIndex, this.listState.pageSize).then( // API V2
    this._bikeTheftsService.loadBerlinBikeThefts(this.listState.pageIndex, this.listState.pageSize).then( // API V3
      (result) =>
      {
        this.theftsList       = result.list;
        this.listState.length = result.total
      },
      () => // error
      {
        this.theftsList = [];
        this.listState.length = 0;
      });
  }

  public onClick_Incident(bikeTheft: iBikeTheft): void
  {
    console.log("Incidents-List.component - onClick_Incident");

    this._router.navigate(['incident', bikeTheft.id]);
  }

  public onChange_Paginator(event: PageEvent): void
  {
    console.log("Incidents-List.component - onChange_Paginator");

    // interface PageEvent
    // {
    //   length: number;
    //   pageSize: number
    //   pageIndex: number;
    //   previousPageIndex: number;
    // }

    if (this.listState.pageIndex != event.pageIndex ||
        this.listState.pageSize  != event.pageSize)
    {
      this.listState.pageIndex = event.pageIndex;
      this.listState.pageSize  = event.pageSize;

      this._loadTheftsList();
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

import * as _ from 'lodash';

import { BikeTheftsService, iBikeTheft } from '../../services/bike-thefts/bike-thefts.service';

interface iPagingState
{
  length: number;
  pageSize: number;
  pageSizeOptions: number[];
  pageIndex: number;
}

enum eLoadingState
{
  Loading = 'loading',
  Success = 'success',
  Empty = 'empty',
  Error = 'error'
}

@Component({
  selector: 'app-incidents-list',
  templateUrl: './incidents-list.component.html',
  styleUrls: ['./incidents-list.component.scss']
})
export class IncidentsListComponent implements OnInit
{
  public theftsList: iBikeTheft[];
  
  public pagingState: iPagingState;
  public loadingState: eLoadingState;

  public filterValue: string;

  public constructor(
    private _router: Router,
    private _bikeTheftsService: BikeTheftsService)
  {
    console.log("Incidents-List.component - ctor");
  }

  public ngOnInit(): void
  {
    this.filterValue = "";

    this._initListState();
    this._loadTheftsList();
  }

  private _initListState(): void
  {
    this.pagingState =
    {
      length: 0,
      pageSize: 10, // default 10
      pageSizeOptions: [5, 10, 25, 100],
      pageIndex: 0
    };
  }

  private _loadTheftsList(filter?: string): void
  {
    this.loadingState = eLoadingState.Loading;

    //this._bikeTheftsService.loadBerlinTheftsIncidents(this.listState.pageIndex, this.listState.pageSize).then( // API V2
    this._bikeTheftsService.loadBerlinBikeThefts(this.pagingState.pageIndex, this.pagingState.pageSize, { title: filter }).then( // API V3
      (result) =>
      {
        this.theftsList = result.list;

        this.pagingState.length = result.total
        this.loadingState = this.theftsList.length ? eLoadingState.Success : eLoadingState.Empty;
      },
      () => // error
      {
        this.theftsList = [];

        this.pagingState.length = 0;
        this.loadingState = eLoadingState.Error;
      });
  }

  public onKeyUp_Filter = _.debounce( // Execute this method after the user stop typing (500ms after)
  (event): void =>
  {
    console.log("Incidents-List.component - onKeyUp_Filter");

    this.runFilter();
  }, 500);

  public runFilter(): void
  {
    const filterVal = this.filterValue.trim().toLowerCase();

    this._loadTheftsList(filterVal);
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

    if (this.pagingState.pageIndex != event.pageIndex ||
        this.pagingState.pageSize  != event.pageSize)
    {
      this.pagingState.pageIndex = event.pageIndex;
      this.pagingState.pageSize  = event.pageSize;

      this._loadTheftsList(this.filterValue);
    }
  }
}